import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RotateCcw, ArrowRight, CheckCircle2, AlertTriangle } from "lucide-react";
import { scenarios } from "@/lib/data";
import { useI18n } from "@/hooks/use-i18n";

const Feedback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useI18n();
  const scenarioId = (location.state as any)?.scenarioId || "first-date";
  const scenario = scenarios.find((s) => s.id === scenarioId) || scenarios[0];
  const overallScore = 79;

  const skills = [
    { key: "skill.empathy" as const, score: 82 },
    { key: "skill.clarity" as const, score: 75 },
    { key: "skill.emotionalControl" as const, score: 88 },
    { key: "skill.assertiveness" as const, score: 70 },
  ];

  const positives = [
    { phraseKey: "phrase.pos1" as const, noteKey: "phrase.pos1.note" as const },
    { phraseKey: "phrase.pos2" as const, noteKey: "phrase.pos2.note" as const },
  ];

  const negatives = [
    { phraseKey: "phrase.neg1" as const, noteKey: "phrase.neg1.note" as const },
    { phraseKey: "phrase.neg2" as const, noteKey: "phrase.neg2.note" as const },
  ];

  return (
    <div className="px-6 py-8 lg:px-10 max-w-4xl">
      <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-6">
        <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-3xl bg-primary/10 shadow-glow">
          <span className="text-5xl">{scenario.emoji}</span>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{t("feedback.complete")}</p>
          <h1 className="text-2xl font-extrabold lg:text-3xl">{t(`scenario.${scenario.id}.title` as any)}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("feedback.howYouDid")}</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="shadow-soft border-border flex flex-col items-center justify-center">
          <CardContent className="flex flex-col items-center p-8">
            <div className="relative flex h-36 w-36 items-center justify-center">
              <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" strokeWidth="8" className="stroke-muted" />
                <circle cx="60" cy="60" r="50" fill="none" strokeWidth="8" strokeLinecap="round" className="stroke-primary" strokeDasharray={`${overallScore * 3.14} 314`} style={{ transition: "stroke-dasharray 1s ease" }} />
              </svg>
              <span className="text-4xl font-extrabold text-primary">{overallScore}%</span>
            </div>
            <p className="mt-3 text-sm font-medium text-muted-foreground">{t("feedback.overallScore")}</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-border lg:col-span-2">
          <CardContent className="p-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("feedback.skillBreakdown")}</h2>
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
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">{t("feedback.wentWell")}</h2>
          {positives.map((p, i) => (
            <Card key={i} className="mb-2 border-success/20 bg-success/5 shadow-soft">
              <CardContent className="flex items-start gap-3 p-4">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-success mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{t(p.phraseKey)}</p>
                  <p className="text-xs text-muted-foreground">{t(p.noteKey)}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">{t("feedback.toImprove")}</h2>
          {negatives.map((n, i) => (
            <Card key={i} className="mb-2 border-warning/20 bg-warning/5 shadow-soft">
              <CardContent className="flex items-start gap-3 p-4">
                <AlertTriangle className="h-5 w-5 shrink-0 text-warning mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{t(n.phraseKey)}</p>
                  <p className="text-xs text-muted-foreground">{t(n.noteKey)}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card className="mt-6 shadow-soft border-secondary/20 bg-secondary/5">
        <CardContent className="flex items-start gap-4 p-5">
          <span className="text-2xl">💡</span>
          <div>
            <p className="font-bold text-foreground">{t("feedback.tipTitle")}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">{t("feedback.tipText")}</p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row pb-4">
        <Button variant="outline" className="flex-1 rounded-2xl py-5 font-bold tap-scale" onClick={() => navigate(`/setup/${scenarioId}`)}>
          <RotateCcw className="h-4 w-4 mr-2" /> {t("feedback.practiceAgain")}
        </Button>
        <Button className="flex-1 rounded-2xl py-5 font-bold shadow-glow tap-scale gradient-primary border-none" onClick={() => navigate("/explore")}>
          {t("feedback.nextScenario")} <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default Feedback;
