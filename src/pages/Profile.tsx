import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Settings, Edit, Trophy, Target, Flame } from "lucide-react";
import { achievements } from "@/lib/data";
import { useI18n } from "@/hooks/use-i18n";

const Profile = () => {
  const navigate = useNavigate();
  const { t } = useI18n();

  const skills = [
    { key: "skill.empathy" as const, score: 78 },
    { key: "skill.clarity" as const, score: 65 },
    { key: "skill.emotionalControl" as const, score: 82 },
    { key: "skill.assertiveness" as const, score: 60 },
  ];

  const stats = [
    { labelKey: "home.sessions" as const, value: "12", icon: Target },
    { labelKey: "profile.streak" as const, value: "3", icon: Flame, suffix: "🔥" },
    { labelKey: "profile.bestScore" as const, value: "94%", icon: Trophy },
  ];

  return (
    <div className="px-6 py-8 lg:px-10 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold lg:text-3xl">{t("nav.profile")}</h1>
        <Button variant="outline" size="sm" className="rounded-xl tap-scale" onClick={() => navigate("/settings")}>
          <Settings className="h-4 w-4 mr-1.5" /> {t("profile.settings")}
        </Button>
      </div>

      <Card className="mt-6 shadow-soft border-border overflow-hidden">
        <div className="gradient-primary h-24 relative" />
        <CardContent className="relative px-6 pb-6">
          <div className="flex flex-col items-center sm:flex-row sm:items-end gap-4 -mt-12 sm:-mt-10">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-card shadow-glow">
                <AvatarFallback className="bg-primary/20 text-primary text-3xl font-extrabold">AJ</AvatarFallback>
              </Avatar>
              <button className="absolute bottom-1 right-1 rounded-full bg-primary p-1.5 text-primary-foreground shadow-md tap-scale">
                <Edit className="h-3 w-3" />
              </button>
            </div>
            <div className="text-center sm:text-left sm:pb-1">
              <h2 className="text-xl font-extrabold">Alex Johnson</h2>
              <p className="text-sm text-muted-foreground">{t("home.level")} · 320 / 500 XP</p>
              <Progress value={64} className="mt-2 h-2 w-48 rounded-full" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 grid grid-cols-3 gap-4">
        {stats.map((s) => (
          <Card key={s.labelKey} className="shadow-soft border-border">
            <CardContent className="flex flex-col items-center p-5">
              <s.icon className="h-5 w-5 text-primary mb-2" />
              <span className="text-2xl font-extrabold">{s.value}{s.suffix || ""}</span>
              <span className="text-xs text-muted-foreground">{t(s.labelKey)}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="shadow-soft border-border">
          <CardContent className="p-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("profile.skillProgress")}</h2>
            <div className="mt-4 space-y-4">
              {skills.map((s) => (
                <div key={s.key}>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="font-semibold">{t(s.key)}</span>
                    <span className="font-bold text-primary">{s.score}%</span>
                  </div>
                  <Progress value={s.score} className="h-2.5 rounded-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-border">
          <CardContent className="p-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("profile.achievements")}</h2>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {achievements.map((a) => (
                <div key={a.id} className={`flex flex-col items-center gap-1 rounded-2xl border p-3 text-center transition-all ${a.unlocked ? "border-primary/20 bg-primary/5 hover-lift" : "opacity-40 grayscale border-border"}`}>
                  <span className="text-2xl">{a.emoji}</span>
                  <span className="text-[11px] font-semibold leading-tight">{t(`ach.${a.id}` as any)}</span>
                  {a.unlocked && <span className="text-[10px] text-primary font-medium">{t("profile.unlocked")}</span>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
