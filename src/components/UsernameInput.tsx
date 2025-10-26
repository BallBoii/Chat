'use client';

import React, { useState } from 'react';
import { useSocket } from '@/context/SocketContext';

const UsernameInput: React.FC = () => {
  const [input, setInput] = useState('');
  const { setUsername, username } = useSocket();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setUsername(input.trim());
    }
  };

  if (username) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Welcome to Chat
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Please enter your username to start chatting
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your username"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 mb-4"
            autoFocus
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="w-full px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Start Chatting
          </button>
        </form>
      </div>
    </div>
  );
};

export default UsernameInput;
