import { GhostLogo } from "./GhostLogo";
import { Badge } from "@/components/ui/badge";
import { Clock, Copy } from "lucide-react";
import { toast } from "sonner";

interface TopBarProps {
  token: string;
  timeLeft: string;
}

export function TopBar({ token, timeLeft }: TopBarProps) {
  const handleCopyToken = () => {
    navigator.clipboard.writeText(token);
    toast.success("Token copied to clipboard");
  };

  return (
    <div className="h-16 border-b border-border bg-card px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <div className="text-primary">
          <GhostLogo size={28} />
        </div>
        <h1 className="text-xl">GhostRooms</h1>
      </div>

      <div className="flex items-center gap-3">
        <Badge
          variant="secondary"
          className="h-8 px-3 rounded-full bg-muted hover:bg-muted border-0 cursor-pointer group"
          onClick={handleCopyToken}
        >
          <span className="tracking-wider mr-2">{token}</span>
          <Copy className="h-3 w-3 opacity-50 group-hover:opacity-100 transition-opacity" />
        </Badge>
        <Badge
          variant="outline"
          className="h-8 px-3 rounded-full border-border"
        >
          <Clock className="h-3 w-3 mr-1.5" />
          <span className="text-xs">{timeLeft}</span>
        </Badge>
      </div>
    </div>
  );
}
