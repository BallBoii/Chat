import { ReactNode } from "react";

interface ChatWindowProps {
  children: ReactNode;
}

export function ChatWindow({ children }: ChatWindowProps) {
  return (
    <div className="w-full max-w-6xl h-[90vh] max-h-[900px] mx-auto flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-border/50 backdrop-blur-sm bg-card/95">
      {children}
    </div>
  );
}
