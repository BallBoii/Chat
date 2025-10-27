'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Message } from '@/types/chat';
import { Sticker } from '@/types/sticker';

interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
  messages: Message[];
  sendMessage: (text: string) => void;
  sendSticker: (sticker: Sticker) => void;
  username: string;
  setUsername: (name: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';
    const newSocket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket server');
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      setConnected(false);
    });

    newSocket.on('message', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    newSocket.on('chat-history', (history: Message[]) => {
      setMessages(history);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const sendMessage = (text: string) => {
    if (socket && text.trim() && username.trim()) {
      const message: Omit<Message, 'id' | 'timestamp'> = {
        username,
        text: text.trim(),
        type: 'text',
      };
      socket.emit('send-message', message);
    }
  };

  const sendSticker = (sticker: Sticker) => {
    if (socket && username.trim()) {
      const message: Omit<Message, 'id' | 'timestamp'> = {
        username,
        text: '',
        type: 'sticker',
        stickerUrl: sticker.url,
        stickerId: sticker.id,
      };
      socket.emit('send-sticker', message);
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        connected,
        messages,
        sendMessage,
        sendSticker,
        username,
        setUsername,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
