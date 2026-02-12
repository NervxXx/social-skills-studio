import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CategoryPill from "@/components/CategoryPill";
import ScenarioCard from "@/components/ScenarioCard";
import { categories, scenarios, recentScenarios } from "@/lib/data";

const Index = () => {
  const navigate = useNavigate();
  const dailyScenario = scenarios[0];

  return (
    <div className="mx-auto max-w-lg px-4 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-11 w-11 border-2 border-primary">
            <AvatarFallback className="bg-primary/20 text-primary font-bold">
              AJ
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm text-muted-foreground">Good evening</p>
            <h1 className="text-lg font-bold">Alex Johnson</h1>
          </div>
        </div>
        <button className="relative rounded-full p-2 tap-scale hover:bg-muted">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
        </button>
      </div>

      {/* XP Bar */}
      <div className="mt-5">
        <div className="mb-1 flex items-center justify-between text-sm">
          <span className="font-semibold">Level 4</span>
          <span className="text-muted-foreground">320 / 500 XP</span>
        </div>
        <Progress value={64} className="h-3 rounded-full" />
      </div>

      {/* Daily Goal */}
      <Card className="mt-5 border-primary/30 bg-primary/5 shadow-sm">
        <CardContent className="flex items-center justify-between gap-4 p-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              Daily Goal
            </p>
            <h2 className="mt-1 font-bold">{dailyScenario.title}</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {dailyScenario.duration} min · {dailyScenario.difficulty}
            </p>
          </div>
          <Button
            className="shrink-0 rounded-full tap-scale"
            onClick={() => navigate(`/setup/${dailyScenario.id}`)}
          >
            Start
          </Button>
        </CardContent>
      </Card>

      {/* Categories */}
      <h2 className="mt-7 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
        Categories
      </h2>
      <div className="mt-2 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((c) => (
          <CategoryPill
            key={c.id}
            emoji={c.emoji}
            name={c.name}
            onClick={() => navigate(`/explore?category=${c.id}`)}
          />
        ))}
      </div>

      {/* Recommended */}
      <h2 className="mt-6 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
        Recommended for you
      </h2>
      <div className="mt-2 flex gap-3 overflow-x-auto pb-2 scrollbar-none">
        {scenarios.slice(1, 4).map((s) => (
          <ScenarioCard key={s.id} scenario={s} />
        ))}
      </div>

      {/* Recent */}
      <h2 className="mt-6 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
        Recent Sessions
      </h2>
      <div className="mt-2 flex flex-col gap-2 pb-4">
        {recentScenarios.map((r) => {
          const s = scenarios.find((sc) => sc.id === r.scenarioId)!;
          return (
            <Card key={r.scenarioId} className="shadow-sm hover-lift">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{s.emoji}</span>
                  <div>
                    <p className="font-semibold">{s.title}</p>
                    <p className="text-xs text-muted-foreground">{r.date}</p>
                  </div>
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary">
                  {r.score}%
                </span>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Index;
