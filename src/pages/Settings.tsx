import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ChevronRight, Volume2, Lightbulb, Moon, Bell, Globe, Trash2, LogOut } from "lucide-react";

const Settings = () => {
  const [voiceInput, setVoiceInput] = useState(false);
  const [showHints, setShowHints] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [hintFrequency, setHintFrequency] = useState([50]);

  const hintLabel = hintFrequency[0] < 33 ? "Rarely" : hintFrequency[0] < 66 ? "Sometimes" : "Often";

  return (
    <div className="mx-auto max-w-lg px-4 pt-6 pb-8">
      <h1 className="text-2xl font-bold">Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">Customize your experience</p>

      {/* Simulation Settings */}
      <h2 className="mt-8 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Simulation
      </h2>
      <Card className="mt-3 shadow-sm">
        <CardContent className="divide-y divide-border p-0">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-3">
              <Volume2 className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Voice Input</p>
                <p className="text-xs text-muted-foreground">Speak instead of type</p>
              </div>
            </div>
            <Switch checked={voiceInput} onCheckedChange={setVoiceInput} />
          </div>
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-3">
              <Lightbulb className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Show Hints</p>
                <p className="text-xs text-muted-foreground">Display suggestions during chats</p>
              </div>
            </div>
            <Switch checked={showHints} onCheckedChange={setShowHints} />
          </div>
          {showHints && (
            <div className="px-4 py-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">Hint Frequency</p>
                <span className="text-xs text-muted-foreground font-medium">{hintLabel}</span>
              </div>
              <Slider value={hintFrequency} onValueChange={setHintFrequency} max={100} step={1} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Appearance */}
      <h2 className="mt-8 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Appearance
      </h2>
      <Card className="mt-3 shadow-sm">
        <CardContent className="divide-y divide-border p-0">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-3">
              <Moon className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Dark Mode</p>
                <p className="text-xs text-muted-foreground">Easier on the eyes at night</p>
              </div>
            </div>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </div>
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Language</p>
                <p className="text-xs text-muted-foreground">English</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <h2 className="mt-8 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Notifications
      </h2>
      <Card className="mt-3 shadow-sm">
        <CardContent className="p-0">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Daily Reminders</p>
                <p className="text-xs text-muted-foreground">Get notified to practice</p>
              </div>
            </div>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </div>
        </CardContent>
      </Card>

      {/* Account */}
      <h2 className="mt-8 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Account
      </h2>
      <Card className="mt-3 shadow-sm">
        <CardContent className="divide-y divide-border p-0">
          <button className="flex w-full items-center justify-between px-4 py-4 tap-scale">
            <div className="flex items-center gap-3">
              <LogOut className="h-5 w-5 text-muted-foreground" />
              <p className="text-sm font-medium">Sign Out</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
          <button className="flex w-full items-center justify-between px-4 py-4 tap-scale">
            <div className="flex items-center gap-3">
              <Trash2 className="h-5 w-5 text-destructive" />
              <p className="text-sm font-medium text-destructive">Delete Account</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        </CardContent>
      </Card>

      <p className="mt-8 text-center text-xs text-muted-foreground">SocialSim v1.0 · Made with 💕</p>
    </div>
  );
};

export default Settings;
