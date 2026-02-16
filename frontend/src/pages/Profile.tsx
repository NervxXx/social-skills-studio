import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Settings, Edit, Trophy, Target, Flame } from "lucide-react";
import { achievements } from "@/lib/data";
import { useI18n } from "@/hooks/use-i18n";
import { useAuth } from "@/contexts/AuthContext";
import { profilesApi, statsApi, type ProfileResponse } from "@/lib/api";

const Profile = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [stats, setStats] = useState<{ total_sessions: number; best_score: number; streak_days: number; skills: Record<string, number>; achievements: string[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    Promise.all([profilesApi.getMe(), statsApi.getMyStats()])
      .then(([p, s]) => {
        setProfile(p);
        setStats(s);
      })
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  const skills = [
    { key: "skill.empathy" as const, score: stats?.skills?.empathy ?? 0 },
    { key: "skill.clarity" as const, score: stats?.skills?.clarity ?? 0 },
    { key: "skill.emotionalControl" as const, score: stats?.skills?.emotional_control ?? 0 },
    { key: "skill.assertiveness" as const, score: stats?.skills?.assertiveness ?? 0 },
  ];

  const xpForLevel = (level: number) => level * 100;
  const xpInLevel = profile ? profile.xp % xpForLevel(profile.level) : 0;
  const xpNeeded = profile ? xpForLevel(profile.level) : 100;
  const xpPercent = profile ? Math.min(100, (xpInLevel / xpNeeded) * 100) : 0;

  if (!isAuthenticated) {
    return (
      <div className="page-container max-w-3xl flex flex-col items-center justify-center py-24">
        <p className="text-muted-foreground text-center">{t("auth.loginSubtitle")}</p>
        <div className="flex gap-3 mt-6">
          <Button onClick={() => navigate("/login")}>{t("nav.login")}</Button>
          <Button variant="outline" onClick={() => navigate("/register")}>{t("nav.register")}</Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="page-container max-w-3xl flex items-center justify-center py-24">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="page-container max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold lg:text-3xl">{t("nav.profile")}</h1>
        <Button variant="outline" size="sm" className="rounded-xl tap-scale" onClick={() => navigate("/settings")}>
          <Settings className="h-4 w-4 mr-1.5" /> {t("profile.settings")}
        </Button>
      </div>

      <Card className="mt-8 shadow-soft border-border overflow-hidden">
        <div className="gradient-primary h-20 sm:h-24" />
        <CardContent className="relative px-6 pb-6">
          <div className="flex flex-col items-center sm:flex-row sm:items-end gap-4 -mt-12 sm:-mt-10">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-card shadow-glow">
                <AvatarFallback className="bg-primary/20 text-primary text-3xl font-extrabold">
                  {(user?.full_name || user?.email || "?")[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-1 right-1 rounded-full bg-primary p-1.5 text-primary-foreground shadow-md tap-scale" onClick={() => navigate("/settings")}>
                <Edit className="h-3 w-3" />
              </button>
            </div>
            <div className="text-center sm:text-left sm:pb-1">
              <h2 className="text-xl font-extrabold">{profile?.display_name || user?.full_name || user?.email || "User"}</h2>
              <p className="text-sm text-muted-foreground mt-0.5">{t("home.level")} {profile?.level ?? 1} · {profile?.xp ?? 0} / {xpNeeded} XP</p>
              <Progress value={xpPercent} className="mt-2.5 h-2 w-48 rounded-full" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 grid grid-cols-3 gap-3">
        {[
          { labelKey: "home.sessions" as const, value: String(stats?.total_sessions ?? 0), icon: Target },
          { labelKey: "profile.streak" as const, value: String(stats?.streak_days ?? 0), icon: Flame, suffix: "🔥" },
          { labelKey: "profile.bestScore" as const, value: `${stats?.best_score ?? 0}%`, icon: Trophy },
        ].map((s) => (
          <Card key={s.labelKey} className="shadow-soft border-border">
            <CardContent className="flex flex-col items-center p-4 sm:p-5">
              <s.icon className="h-5 w-5 text-primary mb-2" />
              <span className="text-xl font-extrabold sm:text-2xl">{s.value}{s.suffix || ""}</span>
              <span className="text-[11px] text-muted-foreground mt-0.5">{t(s.labelKey)}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="section-gap grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card className="shadow-soft border-border">
          <CardContent className="p-6">
            <h2 className="section-title">{t("profile.skillProgress")}</h2>
            <div className="mt-5 space-y-5">
              {skills.map((s) => (
                <div key={s.key}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-semibold">{t(s.key)}</span>
                    <span className="font-bold text-primary">{s.score}%</span>
                  </div>
                  <Progress value={s.score} className="h-2 rounded-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-border">
          <CardContent className="p-6">
            <h2 className="section-title">{t("profile.achievements")}</h2>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {achievements.map((a) => {
                const unlocked = stats?.achievements?.includes(a.id) ?? false;
                return (
                  <div key={a.id} className={`flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-center transition-all ${unlocked ? "border-primary/20 bg-primary/5 hover-lift" : "opacity-40 grayscale border-border"}`}>
                    <span className="text-2xl">{a.emoji}</span>
                    <span className="text-[11px] font-semibold leading-tight">{t(`ach.${a.id}` as any)}</span>
                    {unlocked && <span className="text-[10px] text-primary font-medium">{t("profile.unlocked")}</span>}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
