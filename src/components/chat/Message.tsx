interface MessageProps {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
  isMine: boolean;
  isSystem?: boolean;
}

export function Message({ content, sender, timestamp, isMine, isSystem }: MessageProps) {
  if (isSystem) {
    return (
      <div className="flex justify-center my-4">
        <div className="px-4 py-2 rounded-full bg-muted text-xs text-muted-foreground">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex gap-3 mb-4 ${isMine ? "flex-row-reverse" : ""}`}>
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
        <span className="text-sm">{sender.charAt(0).toUpperCase()}</span>
      </div>
      <div className={`flex flex-col gap-1 max-w-md ${isMine ? "items-end" : ""}`}>
        <div className="flex items-center gap-2 px-1">
          <span className="text-xs text-muted-foreground">
            {isMine ? "You" : sender}
          </span>
          <span className="text-xs text-muted-foreground">{timestamp}</span>
        </div>
        <div
          className={`px-4 py-2.5 rounded-2xl ${
            isMine
              ? "bg-primary text-primary-foreground rounded-tr-md"
              : "bg-muted text-foreground rounded-tl-md"
          }`}
        >
          <p className="text-sm whitespace-pre-wrap break-words">{content}</p>
        </div>
      </div>
    </div>
  );
}
