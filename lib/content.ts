import { Paths, Directory, File } from 'expo-file-system';
import type { ContentBlock } from './types';

const imageDir = new Directory(Paths.document, 'card-images');

export function ensureImageDir(): void {
  if (!imageDir.exists) {
    imageDir.create();
  }
}

/**
 * Parse a stored string into ContentBlock[].
 * Backward compatible: plain strings become a single TextBlock.
 */
export function parseContent(raw: string): ContentBlock[] {
  if (!raw || !raw.trim()) return [{ type: 'text', value: '' }];

  if (!raw.trimStart().startsWith('[')) {
    return [{ type: 'text', value: raw }];
  }

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].type) {
      return parsed as ContentBlock[];
    }
  } catch {
    // Not valid JSON — treat as plain text
  }

  return [{ type: 'text', value: raw }];
}

/**
 * Serialize ContentBlock[] to a string for storage.
 * Single text block → plain string for backward compat.
 */
export function serializeContent(blocks: ContentBlock[]): string {
  const nonEmpty = blocks.filter((b) => {
    if (b.type === 'text' || b.type === 'code') return b.value.trim().length > 0;
    if (b.type === 'image') return b.uri.length > 0;
    return false;
  });

  if (nonEmpty.length === 0) return '';
  if (nonEmpty.length === 1 && nonEmpty[0].type === 'text') {
    return nonEmpty[0].value;
  }

  return JSON.stringify(nonEmpty);
}

/**
 * Copy a picked image into the app's card-images directory.
 */
export function copyImageToAppStorage(sourceUri: string): string {
  ensureImageDir();
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
  const source = new File(sourceUri);
  const dest = new File(imageDir, filename);
  source.copy(dest);
  return dest.uri;
}

export function deleteImageFile(uri: string): void {
  try {
    const file = new File(uri);
    if (file.exists) {
      file.delete();
    }
  } catch {
    // ignore — file may already be gone
  }
}

function extractImageUris(raw: string): string[] {
  const blocks = parseContent(raw);
  return blocks
    .filter((b): b is { type: 'image'; uri: string } => b.type === 'image')
    .map((b) => b.uri);
}

/**
 * Clean up all images referenced by a card's front and back content.
 */
export function cleanupCardImages(front: string, back: string): void {
  const uris = [...extractImageUris(front), ...extractImageUris(back)];
  uris.forEach(deleteImageFile);
}

/**
 * Plain-text preview of content for list items.
 */
export function getContentPreview(raw: string, maxLength = 80): string {
  const blocks = parseContent(raw);
  const parts: string[] = [];

  for (const block of blocks) {
    if (block.type === 'text') parts.push(block.value);
    else if (block.type === 'code') parts.push('[code]');
    else if (block.type === 'image') parts.push('[image]');
  }

  const full = parts.join(' ').trim();
  return full.length > maxLength ? full.slice(0, maxLength) + '...' : full;
}
