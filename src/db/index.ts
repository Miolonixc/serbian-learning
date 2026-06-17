import Dexie, { type Table } from 'dexie';

export interface Word {
  id?: number;
  serbian: string;
  serbianLatin: string;
  russian: string;
  category: string;
  difficulty: number;
  gender: string | null;
  audio: string;
  examples: { serbian: string; russian: string }[];
}

export interface WordProgress {
  wordId: number;
  interval: number;
  repetitions: number;
  easeFactor: number;
  nextReview: Date;
  lastReview: Date;
}

export interface CompletedLesson {
  id?: number;
  lessonId: string;
  completedAt: Date;
}

export interface ExerciseResult {
  id?: number;
  exerciseId: string;
  correct: boolean;
  date: Date;
}

export interface DailyStats {
  date: string;
  wordsLearned: number;
  exercisesDone: number;
  timeSpent: number;
}

class SerbianLearningDB extends Dexie {
  words!: Table<Word>;
  wordProgress!: Table<WordProgress, number>;
  completedLessons!: Table<CompletedLesson>;
  exerciseResults!: Table<ExerciseResult>;
  dailyStats!: Table<DailyStats, string>;

  constructor() {
    super('SerbianLearning');
    this.version(1).stores({
      words: '++id, serbian, russian, category, difficulty',
      wordProgress: 'wordId, nextReview',
      completedLessons: '++id, lessonId',
      exerciseResults: '++id, exerciseId, date',
      dailyStats: 'date',
    });
  }
}

export const db = new SerbianLearningDB();
