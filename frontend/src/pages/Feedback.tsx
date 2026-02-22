import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RotateCcw, ArrowRight, CheckCircle2, AlertTriangle, Zap } from "lucide-react";
import { scenarios as fallbackScenarios } from "@/lib/data";
import { getScenarioById, chatApi } from "@/lib/api";
import { useI18n } from "@/hooks/use-i18n";
import { useAuth } from "@/contexts/AuthContext";
import { simulationsApi } from "@/lib/api";

interface FeedbackData {
  skills: Record<string, number>;
  positives: { phrase: string; note: string }[];
  negatives: { phrase: string; note: string }[];
  tip: string;
}

const buildFallbackFeedback = (score: number, t: (k: string) => string): FeedbackData => {
  const s = Math.max(0, Math.min(100, score));
  const variation = (v: number) => Math.max(0, Math.min(100, s + v));
  return {
    skills: {
      empathy: variation(5),
      clarity: variation(-3),
      emotional_control: variation(8),
      assertiveness: variation(-5),
    },
    positives: s >= 60
      ? [
          { phrase: t("phrase.pos1"), note: t("phrase.pos1.note") },
          { phrase: t("phrase.pos2"), note: t("phrase.pos2.note") },
        ]
      : [
          { phrase: t("feedback.keepTrying"), note: t("feedback.keepTrying.note") },
          { phrase: t("feedback.practiceMore"), note: t("feedback.practiceMore.note") },
        ],
    negatives: [
      { phrase: t("phrase.neg1"), note: t("phrase.neg1.note") },
      { phrase: t("phrase.neg2"), note: t("phrase.neg2.note") },
    ],
    tip: t("feedback.tipText"),
  };
};

