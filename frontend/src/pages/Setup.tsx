import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Play, Zap, Star, Timer, Brain, Heart, Shield, Sparkles, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { scenarios as fallbackScenarios } from "@/lib/data";
import { getScenarioById, type ScenarioResponse } from "@/lib/api";
import { useI18n } from "@/hooks/use-i18n";

function calcXpMultiplier(difficulty: string, personality: number, sessionLength: string): number {
  const diffMult = difficulty === "calm" ? 1.0 : difficulty === "normal" ? 1.3 : 1.6;
  const moodMult = personality < 33 ? 1.0 : personality < 66 ? 1.15 : 1.35;
  const lenMult = sessionLength === "short" ? 1.0 : sessionLength === "medium" ? 1.2 : 1.5;
  return Math.round(diffMult * moodMult * lenMult * 100) / 100;
}

function XpPreviewCard({ difficulty, personality, sessionLength, t }: {
  difficulty: string; personality: number; sessionLength: string; t: (k: any) => string;
}) {
  const mult = calcXpMultiplier(difficulty, personality, sessionLength);
  const baseXp = 20;
  const estimated = Math.round(baseXp * mult);

  const diffBonus = difficulty === "calm" ? "×1.0" : difficulty === "normal" ? "×1.3" : "×1.6";
  const moodBonus = personality < 33 ? "×1.0" : personality < 66 ? "×1.15" : "×1.35";
  const lenBonus = sessionLength === "short" ? "×1.0" : sessionLength === "medium" ? "×1.2" : "×1.5";

  return (
    <Card className="border-primary/20 bg-primary/5 shadow-glow">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-bold text-primary">{t("setup.xpPreview")}</h3>
        </div>
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-3xl font-extrabold text-primary">{estimated}+</p>
            <p className="text-[11px] text-muted-foreground">{t("setup.xpEstimate")}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-primary">{mult}×</p>
            <p className="text-[10px] text-muted-foreground">{t("setup.xpMultiplier")}</p>
          </div>
        </div>
        <div className="space-y-1.5 text-[11px]">
          <div className="flex justify-between text-muted-foreground">
            <span>{t("setup.xpBonusDifficulty")}</span>
            <span className="font-mono font-bold">{diffBonus}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>{t("setup.xpBonusPersonality")}</span>
            <span className="font-mono font-bold">{moodBonus}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>{t("setup.xpBonusLength")}</span>
            <span className="font-mono font-bold">{lenBonus}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const Setup = () => {
  const { scenarioId } = useParams();
  const navigate = useNavigate();
  const { t } = useI18n();
  const [scenario, setScenario] = useState<ScenarioResponse | null>(null);

  useEffect(() => {
    if (scenarioId) {
      getScenarioById(scenarioId).then(setScenario).catch(() => setScenario(null));
    }
  }, [scenarioId]);

  const s = scenario || fallbackScenarios.find((x) => x.id === scenarioId) || fallbackScenarios[0];

  const difficultyLevels = [
    { value: "calm", labelKey: "setup.calm" as const, emoji: "😊", descKey: "setup.calmDesc" as const },
    { value: "normal", labelKey: "setup.normal" as const, emoji: "😐", descKey: "setup.normalDesc" as const },
    { value: "challenging", labelKey: "setup.challenging" as const, emoji: "😰", descKey: "setup.challengingDesc" as const },
  ];

  const sessionLengths = [
    { value: "short", labelKey: "setup.short" as const, emoji: "⚡", descKey: "setup.shortDesc" as const },
    { value: "medium", labelKey: "setup.medium" as const, emoji: "⏱️", descKey: "setup.mediumDesc" as const },
    { value: "long", labelKey: "setup.long" as const, emoji: "🏔️", descKey: "setup.longDesc" as const },
  ];

  const goals = [
    { labelKey: "setup.deescalate" as const, emoji: "🕊️" },
    { labelKey: "setup.showEmpathy" as const, emoji: "💖" },
    { labelKey: "setup.getAgreement" as const, emoji: "🤝" },
  ];

  const focusSkills = [
    { value: "all", labelKey: "setup.focusAll" as const, icon: Sparkles, color: "text-primary" },
    { value: "empathy", labelKey: "setup.focusEmpathy" as const, icon: Heart, color: "text-pink-500" },
    { value: "clarity", labelKey: "setup.focusClarity" as const, icon: Brain, color: "text-blue-500" },
    { value: "control", labelKey: "setup.focusControl" as const, icon: Shield, color: "text-green-500" },
  ];

  const aiStyles = [
    { value: "realistic", labelKey: "setup.styleRealistic" as const, emoji: "🎭", descKey: "setup.styleRealisticDesc" as const },
    { value: "expressive", labelKey: "setup.styleExpressive" as const, emoji: "🎨", descKey: "setup.styleExpressiveDesc" as const },
    { value: "laconic", labelKey: "setup.styleLaconic" as const, emoji: "🗿", descKey: "setup.styleLaconicDesc" as const },
  ];

  const [difficulty, setDifficulty] = useState("normal");
  const [personality, setPersonality] = useState([50]);
  const [goal, setGoal] = useState(goals[0].labelKey);
  const [sessionLength, setSessionLength] = useState("medium");
  const [focusSkill, setFocusSkill] = useState("all");
  const [aiStyle, setAiStyle] = useState("realistic");

  const personalityLabel =
    personality[0] < 33 ? t("setup.moodCalm") : personality[0] < 66 ? t("setup.moodNervous") : t("setup.moodAggressive");

  return (
    <div className="page-container max-w-2xl">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors tap-scale">
        <ArrowLeft className="h-4 w-4" /> {t("setup.back")}
      </button>

      {/* Scenario header */}
      <div className="mt-8 flex flex-col sm:flex-row items-start gap-5">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-primary/10 text-5xl shadow-soft">
          {s.emoji}
        </div>
        <div>
          <h1 className="text-2xl font-extrabold lg:text-3xl">{t(`scenario.${s.id}.title` as any) !== `scenario.${s.id}.title` ? t(`scenario.${s.id}.title` as any) : s.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t(`scenario.${s.id}.desc` as any) !== `scenario.${s.id}.desc` ? t(`scenario.${s.id}.desc` as any) : s.description}</p>
        </div>
      </div>

      {/* Difficulty */}
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

      {/* Session Length */}
      <h2 className="section-gap section-title">{t("setup.sessionLength")}</h2>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {sessionLengths.map((l) => (
          <Card
            key={l.value}
            onClick={() => setSessionLength(l.value)}
            className={`cursor-pointer text-center transition-all duration-200 tap-scale ${
              sessionLength === l.value
                ? "border-secondary/40 bg-secondary/5 shadow-glow ring-1 ring-secondary/20"
                : "border-border shadow-soft hover:border-secondary/20 hover:shadow-glow"
            }`}
          >
            <CardContent className="flex flex-col items-center gap-1.5 p-4 sm:p-5">
              <span className="text-2xl">{l.emoji}</span>
              <span className="font-bold text-sm">{t(l.labelKey)}</span>
              <span className="text-[11px] text-muted-foreground">{t(l.descKey)}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Personality */}
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

      {/* AI Response Style */}
      <h2 className="section-gap section-title">{t("setup.aiStyle")}</h2>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {aiStyles.map((s) => (
          <Card
            key={s.value}
            onClick={() => setAiStyle(s.value)}
            className={`cursor-pointer text-center transition-all duration-200 tap-scale ${
              aiStyle === s.value
                ? "border-primary/40 bg-primary/5 shadow-glow ring-1 ring-primary/20"
                : "border-border shadow-soft hover:border-primary/20 hover:shadow-glow"
            }`}
          >
            <CardContent className="flex flex-col items-center gap-1.5 p-4 sm:p-5">
              <span className="text-2xl">{s.emoji}</span>
              <span className="font-bold text-sm">{t(s.labelKey)}</span>
              <span className="text-[11px] text-muted-foreground">{t(s.descKey)}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Focus Skill */}
      <h2 className="section-gap section-title">{t("setup.focusSkill")}</h2>
      <div className="mt-4 grid grid-cols-4 gap-2">
        {focusSkills.map((fs) => {
          const Icon = fs.icon;
          return (
            <button
              key={fs.value}
              onClick={() => setFocusSkill(fs.value)}
              className={`flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-xs font-semibold transition-all duration-200 tap-scale ${
                focusSkill === fs.value
                  ? "border-primary/40 bg-primary/10 text-primary shadow-sm"
                  : "border-border bg-card text-muted-foreground hover:border-primary/20 hover:text-foreground"
              }`}
            >
              <Icon className={`h-5 w-5 ${focusSkill === fs.value ? "text-primary" : fs.color}`} />
              {t(fs.labelKey)}
            </button>
          );
        })}
      </div>

      {/* Your Goal */}
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

      {/* XP Preview */}
      <div className="section-gap">
        <XpPreviewCard
          difficulty={difficulty}
          personality={personality[0]}
          sessionLength={sessionLength}
          t={t}
        />
      </div>

      {/* Start Button */}
      <Button
        className="mt-8 w-full rounded-2xl py-6 text-base font-extrabold shadow-glow tap-scale gradient-primary hover:opacity-90 border-none mb-8"
        onClick={() => navigate("/simulation", {
          state: {
            scenarioId: s.id,
            scenario: s,
            difficulty,
            personality: personality[0],
            goal: t(goal as any),
            sessionLength,
            focusSkill,
            aiStyle,
          },
        })}
      >
        <Play className="h-5 w-5 mr-2" />
        {t("setup.startSimulation")}
      </Button>
    </div>
  );
};

export default Setup;
