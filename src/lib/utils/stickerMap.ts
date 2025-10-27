import type { StickersConfig } from '@/types/sticker';

let stickerCache: Map<string, string> | null = null;

/**
 * Load stickers configuration and create a map of stickerId -> URL
 */
async function loadStickerMap(): Promise<Map<string, string>> {
  if (stickerCache) {
    return stickerCache;
  }

  try {
    const response = await fetch('/stickers/stickers-config.json');
    if (!response.ok) {
      console.error('Failed to load sticker config');
      return new Map();
    }

    const config: StickersConfig = await response.json();
    const map = new Map<string, string>();

    // Map all stickers from all packs
    config.packs.forEach(pack => {
      pack.stickers.forEach(sticker => {
        map.set(sticker.id, sticker.url);
        // Also support pack.id format (e.g., "ghost/ghost1")
        map.set(`${pack.id}/${sticker.id}`, sticker.url);
      });
    });

    stickerCache = map;
    return map;
  } catch (error) {
    console.error('Error loading sticker map:', error);
    return new Map();
  }
}

/**
 * Get sticker URL by ID
 * Returns the URL if found, otherwise returns a fallback
 */
export async function getStickerUrl(stickerId: string): Promise<string> {
  const map = await loadStickerMap();
  return map.get(stickerId) || `/stickers/${stickerId}.png`;
}

/**
 * Synchronous version - returns undefined if not loaded yet
 * Use this only if stickers are pre-loaded
 */
export function getStickerUrlSync(stickerId: string): string | undefined {
  if (!stickerCache) {
    return undefined;
  }
  return stickerCache.get(stickerId);
}

/**
 * Pre-load sticker map on app initialization
 */
export function preloadStickerMap(): Promise<Map<string, string>> {
  return loadStickerMap();
}
