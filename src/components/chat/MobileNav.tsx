import { MessageSquare, Users, Settings } from "lucide-react";

interface MobileNavProps {
  activeTab: "chat" | "members" | "settings";
  onTabChange: (tab: "chat" | "members" | "settings") => void;
}

export function MobileNav({ activeTab, onTabChange }: MobileNavProps) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border flex items-center justify-around px-4 z-50">
      <button
        onClick={() => onTabChange("chat")}
        className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
          activeTab === "chat" ? "text-primary" : "text-muted-foreground"
        }`}
      >
        <MessageSquare className="h-5 w-5" />
        <span className="text-xs">Chat</span>
      </button>
      <button
        onClick={() => onTabChange("members")}
        className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
          activeTab === "members" ? "text-primary" : "text-muted-foreground"
        }`}
      >
        <Users className="h-5 w-5" />
        <span className="text-xs">Members</span>
      </button>
      <button
        onClick={() => onTabChange("settings")}
        className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
          activeTab === "settings" ? "text-primary" : "text-muted-foreground"
        }`}
      >
        <Settings className="h-5 w-5" />
        <span className="text-xs">Settings</span>
      </button>
    </div>
  );
}
