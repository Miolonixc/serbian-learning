import { db } from '../db';
import type { Word } from '../db';
import vocabularyData from '../data/vocabulary.json';

const DB_VERSION_KEY = 'serbian_db_version';
const CURRENT_VERSION = 2;

export async function seedDatabase(): Promise<void> {
  const storedVersion = localStorage.getItem(DB_VERSION_KEY);
  const wordCount = await db.words.count();

  if (wordCount > 0 && storedVersion === String(CURRENT_VERSION)) {
    return;
  }

  try {
    await db.words.clear();
    await db.words.bulkAdd(vocabularyData as Word[]);

    localStorage.setItem(DB_VERSION_KEY, String(CURRENT_VERSION));
    console.log(`Seeded ${vocabularyData.length} words into IndexedDB`);
  } catch (e) {
    console.error('Failed to seed database:', e);
  }
}
