export interface Message {
  id: string;
  username: string;
  text: string;
  timestamp: Date;
  type?: 'text' | 'sticker';
  stickerUrl?: string;
  stickerId?: string;
}

export interface User {
  id: string;
  username: string;
}
