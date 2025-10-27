import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "./Message";
import type { UIMessage } from "@/types/chat";

interface MessageListProps {
  messages: UIMessage[];
}

export function MessageList({ messages }: MessageListProps) {
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="text-center space-y-3 max-w-sm">
          <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-2xl bg-muted flex items-center justify-center">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              className="text-muted-foreground"
            >
              <path
                d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <p className="text-muted-foreground">No messages yet</p>
            <p className="text-sm text-muted-foreground">Start the conversation!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 relative">
      <ScrollArea className="h-full w-full" ref={viewportRef}>
        <div className="px-2 sm:px-4 py-4 sm:py-6 space-y-0">
          {messages.map((message) => (
            <Message key={message.id} {...message} />
          ))}
          {/* <div className="h-4 sm:h-6"></div> */}
        </div>
      </ScrollArea>
    </div>
  );
}
