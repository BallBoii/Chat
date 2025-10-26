import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GhostLogo } from "./GhostLogo";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface CreateJoinModalProps {
  open: boolean;
  onJoin: (token: string, nickname: string) => void;
}

export function CreateJoinModal({ open, onJoin }: CreateJoinModalProps) {
  const [mode, setMode] = useState<"initial" | "create" | "join">("initial");
  const [nickname, setNickname] = useState("");
  const [token, setToken] = useState("");
  const [createdToken, setCreatedToken] = useState("");
  const [copied, setCopied] = useState(false);

  const generateToken = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  const handleCreate = () => {
    if (!nickname.trim()) {
      toast.error("Please enter a nickname");
      return;
    }
    const newToken = generateToken();
    setCreatedToken(newToken);
  };

  const handleJoin = () => {
    if (!nickname.trim()) {
      toast.error("Please enter a nickname");
      return;
    }
    if (!token.trim()) {
      toast.error("Please enter a room token");
      return;
    }
    onJoin(token.toUpperCase(), nickname);
  };

  const handleContinueToRoom = () => {
    onJoin(createdToken, nickname);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(createdToken);
    setCopied(true);
    toast.success("Token copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} modal>
      <DialogContent className="sm:max-w-md border-border bg-card shadow-2xl" hideClose>
        <DialogHeader className="space-y-3">
          <div className="flex items-center justify-center gap-3">
            <div className="text-primary">
              <GhostLogo size={32} />
            </div>
            <DialogTitle className="text-2xl">GhostRooms</DialogTitle>
          </div>
          <DialogDescription className="text-center text-muted-foreground">
            {mode === "initial" && "Session-only chat. No accounts, no history."}
            {mode === "create" && !createdToken && "Create a temporary room"}
            {mode === "create" && createdToken && "Share this token to invite others"}
            {mode === "join" && "Join an existing room"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {mode === "initial" && (
            <div className="space-y-3">
              <Button
                onClick={() => setMode("create")}
                className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 transition-all duration-200"
              >
                Create New Room
              </Button>
              <Button
                onClick={() => setMode("join")}
                variant="outline"
                className="w-full h-12 rounded-xl border-2 hover:bg-muted transition-all duration-200"
              >
                Join Existing Room
              </Button>
            </div>
          )}

          {mode === "create" && !createdToken && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nickname">Your Nickname</Label>
                <Input
                  id="nickname"
                  placeholder="Ghost Friend"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="h-11 rounded-xl border-border bg-input-background"
                  maxLength={20}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setMode("initial")}
                  variant="outline"
                  className="flex-1 h-11 rounded-xl"
                >
                  Back
                </Button>
                <Button
                  onClick={handleCreate}
                  className="flex-1 h-11 rounded-xl bg-primary hover:bg-primary/90"
                >
                  Create Room
                </Button>
              </div>
            </div>
          )}

          {mode === "create" && createdToken && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Room Token</Label>
                <div className="flex gap-2">
                  <div className="flex-1 flex items-center gap-2 px-4 h-11 rounded-xl bg-muted border border-border">
                    <code className="flex-1 tracking-wider">{createdToken}</code>
                  </div>
                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    size="icon"
                    className="h-11 w-11 rounded-xl"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <Button
                onClick={handleContinueToRoom}
                className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90"
              >
                Enter Room
              </Button>
            </div>
          )}

          {mode === "join" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="join-nickname">Your Nickname</Label>
                <Input
                  id="join-nickname"
                  placeholder="Ghost Friend"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="h-11 rounded-xl border-border bg-input-background"
                  maxLength={20}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="token">Room Token</Label>
                <Input
                  id="token"
                  placeholder="ABC123XY"
                  value={token}
                  onChange={(e) => setToken(e.target.value.toUpperCase())}
                  className="h-11 rounded-xl border-border bg-input-background tracking-wider"
                  maxLength={8}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setMode("initial")}
                  variant="outline"
                  className="flex-1 h-11 rounded-xl"
                >
                  Back
                </Button>
                <Button
                  onClick={handleJoin}
                  className="flex-1 h-11 rounded-xl bg-primary hover:bg-primary/90"
                >
                  Join Room
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="absolute inset-0 -z-10 overflow-hidden rounded-lg pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
