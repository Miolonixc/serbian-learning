import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db as firestore } from '../firebase';
import { db as localDB } from '../db';

interface UserData {
  name: string;
  wordProgress: Record<number, {
    interval: number;
    repetitions: number;
    easeFactor: number;
    nextReview: string;
    lastReview: string;
  }>;
  completedLessons: Record<string, { completedAt: string }>;
  exerciseResults: { exerciseId: string; correct: boolean; date: string }[];
  dailyStats: Record<string, { wordsLearned: number; exercisesDone: number; timeSpent: number }>;
}

export async function loadFromCloud(uid: string): Promise<boolean> {
  try {
    const snap = await getDoc(doc(firestore, 'users', uid));
    if (!snap.exists()) {
      console.log('No cloud data for user');
      return false;
    }

    const data = snap.data() as UserData;

    await localDB.transaction('rw', localDB.wordProgress, localDB.completedLessons, localDB.exerciseResults, localDB.dailyStats, async () => {
      await localDB.wordProgress.clear();
      for (const [wordId, progress] of Object.entries(data.wordProgress || {})) {
        await localDB.wordProgress.put({
          wordId: Number(wordId),
          interval: progress.interval,
          repetitions: progress.repetitions,
          easeFactor: progress.easeFactor,
          nextReview: new Date(progress.nextReview),
          lastReview: new Date(progress.lastReview),
        });
      }

      await localDB.completedLessons.clear();
      for (const [lessonId, lesson] of Object.entries(data.completedLessons || {})) {
        await localDB.completedLessons.add({
          lessonId,
          completedAt: new Date(lesson.completedAt),
        });
      }

      await localDB.exerciseResults.clear();
      for (const result of data.exerciseResults || []) {
        await localDB.exerciseResults.add({
          exerciseId: result.exerciseId,
          correct: result.correct,
          date: new Date(result.date),
        });
      }

      await localDB.dailyStats.clear();
      for (const [date, stats] of Object.entries(data.dailyStats || {})) {
        await localDB.dailyStats.put({
          date,
          wordsLearned: stats.wordsLearned,
          exercisesDone: stats.exercisesDone,
          timeSpent: stats.timeSpent,
        });
      }
    });

    console.log('Loaded data from cloud');
    return true;
  } catch (e) {
    console.error('Failed to load from cloud:', e);
    return false;
  }
}

export async function saveToCloud(uid: string): Promise<void> {
  try {
    const wordProgressArr = await localDB.wordProgress.toArray();
    const wordProgress: UserData['wordProgress'] = {};
    for (const p of wordProgressArr) {
      wordProgress[p.wordId] = {
        interval: p.interval,
        repetitions: p.repetitions,
        easeFactor: p.easeFactor,
        nextReview: p.nextReview.toISOString(),
        lastReview: p.lastReview.toISOString(),
      };
    }

    const completedLessonsArr = await localDB.completedLessons.toArray();
    const completedLessons: UserData['completedLessons'] = {};
    for (const l of completedLessonsArr) {
      completedLessons[l.lessonId] = { completedAt: l.completedAt.toISOString() };
    }

    const exerciseResultsArr = await localDB.exerciseResults.toArray();
    const exerciseResults = exerciseResultsArr.slice(-100).map(r => ({
      exerciseId: r.exerciseId,
      correct: r.correct,
      date: r.date.toISOString(),
    }));

    const dailyStatsArr = await localDB.dailyStats.toArray();
    const dailyStats: UserData['dailyStats'] = {};
    for (const s of dailyStatsArr) {
      dailyStats[s.date] = {
        wordsLearned: s.wordsLearned,
        exercisesDone: s.exercisesDone,
        timeSpent: s.timeSpent,
      };
    }

    await setDoc(doc(firestore, 'users', uid), {
      wordProgress,
      completedLessons,
      exerciseResults,
      dailyStats,
    }, { merge: true });

    console.log('Saved data to cloud');
  } catch (e) {
    console.error('Failed to save to cloud:', e);
  }
}

let syncTimeout: ReturnType<typeof setTimeout> | null = null;

export function scheduleSync(uid: string): void {
  if (syncTimeout) clearTimeout(syncTimeout);
  syncTimeout = setTimeout(() => saveToCloud(uid), 2000);
}
