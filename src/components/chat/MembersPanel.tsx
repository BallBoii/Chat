import { Users, Circle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Member {
  id: string;
  nickname: string;
  isOnline: boolean;
}

interface MembersPanelProps {
  members: Member[];
  currentUserId: string;
}

export function MembersPanel({ members, currentUserId }: MembersPanelProps) {
  return (
    <div className="w-64 border-r border-border bg-card hidden md:flex flex-col">
      <div className="h-16 px-4 flex items-center gap-2 border-b border-border shrink-0">
        <Users className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Members ({members.length})</span>
      </div>

      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="p-3 space-y-1">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/50 transition-colors"
              >
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <span className="text-sm">
                      {member.nickname.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  {member.isOnline && (
                    <Circle className="absolute -bottom-0.5 -right-0.5 h-3 w-3 fill-success text-success" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm truncate">
                      {member.nickname}
                    </p>
                    {member.id === currentUserId && (
                      <span className="text-xs text-muted-foreground">(you)</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
