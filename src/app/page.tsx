'use client';

import { useState, useEffect } from "react";
import { CreateJoinModal } from "@/components/chat/CreateJoinModal";
import { TopBar } from "@/components/chat/TopBar";
import { MembersPanel } from "@/components/chat/MembersPanel";
import { MessageList } from "@/components/chat/MessageList";
import { MessageComposer } from "@/components/chat/MessageComposer";
import { MobileNav } from "@/components/chat/MobileNav";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { CuteBackground } from "@/components/chat/CuteBackground";
import { Toaster } from "@/components/ui/sonner";
import { Users, Settings as SettingsIcon, LogOut, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useSocket } from "@/context/SocketContext";
import type { Sticker } from "@/types/sticker";

interface Session {
  token: string;
  nickname: string;
  userId: string;
}

interface MessageData {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
  isMine: boolean;
  isSystem?: boolean;
  type: 'text' | 'sticker';
  stickerUrl?: string;
  stickerId?: string;
}

interface Member {
  id: string;
  nickname: string;
  isOnline: boolean;
}

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [timeLeft, setTimeLeft] = useState("59:45");
  const [mobileTab, setMobileTab] = useState<"chat" | "members" | "settings">("chat");
  const [darkMode, setDarkMode] = useState(false);

  const { sendMessage, sendSticker } = useSocket();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    // Simulate countdown timer
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const [mins, secs] = prev.split(":").map(Number);
        const totalSecs = mins * 60 + secs - 1;
        if (totalSecs <= 0) return "00:00";
        const newMins = Math.floor(totalSecs / 60);
        const newSecs = totalSecs % 60;
        return `${String(newMins).padStart(2, "0")}:${String(newSecs).padStart(2, "0")}`;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleJoin = (token: string, nickname: string) => {
    const userId = Math.random().toString(36).substring(7);
    setSession({ token, nickname, userId });

    // Add welcome message
    setMessages([
      {
        id: "1",
        content: `${nickname} joined the room`,
        sender: "System",
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        isMine: false,
        isSystem: true,
        type: 'text'
      },
    ]);

    // Add demo members
    setMembers([
      { id: userId, nickname, isOnline: true },
      { id: "2", nickname: "Sarah Chen", isOnline: true },
      { id: "3", nickname: "Alex Kim", isOnline: true },
      { id: "4", nickname: "Jordan Smith", isOnline: false },
    ]);
  };

  const handleSendMessage = (content: string) => {
    if (!session) return;

    const newMessage: MessageData = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      content,
      sender: session.nickname,
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      isMine: true,
      type: 'text',
    };

    setMessages((prev) => [...prev, newMessage]);

    // Simulate a response
    setTimeout(() => {
      const responses = [
        "That's interesting! Tell me more.",
        "I agree with that perspective.",
        "Cool! 😊",
        "Thanks for sharing!",
      ];
      const randomMember = members.find((m) => m.id !== session.userId);
      if (randomMember) {
        setMessages((prev) => [
          ...prev,
          {
            id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            content: responses[Math.floor(Math.random() * responses.length)],
            sender: randomMember.nickname,
            timestamp: new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            isMine: false,
            type: 'text',
          },
        ]);
      }
    }, 1000 + Math.random() * 2000);
  };

  const handleSendSticker = (sticker: Sticker) => {
    if (!session) return;

    const newMessage: MessageData = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      content: sticker.name, // Use sticker name as content
      sender: session.nickname,
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      isMine: true,
      type: 'sticker',
      stickerUrl: sticker.url,
      stickerId: sticker.id,
    };

    setMessages((prev) => [...prev, newMessage]);

    // Simulate a sticker response from other members
    setTimeout(() => {
      const stickerResponses = [
        { name: "Happy Ghost", url: "/stickers/ghost/ghost1.png", id: "ghost-1" },
        { name: "Surprised Ghost", url: "/stickers/ghost/ghost3.png", id: "ghost-3" },
      ];
      const randomSticker = stickerResponses[Math.floor(Math.random() * stickerResponses.length)];
      const randomMember = members.find((m) => m.id !== session.userId);
      
      if (randomMember) {
        setMessages((prev) => [
          ...prev,
          {
            id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            content: randomSticker.name,
            sender: randomMember.nickname,
            timestamp: new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            isMine: false,
            type: 'sticker',
            stickerUrl: randomSticker.url,
            stickerId: randomSticker.id,
          },
        ]);
      }
    }, 1000 + Math.random() * 2000);
  };

  const handleLogout = () => {
    setSession(null);
    setMessages([]);
    setMembers([]);
    setMobileTab("chat");
  };

  const handleCopyToken = () => {
    if(!session) return;

    navigator.clipboard.writeText(session.token);
    toast.success("Token copied to clipboard");
  };

  if (!session) {
    return (
      <>
        <div className="size-full flex items-center justify-center">
          <CuteBackground />
        </div>
        <CreateJoinModal open={true} onJoin={handleJoin} />
        <Toaster />
      </>
    );
  }

  return (
    <div className="size-full flex items-center justify-center p-4 lg:p-6">
      <CuteBackground />
      
      {/* Desktop & Tablet: Floating Window */}
      <div className="hidden md:flex w-full h-full items-center justify-center relative z-10">
        <ChatWindow>
          <TopBar token={session.token} timeLeft={timeLeft} darkMode={darkMode} setDarkMode={setDarkMode} />
          
          <div className="flex-1 flex overflow-hidden">
            <MembersPanel members={members} currentUserId={session.userId} />
            
            <div className="flex-1 flex flex-col">
              <MessageList messages={messages} />
              <MessageComposer 
                onSend={handleSendMessage} 
                onStickerSend={handleSendSticker}
              />
            </div>
          </div>
        </ChatWindow>
      </div>

      {/* Mobile: Fullscreen */}
      <div className="md:hidden flex flex-col fixed inset-0 z-10 pb-20">
        <div className="w-full h-full p-5 sm:p-6 flex items-center justify-center">
          <div className="flex flex-col w-full h-full rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-border/50 backdrop-blur-sm bg-card/95">
            <TopBar token={session.token} timeLeft={timeLeft} darkMode={darkMode} setDarkMode={setDarkMode} />

            <div className="flex-1 flex overflow-hidden pb-5">
              {/* Main Chat Area */}
              <div className={`flex-1 flex flex-col ${mobileTab === "chat" ? "flex" : "hidden"}`}>
                <MessageList messages={messages} />
                <MessageComposer 
                  onSend={handleSendMessage} 
                  onStickerSend={handleSendSticker}  
                />
              </div>

          {/* Mobile Members Panel */}
          {mobileTab === "members" && (
            <div className="flex-1 flex flex-col bg-card overflow-hidden">
              <div className="h-16 px-4 flex items-center gap-2 border-b border-border">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Members ({members.length})</span>
              </div>
              <div className="flex-1 overflow-auto p-3 space-y-1">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/50 transition-colors"
                  >
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <span className="text-sm">{member.nickname.charAt(0).toUpperCase()}</span>
                      </div>
                      {member.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-success border-2 border-card" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm truncate">{member.nickname}</p>
                        {member.id === session.userId && (
                          <span className="text-xs text-muted-foreground">(you)</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mobile Settings Panel */}
          {mobileTab === "settings" && (
            <div className="flex-1 flex flex-col bg-card overflow-hidden">
              <div className="h-16 px-4 flex items-center gap-2 border-b border-border">
                <SettingsIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Settings</span>
              </div>
              <div className="flex-1 overflow-auto p-4 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3">
                    <div className="space-y-0.5">
                      <Label htmlFor="dark-mode">Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">Toggle dark theme</p>
                    </div>
                    <Switch
                      id="dark-mode"
                      checked={darkMode}
                      onCheckedChange={setDarkMode}
                      className="bg-muted-foreground/10"
                    />
                  </div>

                  <div className="pt-4 border-t border-border">
                    <div className="space-y-2">
                      <Label>Current Session</Label>
                      <p className="text-sm text-muted-foreground">
                        Logged in as <span className="text-foreground">{session.nickname}</span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Room: <code className="text-foreground cursor-pointer inline-flex items-center gap-1 group hover:text-muted-foreground transition-colors" onClick={handleCopyToken}>
                                {session.token}
                                <Copy className="h-3 w-3" />
                              </code>
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={handleLogout}
                    variant="destructive"
                    className="w-full rounded-xl h-11"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Leave Room
                  </Button>
                </div>
              </div>
            </div>
          )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation - Outside container so it's positioned correctly */}
      <MobileNav activeTab={mobileTab} onTabChange={setMobileTab} />

      <Toaster />
    </div>
  );
}
