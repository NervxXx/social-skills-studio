import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Settings, Edit } from "lucide-react";
import { achievements } from "@/lib/data";

const skills = [
  { name: "Empathy", score: 78 },
  { name: "Clarity", score: 65 },
  { name: "Emotional Control", score: 82 },
  { name: "Assertiveness", score: 60 },
];

const stats = [
  { label: "Sessions", value: "12" },
  { label: "Streak", value: "3🔥" },
  { label: "Best Score", value: "94%" },
];

const Profile = () => {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-lg px-4 pt-6 pb-8">
      {/* Header actions */}
      <div className="flex justify-end">
        <Button variant="ghost" size="icon" className="tap-scale" onClick={() => navigate("/settings")}>
          <Settings className="h-5 w-5 text-muted-foreground" />
        </Button>
      </div>

      {/* Avatar & info */}
      <div className="flex flex-col items-center text-center -mt-2">
        <div className="relative">
          <Avatar className="h-24 w-24 border-4 border-primary">
            <AvatarFallback className="bg-primary/20 text-primary text-3xl font-bold">
              AJ
            </AvatarFallback>
          </Avatar>
          <button className="absolute bottom-0 right-0 rounded-full bg-primary p-1.5 text-primary-foreground shadow-md tap-scale">
            <Edit className="h-3.5 w-3.5" />
          </button>
        </div>
        <h1 className="mt-3 text-xl font-bold">Alex Johnson</h1>
        <p className="text-sm text-muted-foreground">Level 4 · 320 XP</p>
        <Progress value={64} className="mt-2 h-2 w-40 rounded-full" />
        <p className="mt-1 text-xs text-muted-foreground">180 XP to Level 5</p>
      </div>

      {/* Quick stats */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <Card key={s.label} className="shadow-sm">
            <CardContent className="flex flex-col items-center p-3">
              <span className="text-lg font-bold text-primary">{s.value}</span>
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Skills */}
      <h2 className="mt-8 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Skill Progress
      </h2>
      <Card className="mt-3 shadow-sm">
        <CardContent className="space-y-4 p-4">
          {skills.map((s) => (
            <div key={s.name}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="font-medium">{s.name}</span>
                <span className="text-muted-foreground">{s.score}%</span>
              </div>
              <Progress value={s.score} className="h-2.5 rounded-full" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Achievements */}
      <h2 className="mt-8 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Achievements
      </h2>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {achievements.map((a) => (
          <Card
            key={a.id}
            className={`text-center shadow-sm hover-lift ${!a.unlocked ? "opacity-40 grayscale" : ""}`}
          >
            <CardContent className="flex flex-col items-center gap-1 p-3">
              <span className="text-2xl">{a.emoji}</span>
              <span className="text-xs font-medium leading-tight">{a.name}</span>
              {a.unlocked && (
                <span className="text-[10px] text-primary font-medium">Unlocked</span>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Profile;
