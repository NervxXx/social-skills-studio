import { useNavigate } from "react-router-dom";
import { Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Scenario } from "@/lib/data";

const difficultyDots = (d: Scenario["difficulty"]) => {
  const count = d === "easy" ? 1 : d === "medium" ? 2 : 3;
  return (
    <div className="flex gap-1">
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className={`h-2 w-2 rounded-full ${
            i <= count ? "bg-primary" : "bg-border"
          }`}
        />
      ))}
    </div>
  );
};

const ScenarioCard = ({ scenario }: { scenario: Scenario }) => {
  const navigate = useNavigate();

  return (
    <Card className="hover-lift min-w-[200px] cursor-pointer border-border shadow-sm">
      <CardContent className="flex flex-col gap-3 p-4">
        <span className="text-3xl">{scenario.emoji}</span>
        <h3 className="font-semibold leading-tight text-foreground">
          {scenario.title}
        </h3>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {difficultyDots(scenario.difficulty)}
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {scenario.duration} min
          </span>
        </div>
        <Button
          size="sm"
          className="mt-1 rounded-full tap-scale"
          onClick={() => navigate(`/setup/${scenario.id}`)}
        >
          Start
        </Button>
      </CardContent>
    </Card>
  );
};

export default ScenarioCard;
