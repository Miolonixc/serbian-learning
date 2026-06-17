import { useState, useEffect } from 'react';
import { db, type Word, type WordProgress } from '../db';
import { auth } from '../firebase';
import { scheduleSync } from '../utils/sync';
import { getInitialProgress, calculateSM2, getNextReviewDate } from '../utils/spaced-repetition';

const DAILY_WORDS_COUNT = 8;

export function useDailyWords() {
  const [words, setWords] = useState<(Word & { progress?: WordProgress })[]>([]);
  const [loading, setLoading] = useState(true);

  const loadWords = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const allWords = await db.words.toArray();
    if (allWords.length === 0) {
      setWords([]);
      setLoading(false);
      return;
    }

    const allProgress = await db.wordProgress.toArray();
    const progressMap = new Map(allProgress.map(p => [p.wordId, p]));

    const dueWords: (Word & { progress: WordProgress })[] = [];
    const newWords: (Word & { progress?: WordProgress })[] = [];

    for (const word of allWords) {
      const progress = progressMap.get(word.id!);
      if (progress) {
        if (progress.nextReview <= today) {
          dueWords.push({ ...word, progress });
        }
      } else {
        newWords.push(word);
      }
    }

    dueWords.sort(() => Math.random() - 0.5);

    const selected: (Word & { progress?: WordProgress })[] = [
      ...dueWords.slice(0, Math.ceil(DAILY_WORDS_COUNT / 2)),
    ];

    const remaining = DAILY_WORDS_COUNT - selected.length;
    if (remaining > 0) {
      const shuffled = [...newWords].sort(() => Math.random() - 0.5);
      selected.push(...shuffled.slice(0, remaining));
    }

    setWords(selected);
    setLoading(false);
  };

  useEffect(() => {
    loadWords();
  }, []);

  const markKnown = async (wordId: number) => {
    const progress = await db.wordProgress.get(wordId);
    const base = progress || getInitialProgress(wordId);
    const result = calculateSM2(5, base);
    const nextReview = getNextReviewDate(result.interval);

    await db.wordProgress.put({
      ...base,
      interval: result.interval,
      repetitions: result.repetitions,
      easeFactor: result.easeFactor,
      nextReview,
      lastReview: new Date(),
    });

    if (auth.currentUser) scheduleSync(auth.currentUser.uid);
  };

  const markLearning = async (wordId: number) => {
    const progress = await db.wordProgress.get(wordId);
    const base = progress || getInitialProgress(wordId);
    const result = calculateSM2(2, base);
    const nextReview = getNextReviewDate(result.interval);

    await db.wordProgress.put({
      ...base,
      interval: result.interval,
      repetitions: result.repetitions,
      easeFactor: result.easeFactor,
      nextReview,
      lastReview: new Date(),
    });

    if (auth.currentUser) scheduleSync(auth.currentUser.uid);
  };

  return { words, loading, markKnown, markLearning, refresh: loadWords };
}
