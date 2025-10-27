import { Users } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MembersPanelProps {
  participantCount: number;
  currentNickname: string;
}

export function MembersPanel({ participantCount, currentNickname }: MembersPanelProps) {
  return (
    <div className="w-64 border-r border-border bg-card hidden md:flex flex-col">
      <div className="h-16 px-4 flex items-center gap-2 border-b border-border shrink-0">
        <Users className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Members ({participantCount})</span>
      </div>

      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="p-3 space-y-1">
            {/* Show current user */}
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-muted/50">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <span className="text-sm">
                    {currentNickname.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm truncate">
                    {currentNickname}
                  </p>
                  <span className="text-xs text-muted-foreground">(you)</span>
                </div>
              </div>
            </div>

            {/* Show other participants count */}
            {participantCount > 1 && (
              <div className="px-3 py-2 text-xs text-muted-foreground text-center">
                + {participantCount - 1} other {participantCount === 2 ? 'ghost' : 'ghosts'}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
