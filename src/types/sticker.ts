export interface Sticker {
  id: string;
  name: string;
  url: string;
  thumbnail: string;
  keywords: string[];
}

export interface StickerPack {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  stickers: Sticker[];
}

export interface StickersConfig {
  packs: StickerPack[];
}
