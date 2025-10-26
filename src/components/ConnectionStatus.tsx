'use client';

import React from 'react';
import { useSocket } from '@/context/SocketContext';

const ConnectionStatus: React.FC = () => {
  const { connected } = useSocket();

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700">
      <div
        className={`w-3 h-3 rounded-full ${
          connected ? 'bg-green-500' : 'bg-red-500'
        }`}
      />
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {connected ? 'Connected' : 'Disconnected'}
      </span>
    </div>
  );
};

export default ConnectionStatus;
