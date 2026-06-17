import type { WordProgress } from '../db';

export interface SM2Result {
  interval: number;
  repetitions: number;
  easeFactor: number;
}

const MIN_EASE = 1.3;

export function calculateSM2(
  quality: number,
  progress: WordProgress
): SM2Result {
  let { interval, repetitions, easeFactor } = progress;

  if (quality >= 3) {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 3;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  } else {
    repetitions = 0;
    interval = 1;
  }

  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easeFactor < MIN_EASE) easeFactor = MIN_EASE;

  return { interval, repetitions, easeFactor };
}

export function getNextReviewDate(interval: number): Date {
  const next = new Date();
  next.setDate(next.getDate() + interval);
  return next;
}

export function getInitialProgress(wordId: number): WordProgress {
  const now = new Date();
  return {
    wordId,
    interval: 0,
    repetitions: 0,
    easeFactor: 2.5,
    nextReview: now,
    lastReview: now,
  };
}
