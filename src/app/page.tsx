'use client';

import ChatMessages from '@/components/ChatMessages';
import ChatInput from '@/components/ChatInput';
import ConnectionStatus from '@/components/ConnectionStatus';
import UsernameInput from '@/components/UsernameInput';

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Chat Application
          </h1>
        </div>
        <ConnectionStatus />
      </header>
      
      <main className="flex-1 max-w-7xl w-full mx-auto flex flex-col overflow-hidden">
        <ChatMessages />
        <ChatInput />
      </main>

      <UsernameInput />
    </div>
  );
}
