import { useNavigate } from "react-router-dom";
import { Bell, Flame, Target, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CategoryPill from "@/components/CategoryPill";
import ScenarioCard from "@/components/ScenarioCard";
import { categories, scenarios, recentScenarios } from "@/lib/data";
import { useI18n } from "@/hooks/use-i18n";

const Index = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const dailyScenario = scenarios[0];

  const quickStats = [
    { labelKey: "home.dayStreak" as const, value: "3", icon: Flame, color: "text-primary" },
    { labelKey: "home.sessions" as const, value: "12", icon: Target, color: "text-secondary" },
    { labelKey: "home.avgScore" as const, value: "78%", icon: TrendingUp, color: "text-success" },
  ];

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{t("home.welcome")}</p>
          <h1 className="text-2xl font-extrabold lg:text-3xl mt-0.5">{t("home.greeting")}</h1>
        </div>
        <button className="relative rounded-2xl border border-border bg-card p-3 shadow-soft tap-scale hover:shadow-glow transition-shadow">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary ring-2 ring-card" />
        </button>
      </div>

      {/* Stats grid */}
      <div className="section-gap grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="col-span-2 sm:col-span-1 shadow-soft border-border">
          <CardContent className="p-5">
            <p className="section-title">{t("home.level")}</p>
            <div className="mt-2.5 flex items-end gap-2">
              <span className="text-3xl font-extrabold text-foreground">320</span>
              <span className="text-sm text-muted-foreground mb-0.5">/ 500 XP</span>
            </div>
            <Progress value={64} className="mt-3 h-2 rounded-full" />
          </CardContent>
        </Card>

        {quickStats.map((s) => (
          <Card key={s.labelKey} className="shadow-soft border-border">
            <CardContent className="flex items-center gap-3 p-4 sm:p-5">
              <div className={`rounded-2xl bg-muted p-2.5 ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xl font-extrabold sm:text-2xl">{s.value}</p>
                <p className="text-[11px] text-muted-foreground">{t(s.labelKey)}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Daily Goal */}
      <Card className="section-gap overflow-hidden border-none shadow-glow">
        <div className="gradient-primary p-6 sm:p-8 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-primary-foreground/60">{t("home.dailyGoal")}</p>
            <h2 className="mt-1.5 text-xl font-extrabold text-primary-foreground sm:text-2xl">{t(`scenario.${dailyScenario.id}.title` as any)}</h2>
            <p className="mt-1.5 text-sm text-primary-foreground/75">
              {dailyScenario.duration} min · {t(`difficulty.${dailyScenario.difficulty}` as any)} · {dailyScenario.emoji}
            </p>
          </div>
          <Button
            className="mt-5 sm:mt-0 rounded-2xl bg-card text-foreground font-bold shadow-soft hover:bg-card/90 tap-scale px-8 py-5"
            onClick={() => navigate(`/setup/${dailyScenario.id}`)}
          >
            {t("home.startNow")}
          </Button>
        </div>
      </Card>

      {/* Categories */}
      <div className="section-gap">
        <h2 className="section-title">{t("home.categories")}</h2>
        <div className="mt-4 flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((c) => (
            <CategoryPill
              key={c.id}
              emoji={c.emoji}
              name={c.name}
              translationKey={`cat.${c.id}`}
              onClick={() => navigate(`/explore?category=${c.id}`)}
            />
          ))}
        </div>
      </div>

      {/* Recommended */}
      <div className="section-gap">
        <h2 className="section-title">{t("home.recommended")}</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {scenarios.slice(1, 4).map((s) => (
            <ScenarioCard key={s.id} scenario={s} />
          ))}
        </div>
      </div>

      {/* Recent */}
      <div className="section-gap pb-8">
        <h2 className="section-title">{t("home.recent")}</h2>
        <div className="mt-4 space-y-2.5">
          {recentScenarios.map((r) => {
            const s = scenarios.find((sc) => sc.id === r.scenarioId)!;
            const dateKey = r.date === "Yesterday" ? "recent.yesterday" : "recent.2daysAgo";
            return (
              <Card key={r.scenarioId} className="shadow-soft hover-lift cursor-pointer border-border" onClick={() => navigate(`/setup/${s.id}`)}>
                <CardContent className="flex items-center justify-between p-4 sm:p-5">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{s.emoji}</span>
                    <div>
                      <p className="font-bold text-sm sm:text-base">{t(`scenario.${s.id}.title` as any)}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{t(dateKey as any)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-extrabold text-primary">{r.score}%</p>
                    <p className="text-[11px] text-muted-foreground">{t("home.score")}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Index;
