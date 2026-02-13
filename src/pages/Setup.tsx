import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { scenarios } from "@/lib/data";
import { useI18n } from "@/hooks/use-i18n";

const Setup = () => {
  const { scenarioId } = useParams();
  const navigate = useNavigate();
  const { t } = useI18n();
  const scenario = scenarios.find((s) => s.id === scenarioId) || scenarios[0];

  const difficultyLevels = [
    { value: "calm", labelKey: "setup.calm" as const, emoji: "😊", descKey: "setup.calmDesc" as const },
    { value: "normal", labelKey: "setup.normal" as const, emoji: "😐", descKey: "setup.normalDesc" as const },
    { value: "challenging", labelKey: "setup.challenging" as const, emoji: "😰", descKey: "setup.challengingDesc" as const },
  ];

  const goals = [
    { labelKey: "setup.deescalate" as const, emoji: "🕊️" },
    { labelKey: "setup.showEmpathy" as const, emoji: "💖" },
    { labelKey: "setup.getAgreement" as const, emoji: "🤝" },
  ];

  const [difficulty, setDifficulty] = useState("normal");
  const [personality, setPersonality] = useState([50]);
  const [goal, setGoal] = useState(goals[0].labelKey);

  const personalityLabel =
    personality[0] < 33 ? t("setup.moodCalm") : personality[0] < 66 ? t("setup.moodNervous") : t("setup.moodAggressive");

  return (
    <div className="page-container max-w-2xl">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors tap-scale">
        <ArrowLeft className="h-4 w-4" /> {t("setup.back")}
      </button>

      <div className="mt-8 flex flex-col sm:flex-row items-start gap-5">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-primary/10 text-5xl shadow-soft">
          {scenario.emoji}
        </div>
        <div>
          <h1 className="text-2xl font-extrabold lg:text-3xl">{t(`scenario.${scenario.id}.title` as any)}</h1>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t(`scenario.${scenario.id}.desc` as any)}</p>
        </div>
      </div>

      <h2 className="section-gap section-title">{t("setup.difficulty")}</h2>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {difficultyLevels.map((d) => (
          <Card
            key={d.value}
            onClick={() => setDifficulty(d.value)}
            className={`cursor-pointer text-center transition-all duration-200 tap-scale ${
              difficulty === d.value
                ? "border-primary/40 bg-primary/5 shadow-glow ring-1 ring-primary/20"
                : "border-border shadow-soft hover:border-primary/20 hover:shadow-glow"
            }`}
          >
            <CardContent className="flex flex-col items-center gap-1.5 p-4 sm:p-5">
              <span className="text-3xl">{d.emoji}</span>
              <span className="font-bold text-sm">{t(d.labelKey)}</span>
              <span className="text-[11px] text-muted-foreground">{t(d.descKey)}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="section-gap section-title">{t("setup.aiPersonality")}</h2>
      <Card className="mt-4 shadow-soft border-border">
        <CardContent className="p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5">
            <span className="text-sm font-medium">{t("setup.characterMood")}</span>
            <span className="text-sm font-bold">{personalityLabel}</span>
          </div>
          <Slider value={personality} onValueChange={setPersonality} max={100} step={1} />
          <div className="mt-3 flex justify-between text-xs text-muted-foreground">
            <span>{t("setup.sliderCalm")}</span>
            <span>{t("setup.sliderNervous")}</span>
            <span>{t("setup.sliderAggressive")}</span>
          </div>
        </CardContent>
      </Card>

      <h2 className="section-gap section-title">{t("setup.yourGoal")}</h2>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {goals.map((g) => (
          <button
            key={g.labelKey}
            onClick={() => setGoal(g.labelKey)}
            className={`flex flex-col items-center gap-2 rounded-2xl border p-4 text-sm font-semibold transition-all duration-200 tap-scale ${
              goal === g.labelKey
                ? "border-primary/40 bg-primary/10 text-primary shadow-sm"
                : "border-border bg-card text-muted-foreground hover:border-primary/20 hover:text-foreground"
            }`}
          >
            <span className="text-2xl">{g.emoji}</span>
            {t(g.labelKey)}
          </button>
        ))}
      </div>

      <Button
        className="section-gap w-full rounded-2xl py-6 text-base font-extrabold shadow-glow tap-scale gradient-primary hover:opacity-90 border-none mb-8"
        onClick={() => navigate("/simulation", { state: { scenarioId: scenario.id, difficulty, personality: personality[0], goal: t(goal as any) } })}
      >
        <Play className="h-5 w-5 mr-2" />
        {t("setup.startSimulation")}
      </Button>
    </div>
  );
};

export default Setup;
