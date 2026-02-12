import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { achievements } from "@/lib/data";

const skills = [
  { name: "Empathy", score: 78 },
  { name: "Clarity", score: 65 },
  { name: "Emotional Control", score: 82 },
  { name: "Assertiveness", score: 60 },
];

const Profile = () => {
  return (
    <div className="mx-auto max-w-lg px-4 pt-6 pb-8">
      {/* Avatar & info */}
      <div className="flex flex-col items-center text-center">
        <Avatar className="h-20 w-20 border-4 border-primary">
          <AvatarFallback className="bg-primary/20 text-primary text-2xl font-bold">
            AJ
          </AvatarFallback>
        </Avatar>
        <h1 className="mt-3 text-xl font-bold">Alex Johnson</h1>
        <p className="text-sm text-muted-foreground">Level 4 · 320 XP</p>
      </div>

      {/* Skills */}
      <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Skills
      </h2>
      <div className="mt-3 space-y-3">
        {skills.map((s) => (
          <div key={s.name}>
            <div className="mb-1 flex justify-between text-sm">
              <span className="font-medium">{s.name}</span>
              <span className="text-muted-foreground">{s.score}%</span>
            </div>
            <Progress value={s.score} className="h-2.5 rounded-full" />
          </div>
        ))}
      </div>

      {/* Achievements */}
      <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Achievements
      </h2>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {achievements.map((a) => (
          <Card
            key={a.id}
            className={`text-center shadow-sm ${!a.unlocked ? "opacity-40" : ""}`}
          >
            <CardContent className="flex flex-col items-center gap-1 p-3">
              <span className="text-2xl">{a.emoji}</span>
              <span className="text-xs font-medium leading-tight">{a.name}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Settings */}
      <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Settings
      </h2>
      <div className="mt-3 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Voice Input</span>
          <Switch />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Show Hints</span>
          <Switch defaultChecked />
        </div>
      </div>
    </div>
  );
};

export default Profile;
