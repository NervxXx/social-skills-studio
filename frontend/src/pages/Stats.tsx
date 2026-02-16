import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Flame, Target, TrendingUp, Award, Calendar } from "lucide-react";
import { scenarios as fallbackScenarios } from "@/lib/data";
import { useI18n } from "@/hooks/use-i18n";
import { useAuth } from "@/contexts/AuthContext";
import { statsApi, simulationsApi } from "@/lib/api";
import EmpathyFlower from "@/components/EmpathyFlower";

const dayKeys = ["day.mon", "day.tue", "day.wed", "day.thu", "day.fri", "day.sat", "day.sun"] as const;

const Stats = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [stats, setStats] = useState<{
    total_sessions: number;
    avg_score: number;
    best_score: number;
    streak_days: number;
    weekly_sessions: number[];
    skills: Record<string, number>;
  } | null>(null);
  const [recentRuns, setRecentRuns] = useState<{ scenario_id: string; score: number; date: string }[]>([]);

  useEffect(() => {
    if (!isAuthenticated) return;
    statsApi.getMyStats().then(setStats).catch(() => { });
    simulationsApi.getRecent(10).then(setRecentRuns).catch(() => { });
  }, [isAuthenticated]);

  const weeklyData = (stats?.weekly_sessions ?? [0, 0, 0, 0, 0, 0, 0]).map((sessions, i) => ({
    key: dayKeys[i],
    sessions,
  }));

  const skillHistory = [
    { key: "skill.empathy" as const, current: stats?.skills?.empathy ?? 0, previous: Math.max(0, (stats?.skills?.empathy ?? 0) - 5) },
    { key: "skill.clarity" as const, current: stats?.skills?.clarity ?? 0, previous: Math.max(0, (stats?.skills?.clarity ?? 0) - 3) },
    { key: "skill.emotionalControl" as const, current: stats?.skills?.emotional_control ?? 0, previous: Math.max(0, (stats?.skills?.emotional_control ?? 0) - 4) },
    { key: "skill.assertiveness" as const, current: stats?.skills?.assertiveness ?? 0, previous: Math.max(0, (stats?.skills?.assertiveness ?? 0) - 8) },
  ];

  const maxSessions = Math.max(...weeklyData.map((d) => d.sessions), 1);

  if (!isAuthenticated) {
    return (
      <div className="page-container flex flex-col items-center justify-center py-24">
        <p className="text-muted-foreground text-center">{t("auth.loginSubtitle")}</p>
        <div className="flex gap-3 mt-6">
          <Button onClick={() => navigate("/login")}>{t("nav.login")}</Button>
          <Button variant="outline" onClick={() => navigate("/register")}>{t("nav.register")}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div>
        <p className="text-sm text-muted-foreground">{t("stats.subtitle")}</p>
        <h1 className="text-2xl font-extrabold lg:text-3xl mt-0.5">{t("stats.title")}</h1>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card className="shadow-soft border-border">
          <CardContent className="flex items-center gap-3 p-4 sm:p-5">
            <div className="rounded-2xl bg-primary/10 p-2.5"><Target className="h-5 w-5 text-primary" /></div>
            <div>
              <p className="text-xl font-extrabold sm:text-2xl">{stats?.total_sessions ?? 0}</p>
              <p className="text-[11px] text-muted-foreground">{t("stats.totalSessions")}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-soft border-border">
          <CardContent className="flex items-center gap-3 p-4 sm:p-5">
            <div className="rounded-2xl bg-primary/10 p-2.5"><Flame className="h-5 w-5 text-primary" /></div>
            <div>
              <p className="text-xl font-extrabold sm:text-2xl">{stats?.streak_days ?? 0}</p>
              <p className="text-[11px] text-muted-foreground">{t("stats.dayStreak")}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-soft border-border">
          <CardContent className="flex items-center gap-3 p-4 sm:p-5">
            <div className="rounded-2xl bg-secondary/10 p-2.5"><TrendingUp className="h-5 w-5 text-secondary" /></div>
            <div>
              <p className="text-xl font-extrabold sm:text-2xl">{stats?.avg_score ?? 0}%</p>
              <p className="text-[11px] text-muted-foreground">{t("stats.avgScore")}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-soft border-border">
          <CardContent className="flex items-center gap-3 p-4 sm:p-5">
            <div className="rounded-2xl bg-success/10 p-2.5"><Award className="h-5 w-5 text-success" /></div>
            <div>
              <p className="text-xl font-extrabold sm:text-2xl">{stats?.best_score ?? 0}%</p>
              <p className="text-[11px] text-muted-foreground">{t("stats.bestScore")}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="section-gap grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card className="shadow-soft border-border overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-8">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <h2 className="section-title">{t("stats.thisWeek")}</h2>
            </div>
            <div className="flex items-end justify-between gap-2 h-36">
              {weeklyData.map((d) => (
                <div key={d.key} className="flex flex-1 flex-col items-center gap-2">
                  <div className="relative w-full flex justify-center">
                    <div className={`w-7 sm:w-8 rounded-xl transition-all duration-500 ${d.sessions > 0 ? "gradient-primary" : "bg-muted"}`} style={{ height: `${Math.max((d.sessions / maxSessions) * 110, 8)}px` }} />
                  </div>
                  <span className="text-[11px] font-medium text-muted-foreground">{t(d.key)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-border">
          <CardContent className="p-6 flex flex-col sm:flex-row gap-8 items-center">
            <div className="flex-1">
              <h2 className="section-title mb-6">Цветок Эмпатии</h2>
              <div className="space-y-4">
                {skillHistory.map((s) => {
                  const diff = s.current - s.previous;
                  return (
                    <div key={s.key}>
                      <div className="mb-1.5 flex justify-between text-[11px]">
                        <span className="font-semibold text-muted-foreground uppercase tracking-wider">{t(s.key)}</span>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${diff >= 0 ? "text-success" : "text-destructive"}`}>{diff >= 0 ? "+" : ""}{diff}%</span>
                          <span className="font-bold text-foreground">{s.current}%</span>
                        </div>
                      </div>
                      <Progress value={s.current} className="h-1.5 rounded-full" />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col items-center gap-2">
              <EmpathyFlower skills={{
                empathy: stats?.skills?.empathy ?? 0,
                clarity: stats?.skills?.clarity ?? 0,
                emotional_control: stats?.skills?.emotional_control ?? 0,
                assertiveness: stats?.skills?.assertiveness ?? 0
              }} size={180} />
              <p className="text-[10px] text-muted-foreground italic max-w-[150px] text-center mt-2">
                Ваш цветок растет вместе с вашими навыками
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="section-gap pb-8">
        <h2 className="section-title mb-4">{t("stats.recentSessions")}</h2>
        <div className="space-y-2.5">
          {recentRuns.length > 0 ? recentRuns.map((r, i) => {
            const s = fallbackScenarios.find((sc) => sc.id === r.scenario_id);
            if (!s) return null;
            return (
              <Card key={`${r.scenario_id}-${i}`} className="shadow-soft border-border hover-lift cursor-pointer" onClick={() => navigate(`/setup/${r.scenario_id}`)}>
                <CardContent className="flex items-center justify-between p-4 sm:p-5">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{s.emoji}</span>
                    <div>
                      <p className="font-bold text-sm sm:text-base">{t(`scenario.${s.id}.title` as any)}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{r.date} · {t(`cat.${s.category}` as any)}</p>
                    </div>
                  </div>
                  <span className="text-lg font-extrabold text-primary">{r.score}%</span>
                </CardContent>
              </Card>
            );
          }) : (
            <Card className="border-border border-dashed shadow-soft">
              <CardContent className="flex flex-col items-center justify-center py-12 px-6">
                <p className="text-muted-foreground text-center">{t("stats.noSessions")}</p>
                <Button variant="outline" className="mt-4 rounded-xl" onClick={() => navigate("/explore")}>
                  {t("stats.startFirst")}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Stats;