const Feedback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, locale } = useI18n();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const scenarioId = (location.state as any)?.scenarioId || "first-date";
  const scoreFromState = (location.state as any)?.score as number | undefined;
  const messagesFromState = (location.state as any)?.messages as { text: string; sender: string }[] | undefined;
  const scenarioFromState = (location.state as any)?.scenario;
  const difficultyFromState = (location.state as any)?.difficulty || "normal";
  const personalityFromState = (location.state as any)?.personality ?? 50;
  const sessionLengthFromState = (location.state as any)?.sessionLength || "medium";
  const turnCountFromState = (location.state as any)?.turnCount ?? 0;
  const clarityFromState = (location.state as any)?.clarity ?? 0;
  const ecFromState = (location.state as any)?.emotionalControl ?? 0;
  const [scenario, setScenario] = useState(scenarioFromState || fallbackScenarios.find((s) => s.id === scenarioId) || fallbackScenarios[0]);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [xpEarned, setXpEarned] = useState(0);
  const overallScore = scoreFromState ?? 0;

  useEffect(() => {
    getScenarioById(scenarioId).then((s) => setScenario(s)).catch(() => {});
  }, [scenarioId]);

  useEffect(() => {
    if (isAuthenticated && scoreFromState !== undefined) {
      simulationsApi.save({
        scenario_id: scenarioId,
        score: scoreFromState,
        empathy_score: scoreFromState,
        clarity_score: clarityFromState,
        emotional_control_score: ecFromState,
        difficulty: difficultyFromState,
        personality: personalityFromState,
        session_length: sessionLengthFromState,
        turn_count: turnCountFromState,
      }).then((res) => {
        setXpEarned(res.xp_earned || 0);
      }).catch(() => {
        toast({ title: t("feedback.saveError"), variant: "destructive" });
      });
    }
  }, [isAuthenticated, scenarioId, scoreFromState, clarityFromState, ecFromState, difficultyFromState, personalityFromState, sessionLengthFromState, turnCountFromState, toast, t]);

  useEffect(() => {
    const loadFeedback = async () => {
      if (messagesFromState && messagesFromState.length >= 2 && scoreFromState !== undefined) {
        try {
          const result = await chatApi.analyzeFeedback({
            scenario_id: scenarioId,
            scenario_title: t(`scenario.${scenario.id}.title` as any) !== `scenario.${scenario.id}.title` ? t(`scenario.${scenario.id}.title` as any) : scenario.title,
            messages: messagesFromState.map((m) => ({ sender: m.sender, text: m.text })),
            score: overallScore,
            language: locale,
          });
          setFeedback({
            skills: result.skills || {},
            positives: result.positives || [],
            negatives: result.negatives || [],
            tip: result.tip || t("feedback.tipText"),
          });
        } catch {
          setFeedback(buildFallbackFeedback(overallScore, t));
        }
      } else {
        setFeedback(buildFallbackFeedback(overallScore, t));
      }
    };
    loadFeedback();
  }, [scenarioId, scenario, messagesFromState, scoreFromState, overallScore, locale, t]);

  const fd = feedback || buildFallbackFeedback(overallScore, t);
  const skills = [
    { key: "skill.empathy" as const, score: fd.skills.empathy ?? overallScore },
    { key: "skill.clarity" as const, score: fd.skills.clarity ?? overallScore },
    { key: "skill.emotionalControl" as const, score: fd.skills.emotional_control ?? overallScore },
    { key: "skill.assertiveness" as const, score: fd.skills.assertiveness ?? overallScore },
  ];
  const positives = fd.positives.length >= 2 ? fd.positives : [
    { phrase: t("phrase.pos1"), note: t("phrase.pos1.note") },
    { phrase: t("phrase.pos2"), note: t("phrase.pos2.note") },
  ];
  const negatives = fd.negatives.length >= 2 ? fd.negatives : [
    { phrase: t("phrase.neg1"), note: t("phrase.neg1.note") },
    { phrase: t("phrase.neg2"), note: t("phrase.neg2.note") },
  ];
  const tipText = fd.tip || t("feedback.tipText");

  return (
    <div className="page-container max-w-3xl">
      <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-6">
        <div className="flex h-24 w-24 sm:h-28 sm:w-28 shrink-0 items-center justify-center rounded-3xl bg-primary/10 shadow-glow">
          <span className="text-4xl sm:text-5xl">{scenario.emoji}</span>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{t("feedback.complete")}</p>
          <h1 className="text-2xl font-extrabold lg:text-3xl mt-0.5">{t(`scenario.${scenario.id}.title` as any)}</h1>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t("feedback.howYouDid")}</p>
        </div>
      </div>

      <div className="section-gap grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="shadow-soft border-border flex flex-col items-center justify-center">
          <CardContent className="flex flex-col items-center p-8">
            <div className="relative flex h-36 w-36 items-center justify-center">
              <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" strokeWidth="7" className="stroke-muted" />
                <circle cx="60" cy="60" r="50" fill="none" strokeWidth="7" strokeLinecap="round" className="stroke-primary" strokeDasharray={`${overallScore * 3.14} 314`} style={{ transition: "stroke-dasharray 1s ease" }} />
              </svg>
              <span className="text-4xl font-extrabold text-primary">{overallScore}%</span>
            </div>
            <p className="mt-3 text-sm font-medium text-muted-foreground">{t("feedback.overallScore")}</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-border lg:col-span-2">
          <CardContent className="p-6">
            <h2 className="section-title">{t("feedback.skillBreakdown")}</h2>
            <div className="mt-5 space-y-5">
              {skills.map((s) => (
                <div key={s.key}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-semibold">{t(s.key)}</span>
                    <span className="font-bold text-primary">{s.score}%</span>
                  </div>
                  <Progress value={Math.min(100, Math.max(0, s.score))} className="h-2 rounded-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="section-gap grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <h2 className="section-title mb-4">{t("feedback.wentWell")}</h2>
          {positives.map((p, i) => (
            <Card key={i} className="mb-3 border-success/20 bg-success/5 shadow-soft">
              <CardContent className="flex items-start gap-3 p-4">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-success mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{p.phrase}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{p.note}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div>
          <h2 className="section-title mb-4">{t("feedback.toImprove")}</h2>
          {negatives.map((n, i) => (
            <Card key={i} className="mb-3 border-warning/20 bg-warning/5 shadow-soft">
              <CardContent className="flex items-start gap-3 p-4">
                <AlertTriangle className="h-5 w-5 shrink-0 text-warning mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{n.phrase}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{n.note}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card className="section-gap shadow-soft border-secondary/20 bg-secondary/5">
        <CardContent className="flex items-start gap-4 p-5 sm:p-6">
          <span className="text-2xl">💡</span>
          <div>
            <p className="font-bold text-foreground">{t("feedback.tipTitle")}</p>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{tipText}</p>
          </div>
        </CardContent>
      </Card>

      {xpEarned > 0 && (
        <Card className="section-gap border-primary/20 bg-primary/5 shadow-glow">
          <CardContent className="flex items-center gap-4 p-5 sm:p-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/20">
              <Zap className="h-7 w-7 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t("feedback.xpEarned")}</p>
              <p className="text-3xl font-extrabold text-primary">+{xpEarned} XP</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="section-gap flex flex-col gap-3 sm:flex-row pb-8">
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
