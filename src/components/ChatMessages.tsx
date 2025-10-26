'use client';

import React, { useEffect, useRef } from 'react';
import { useSocket } from '@/context/SocketContext';
import { Message } from '@/types/chat';

const ChatMessages: React.FC = () => {
  const { messages, username } = useSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (timestamp: Date) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
          <p>No messages yet. Start the conversation!</p>
        </div>
      ) : (
        messages.map((message: Message) => {
          const isOwnMessage = message.username === username;
          return (
            <div
              key={message.id}
              className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-lg ${
                  isOwnMessage
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-sm font-semibold ${
                    isOwnMessage ? 'text-blue-100' : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {message.username}
                  </span>
                  <span className={`text-xs ${
                    isOwnMessage ? 'text-blue-200' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                <p className="break-words">{message.text}</p>
              </div>
            </div>
          );
        })
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
