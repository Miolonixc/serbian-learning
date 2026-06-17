import { useState, useEffect } from 'react';
import { db } from '../db';

export interface ProgressStats {
  totalWords: number;
  learnedWords: number;
  wordsInProgress: number;
  streak: number;
  totalExercises: number;
  correctExercises: number;
  lessonsCompleted: number;
  todayWordsLearned: number;
  todayExercisesDone: number;
}

export function useProgress() {
  const [stats, setStats] = useState<ProgressStats>({
    totalWords: 0,
    learnedWords: 0,
    wordsInProgress: 0,
    streak: 0,
    totalExercises: 0,
    correctExercises: 0,
    lessonsCompleted: 0,
    todayWordsLearned: 0,
    todayExercisesDone: 0,
  });
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    const totalWords = await db.words.count();
    const allProgress = await db.wordProgress.toArray();

    const learnedWords = allProgress.filter(p => p.repetitions >= 3).length;
    const wordsInProgress = allProgress.filter(p => p.repetitions > 0 && p.repetitions < 3).length;

    const exerciseResults = await db.exerciseResults.toArray();
    const totalExercises = exerciseResults.length;
    const correctExercises = exerciseResults.filter(e => e.correct).length;

    const lessonsCompleted = await db.completedLessons.count();

    const today = new Date().toISOString().split('T')[0];
    const todayStats = await db.dailyStats.get(today);
    const todayWordsLearned = todayStats?.wordsLearned || 0;
    const todayExercisesDone = todayStats?.exercisesDone || 0;

    let streak = 0;
    const dates = await db.dailyStats.orderBy('date').reverse().toArray();
    for (const dateEntry of dates) {
      const d = new Date(dateEntry.date);
      const expected = new Date();
      expected.setDate(expected.getDate() - streak);
      expected.setHours(0, 0, 0, 0);
      d.setHours(0, 0, 0, 0);

      if (d.getTime() === expected.getTime() && (dateEntry.wordsLearned > 0 || dateEntry.exercisesDone > 0)) {
        streak++;
      } else if (d.getTime() < expected.getTime()) {
        break;
      }
    }

    setStats({
      totalWords,
      learnedWords,
      wordsInProgress,
      streak,
      totalExercises,
      correctExercises,
      lessonsCompleted,
      todayWordsLearned,
      todayExercisesDone,
    });
    setLoading(false);
  };

  useEffect(() => {
    loadStats();
  }, []);

  const recordDailyStat = async (type: 'words' | 'exercises', count: number = 1) => {
    const today = new Date().toISOString().split('T')[0];
    const existing = await db.dailyStats.get(today);

    if (existing) {
      const update: Record<string, number> = {};
      if (type === 'words') update.wordsLearned = existing.wordsLearned + count;
      if (type === 'exercises') update.exercisesDone = existing.exercisesDone + count;
      await db.dailyStats.update(today, update);
    } else {
      await db.dailyStats.put({
        date: today,
        wordsLearned: type === 'words' ? count : 0,
        exercisesDone: type === 'exercises' ? count : 0,
        timeSpent: 0,
      });
    }
    loadStats();
  };

  return { stats, loading, refresh: loadStats, recordDailyStat };
}
