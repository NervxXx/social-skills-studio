import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Volume2, Lightbulb, Moon, Bell, Globe, Trash2, LogOut, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/hooks/use-theme";

const Settings = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [voiceInput, setVoiceInput] = useState(false);
  const [showHints, setShowHints] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [hintFrequency, setHintFrequency] = useState([50]);

  const hintLabel = hintFrequency[0] < 33 ? "Rarely" : hintFrequency[0] < 66 ? "Sometimes" : "Often";

  return (
    <div className="px-6 py-8 lg:px-10 max-w-3xl">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors tap-scale"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <h1 className="mt-4 text-2xl font-extrabold lg:text-3xl">Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">Customize your experience</p>

      {/* Simulation Settings */}
      <h2 className="mt-8 text-xs font-bold uppercase tracking-widest text-muted-foreground">
        Simulation
      </h2>
      <Card className="mt-3 shadow-soft border-border overflow-hidden">
        <CardContent className="divide-y divide-border p-0">
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-primary/10 p-2.5">
                <Volume2 className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">Voice Input</p>
                <p className="text-xs text-muted-foreground">Speak instead of type</p>
              </div>
            </div>
            <Switch checked={voiceInput} onCheckedChange={setVoiceInput} />
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-secondary/10 p-2.5">
                <Lightbulb className="h-4 w-4 text-secondary" />
              </div>
              <div>
                <p className="text-sm font-semibold">Show Hints</p>
                <p className="text-xs text-muted-foreground">Display suggestions during chats</p>
              </div>
            </div>
            <Switch checked={showHints} onCheckedChange={setShowHints} />
          </div>
          {showHints && (
            <div className="px-5 py-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold">Hint Frequency</p>
                <span className="text-xs font-bold text-primary rounded-full bg-primary/10 px-3 py-1">{hintLabel}</span>
              </div>
              <Slider value={hintFrequency} onValueChange={setHintFrequency} max={100} step={1} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Appearance */}
      <h2 className="mt-8 text-xs font-bold uppercase tracking-widest text-muted-foreground">
        Appearance
      </h2>
      <Card className="mt-3 shadow-soft border-border overflow-hidden">
        <CardContent className="divide-y divide-border p-0">
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-muted p-2.5">
                <Moon className="h-4 w-4 text-foreground" />
              </div>
              <div>
                <p className="text-sm font-semibold">Dark Mode</p>
                <p className="text-xs text-muted-foreground">Easier on the eyes at night</p>
              </div>
            </div>
            <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
          </div>
          <button className="flex w-full items-center justify-between px-5 py-4 tap-scale">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-accent p-2.5">
                <Globe className="h-4 w-4 text-accent-foreground" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold">Language</p>
                <p className="text-xs text-muted-foreground">English</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        </CardContent>
      </Card>

      {/* Notifications */}
      <h2 className="mt-8 text-xs font-bold uppercase tracking-widest text-muted-foreground">
        Notifications
      </h2>
      <Card className="mt-3 shadow-soft border-border overflow-hidden">
        <CardContent className="p-0">
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-primary/10 p-2.5">
                <Bell className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">Daily Reminders</p>
                <p className="text-xs text-muted-foreground">Get notified to practice</p>
              </div>
            </div>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </div>
        </CardContent>
      </Card>

      {/* Account */}
      <h2 className="mt-8 text-xs font-bold uppercase tracking-widest text-muted-foreground">
        Account
      </h2>
      <Card className="mt-3 shadow-soft border-border overflow-hidden">
        <CardContent className="divide-y divide-border p-0">
          <button className="flex w-full items-center justify-between px-5 py-4 tap-scale hover:bg-muted/40 transition-colors">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-muted p-2.5">
                <LogOut className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-sm font-semibold">Sign Out</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
          <button className="flex w-full items-center justify-between px-5 py-4 tap-scale hover:bg-destructive/5 transition-colors">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-destructive/10 p-2.5">
                <Trash2 className="h-4 w-4 text-destructive" />
              </div>
              <p className="text-sm font-semibold text-destructive">Delete Account</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        </CardContent>
      </Card>

      <p className="mt-10 pb-4 text-center text-xs text-muted-foreground">SocialSim v1.0 · Made with 💕</p>
    </div>
  );
};

export default Settings;
