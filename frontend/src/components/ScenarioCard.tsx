import { useNavigate } from "react-router-dom";
import { Clock, ArrowRight, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/hooks/use-i18n";
import type { Scenario } from "@/lib/data";

const difficultyDots = (d: Scenario["difficulty"]) => {
  const count = d === "easy" ? 1 : d === "medium" ? 2 : 3;
  return (
    <div className="flex gap-1 items-center">
      {[1, 2, 3].map((i) => (
        <span key={i} className={`h-1.5 w-1.5 rounded-full transition-colors ${i <= count ? "bg-primary" : "bg-border"}`} />
      ))}
    </div>
  );
};

interface ScenarioCardProps {
  scenario: Scenario;
  userLevel?: number;
}

const ScenarioCard = ({ scenario, userLevel = 1 }: ScenarioCardProps) => {
  const navigate = useNavigate();
  const { t } = useI18n();

  const isLocked = scenario.required_level > userLevel;
  const titleKey = `scenario.${scenario.id}.title` as any;
  const descKey = `scenario.${scenario.id}.desc` as any;

  return (
    <Card
      className={`group relative min-w-[220px] overflow-hidden border-border bg-card shadow-soft transition-all duration-300
        ${isLocked
          ? "cursor-not-allowed opacity-60 grayscale-[30%]"
          : "cursor-pointer hover:shadow-glow hover:-translate-y-1 hover:border-primary/20"
        }`}
      onClick={() => {
        if (!isLocked) navigate(`/setup/${scenario.id}`);
      }}
    >
      {isLocked && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/60 backdrop-blur-[2px] rounded-xl">
          <div className="flex items-center gap-2 rounded-full bg-muted/90 px-4 py-2 shadow-sm">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-semibold text-muted-foreground">
              {t("scenario.requiredLevel" as any)} {scenario.required_level}
            </span>
          </div>
        </div>
      )}
      <CardContent className="flex flex-col gap-3 p-5">
        <div className="flex items-start justify-between">
          <span className="text-4xl drop-shadow-sm">{scenario.emoji}</span>
          {!isLocked && (
            <div className="rounded-full bg-muted p-2 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:bg-primary group-hover:text-primary-foreground">
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          )}
          {isLocked && (
            <div className="rounded-full bg-muted p-2">
              <Lock className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
          )}
        </div>
        <div>
          <h3 className="font-bold leading-tight text-foreground">{t(titleKey)}</h3>
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{t(descKey)}</p>
        </div>
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1">
            {difficultyDots(scenario.difficulty)}
            <span className="ml-1 text-xs text-muted-foreground">{t(`difficulty.${scenario.difficulty}` as any)}</span>
          </div>
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
