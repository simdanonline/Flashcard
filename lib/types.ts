export interface Card {
  id: number;
  front: string;
  back: string;
  created_at: string;
  updated_at: string;
  next_review_at: string;
  review_count: number;
  last_difficulty: Difficulty | null;
}

export type Difficulty = 'easy' | 'mid' | 'hard' | 'very_hard';

export type NewCard = Pick<Card, 'front' | 'back'>;

export interface IntervalSettings {
  easyMinutes: number;
  midMinutes: number;
  hardMinutes: number;
  veryHardMinutes: number;
}

export type SettingKey = keyof IntervalSettings;

// Content block types for rich card content (images, code)

export interface TextBlock {
  type: 'text';
  value: string;
}

export interface ImageBlock {
  type: 'image';
  uri: string;
}

export interface CodeBlock {
  type: 'code';
  value: string;
}

export type ContentBlock = TextBlock | ImageBlock | CodeBlock;
