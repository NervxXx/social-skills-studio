import { useNavigate } from "react-router-dom";
import { Clock, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Scenario } from "@/lib/data";

const difficultyDots = (d: Scenario["difficulty"]) => {
  const count = d === "easy" ? 1 : d === "medium" ? 2 : 3;
  return (
    <div className="flex gap-1 items-center">
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className={`h-1.5 w-1.5 rounded-full transition-colors ${
            i <= count ? "bg-primary" : "bg-border"
          }`}
        />
      ))}
      <span className="ml-1 text-xs capitalize text-muted-foreground">{d}</span>
    </div>
  );
};

const ScenarioCard = ({ scenario }: { scenario: Scenario }) => {
  const navigate = useNavigate();

  return (
    <Card
      className="group relative min-w-[220px] cursor-pointer overflow-hidden border-border bg-card shadow-soft transition-all duration-300 hover:shadow-glow hover:-translate-y-1 hover:border-primary/20"
      onClick={() => navigate(`/setup/${scenario.id}`)}
    >
      <CardContent className="flex flex-col gap-3 p-5">
        <div className="flex items-start justify-between">
          <span className="text-4xl drop-shadow-sm">{scenario.emoji}</span>
          <div className="rounded-full bg-muted p-2 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:bg-primary group-hover:text-primary-foreground">
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </div>
        <div>
          <h3 className="font-bold leading-tight text-foreground">{scenario.title}</h3>
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{scenario.description}</p>
        </div>
        <div className="flex items-center justify-between pt-1">
          {difficultyDots(scenario.difficulty)}
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {scenario.duration}m
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScenarioCard;
