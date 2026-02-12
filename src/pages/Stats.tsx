import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Flame, Target, TrendingUp, Award, Calendar } from "lucide-react";
import { scenarios, recentScenarios } from "@/lib/data";
import { useI18n } from "@/hooks/use-i18n";

const Stats = () => {
  const { t } = useI18n();

  const weeklyData = [
    { key: "day.mon" as const, sessions: 2 },
    { key: "day.tue" as const, sessions: 1 },
    { key: "day.wed" as const, sessions: 3 },
    { key: "day.thu" as const, sessions: 0 },
    { key: "day.fri" as const, sessions: 2 },
    { key: "day.sat" as const, sessions: 1 },
    { key: "day.sun" as const, sessions: 0 },
  ];

  const skillHistory = [
    { key: "skill.empathy" as const, current: 78, previous: 70 },
    { key: "skill.clarity" as const, current: 65, previous: 62 },
    { key: "skill.emotionalControl" as const, current: 82, previous: 85 },
    { key: "skill.assertiveness" as const, current: 60, previous: 52 },
  ];

  const maxSessions = Math.max(...weeklyData.map((d) => d.sessions), 1);

  return (
    <div className="px-6 py-8 lg:px-10 max-w-5xl">
      <div>
        <p className="text-sm text-muted-foreground">{t("stats.subtitle")}</p>
        <h1 className="text-2xl font-extrabold lg:text-3xl">{t("stats.title")}</h1>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="shadow-soft border-border">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-2xl bg-primary/10 p-3"><Target className="h-5 w-5 text-primary" /></div>
            <div>
              <p className="text-2xl font-extrabold">12</p>
              <p className="text-xs text-muted-foreground">{t("stats.totalSessions")}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-soft border-border">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-2xl bg-primary/10 p-3"><Flame className="h-5 w-5 text-primary" /></div>
            <div>
              <p className="text-2xl font-extrabold">3</p>
              <p className="text-xs text-muted-foreground">{t("stats.dayStreak")}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-soft border-border">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-2xl bg-secondary/10 p-3"><TrendingUp className="h-5 w-5 text-secondary" /></div>
            <div>
              <p className="text-2xl font-extrabold">78%</p>
              <p className="text-xs text-muted-foreground">{t("stats.avgScore")}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-soft border-border">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-2xl bg-success/10 p-3"><Award className="h-5 w-5 text-success" /></div>
            <div>
              <p className="text-2xl font-extrabold">94%</p>
              <p className="text-xs text-muted-foreground">{t("stats.bestScore")}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="shadow-soft border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("stats.thisWeek")}</h2>
            </div>
            <div className="flex items-end justify-between gap-2 h-40">
              {weeklyData.map((d) => (
                <div key={d.key} className="flex flex-1 flex-col items-center gap-2">
                  <div className="relative w-full flex justify-center">
                    <div className={`w-8 rounded-xl transition-all duration-500 ${d.sessions > 0 ? "gradient-primary" : "bg-muted"}`} style={{ height: `${Math.max((d.sessions / maxSessions) * 120, 8)}px` }} />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">{t(d.key)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-border">
          <CardContent className="p-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6">{t("stats.skillTrends")}</h2>
            <div className="space-y-5">
              {skillHistory.map((s) => {
                const diff = s.current - s.previous;
                return (
                  <div key={s.key}>
                    <div className="mb-1.5 flex justify-between text-sm">
                      <span className="font-semibold">{t(s.key)}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${diff >= 0 ? "text-success" : "text-destructive"}`}>{diff >= 0 ? "+" : ""}{diff}%</span>
                        <span className="font-bold text-primary">{s.current}%</span>
                      </div>
                    </div>
                    <Progress value={s.current} className="h-2.5 rounded-full" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 pb-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">{t("stats.recentSessions")}</h2>
        <div className="space-y-2">
          {recentScenarios.map((r) => {
            const s = scenarios.find((sc) => sc.id === r.scenarioId)!;
            const dateKey = r.date === "Yesterday" ? "recent.yesterday" : "recent.2daysAgo";
            return (
              <Card key={r.scenarioId} className="shadow-soft border-border hover-lift cursor-pointer">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{s.emoji}</span>
                    <div>
                      <p className="font-bold">{t(`scenario.${s.id}.title` as any)}</p>
                      <p className="text-xs text-muted-foreground">{t(dateKey as any)} · {t(`cat.${s.category}` as any)}</p>
                    </div>
                  </div>
                  <span className="text-lg font-extrabold text-primary">{r.score}%</span>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Stats;
