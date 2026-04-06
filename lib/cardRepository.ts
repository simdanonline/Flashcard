import { getDatabase } from './database';
import { cleanupCardImages } from './content';
import type { Card, NewCard } from './types';

export async function getDueCards(): Promise<Card[]> {
  const db = await getDatabase();
  return db.getAllAsync<Card>(
    `SELECT * FROM cards WHERE next_review_at <= datetime('now') ORDER BY next_review_at ASC`
  );
}

export async function getAllCards(): Promise<Card[]> {
  const db = await getDatabase();
  return db.getAllAsync<Card>('SELECT * FROM cards ORDER BY created_at DESC');
}

export async function getCardById(id: number): Promise<Card | null> {
  const db = await getDatabase();
  return db.getFirstAsync<Card>('SELECT * FROM cards WHERE id = ?', id);
}

export async function createCard(card: NewCard): Promise<number> {
  const db = await getDatabase();
  const result = await db.runAsync(
    'INSERT INTO cards (front, back) VALUES (?, ?)',
    card.front,
    card.back
  );
  return result.lastInsertRowId;
}

export async function updateCard(id: number, card: NewCard): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `UPDATE cards SET front = ?, back = ?, updated_at = datetime('now') WHERE id = ?`,
    card.front,
    card.back,
    id
  );
}

export async function deleteCard(id: number): Promise<void> {
  const db = await getDatabase();
  const card = await db.getFirstAsync<{ front: string; back: string }>(
    'SELECT front, back FROM cards WHERE id = ?',
    id
  );
  if (card) {
    cleanupCardImages(card.front, card.back);
  }
  await db.runAsync('DELETE FROM cards WHERE id = ?', id);
}

export async function updateCardReview(
  id: number,
  nextReviewAt: string,
  difficulty: string
): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `UPDATE cards
     SET next_review_at = ?,
         last_difficulty = ?,
         review_count = review_count + 1,
         updated_at = datetime('now')
     WHERE id = ?`,
    nextReviewAt,
    difficulty,
    id
  );
}

export async function getFutureCards(): Promise<Card[]> {
  const db = await getDatabase();
  return db.getAllAsync<Card>(
    `SELECT * FROM cards WHERE next_review_at > datetime('now') ORDER BY next_review_at ASC`
  );
}
