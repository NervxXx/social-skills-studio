import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Send, Lightbulb, X, ArrowLeft, TrendingUp, Target, Zap, Brain, Heart, Shield, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { scenarios as fallbackScenarios, simulatedResponses } from "@/lib/data";
import { chatApi, type ScenarioResponse } from "@/lib/api";

const SCENARIO_FIRST_MSG_KEY: Record<string, string> = {
  "first-date": "sim.firstDate.msg0",
  "difficult-talk": "sim.difficultTalk.msg0",
  "meet-parents": "sim.meetParents.msg0",
  "breakup": "sim.breakup.msg0",
  "job-interview": "sim.jobInterview.msg0",
  "ask-raise": "sim.askRaise.msg0",
  "give-feedback": "sim.giveFeedback.msg0",
  "toxic-boss": "sim.toxicBoss.msg0",
  "calm-toddler": "sim.calmToddler.msg0",
  "teen-grades": "sim.teenGrades.msg0",
  "aging-parent": "sim.agingParent.msg0",
  "say-no": "sim.sayNo.msg0",
  "friend-crisis": "sim.friendCrisis.msg0",
  "apologize": "sim.apologize.msg0",
  "neighbor-noise": "sim.neighborNoise.msg0",
  "reply-rudeness": "sim.replyRudeness.msg0",
  "service-complaint": "sim.serviceComplaint.msg0",
  "elevator-pitch": "sim.elevatorPitch.msg0",
  "wedding-toast": "sim.weddingToast.msg0",
  "team-presentation": "sim.teamPresentation.msg0",
  "small-talk": "sim.smallTalk.msg0",
  "awkward-silence": "sim.awkwardSilence.msg0",
  "comfort-stranger": "sim.comfortStranger.msg0",
  "haggle": "sim.haggle.msg0",
  "salary-offer": "sim.salaryOffer.msg0",
  "landlord-dispute": "sim.landlordDispute.msg0",
};
import { useI18n } from "@/hooks/use-i18n";

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
}

interface TurnData {
  emotion: number;
  empathy: number;
  clarity: number;
  emotionalControl: number;
  quality: number;
}

const TIPS_RU = [
  "Попробуйте назвать чувства собеседника: «Я вижу, что тебе...»",
  "Задайте уточняющий вопрос вместо общей фразы.",
  "Используйте «я-высказывания» вместо обвинений.",
  "Отразите эмоцию собеседника прежде чем предлагать решение.",
  "Покажите, что вы слушаете — перефразируйте то, что услышали.",
  "Не торопитесь с советами — сначала дайте человеку высказаться.",
  "Конкретика звучит убедительнее абстракций.",
  "Пауза и «расскажи больше» — мощный приём.",
];
const TIPS_EN = [
  "Try naming the other person's feelings: 'I see that you...'",
  "Ask a follow-up question instead of a generic reply.",
  "Use 'I-statements' instead of accusations.",
  "Reflect the person's emotion before offering a solution.",
  "Show you're listening — paraphrase what you heard.",
  "Don't rush with advice — let them speak first.",
  "Specifics sound more convincing than abstractions.",
  "A pause and 'tell me more' is a powerful move.",
];

function getPhase(turnCount: number): "opening" | "building" | "deep" | "closing" {
  if (turnCount <= 2) return "opening";
  if (turnCount <= 5) return "building";
  if (turnCount <= 9) return "deep";
  return "closing";
}

function getEmotionLabel(emotion: number, t: (k: any) => string): string {
  if (emotion > 80) return t("sim.trustful");
  if (emotion > 60) return t("sim.open");
  if (emotion > 40) return t("sim.neutralMood");
  if (emotion > 20) return t("sim.tenseMood");
  return t("sim.hostile");
}

function getEmotionColor(emotion: number): string {
  if (emotion > 66) return "hsl(var(--success))";
  if (emotion > 33) return "hsl(var(--secondary))";
  return "hsl(var(--destructive))";
}

function SkillBar({ label, value, icon: Icon, color }: { label: string; value: number; icon: any; color: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <Icon className="h-3.5 w-3.5 shrink-0" style={{ color }} />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[11px] font-medium text-foreground truncate">{label}</span>
          <span className="text-[11px] font-bold tabular-nums" style={{ color }}>{value}</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/60">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${value}%`, backgroundColor: color }}
          />
        </div>
      </div>
    </div>
  );
}

function MiniEmotionChart({ history }: { history: number[] }) {
  if (history.length < 2) return null;
  const max = 100;
  const w = 100;
  const h = 32;
  const points = history.map((v, i) => {
    const x = (i / (history.length - 1)) * w;
    const y = h - (v / max) * h;
    return `${x},${y}`;
  });
  const lastVal = history[history.length - 1];
  const color = lastVal > 66 ? "hsl(var(--success))" : lastVal > 33 ? "hsl(var(--secondary))" : "hsl(var(--destructive))";
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-8" preserveAspectRatio="none">
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={points[points.length - 1].split(",")[0]} cy={points[points.length - 1].split(",")[1]} r="3" fill={color} />
    </svg>
  );
}

const Simulation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, locale } = useI18n();
  const scenarioId = (location.state as any)?.scenarioId || "first-date";
  const scenarioFromState = (location.state as any)?.scenario as ScenarioResponse | undefined;
  const scenario = scenarioFromState || fallbackScenarios.find((s) => s.id === scenarioId) || fallbackScenarios[0];
  const responses = simulatedResponses[scenarioId] || simulatedResponses["first-date"];
  const firstMsgKey = SCENARIO_FIRST_MSG_KEY[scenarioId];
  const firstMsg = firstMsgKey && t(firstMsgKey as any) !== firstMsgKey ? t(firstMsgKey as any) : responses[0];

  const difficulty = (location.state as any)?.difficulty || "normal";
  const personality = (location.state as any)?.personality ?? 50;
  const goal = (location.state as any)?.goal || t("setup.showEmpathy");
  const sessionLength = (location.state as any)?.sessionLength || "medium";
  const focusSkill = (location.state as any)?.focusSkill || "all";
  const aiStyle = (location.state as any)?.aiStyle || "realistic";

  const initialEmotion = personality < 33 ? 60 : personality < 66 ? 50 : 40;

  const [messages, setMessages] = useState<Message[]>([
    { id: 0, text: firstMsg, sender: "ai" },
  ]);
  const [input, setInput] = useState("");
  const [responseIndex, setResponseIndex] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [emotion, setEmotion] = useState(initialEmotion);
  const [empathy, setEmpathy] = useState(50);
  const [clarity, setClarity] = useState(50);
  const [emotionalControl, setEmotionalControl] = useState(50);
  const [showHint, setShowHint] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [turnHistory, setTurnHistory] = useState<TurnData[]>([]);
  const [emotionHistory, setEmotionHistory] = useState<number[]>([initialEmotion]);
  const [showMobilePanel, setShowMobilePanel] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const turnCount = turnHistory.length;
  const phase = getPhase(turnCount);
  const bestTurn = useMemo(() => {
    if (turnHistory.length === 0) return 0;
    return turnHistory.reduce((best, t, i) => t.quality > turnHistory[best].quality ? i : best, 0) + 1;
  }, [turnHistory]);
  const avgQuality = useMemo(() => {
    if (turnHistory.length === 0) return 0;
    return Math.round(turnHistory.reduce((s, t) => s + t.quality, 0) / turnHistory.length * 10);
  }, [turnHistory]);

  const currentTip = useMemo(() => {
    const tips = locale === "ru" ? TIPS_RU : TIPS_EN;
    return tips[turnCount % tips.length];
  }, [turnCount, locale]);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || isLoading) return;
    const userText = input.trim();
    setMessages((prev) => [...prev, { id: prev.length, text: userText, sender: "user" }]);
    setInput("");
    setIsLoading(true);

    const messageHistory = [
      ...messages.map((m) => ({ sender: m.sender, text: m.text })),
      { sender: "user" as const, text: userText },
    ];

    try {
      const res = await chatApi.simulate({
        scenario_id: scenario.id,
        scenario_title: t(`scenario.${scenario.id}.title` as any) !== `scenario.${scenario.id}.title` ? t(`scenario.${scenario.id}.title` as any) : scenario.title,
        scenario_description: t(`scenario.${scenario.id}.desc` as any) !== `scenario.${scenario.id}.desc` ? t(`scenario.${scenario.id}.desc` as any) : (scenario.description || ""),
        messages: messageHistory,
        language: locale,
        difficulty,
        personality,
        user_goal: goal,
        ai_style: aiStyle,
        focus_skill: focusSkill,
      });
      setMessages((prev) => [...prev, { id: prev.length, text: res.reply, sender: "ai" }]);

      const newEmotion = typeof res.emotion_after === "number" ? res.emotion_after : Math.min(100, emotion + 10);
      const newEmpathyDelta = typeof res.empathy_delta === "number" ? res.empathy_delta : 5;
      const newClarity = typeof res.clarity === "number" ? res.clarity : clarity;
      const newEC = typeof res.emotional_control === "number" ? res.emotional_control : emotionalControl;
      const newQuality = typeof res.turn_quality === "number" ? res.turn_quality : 5;

      setEmotion(newEmotion);
      setEmotionHistory((prev) => [...prev, newEmotion]);
      setEmpathy((e) => Math.min(100, Math.max(0, e + newEmpathyDelta)));
      setClarity(newClarity);
      setEmotionalControl(newEC);
      setTurnHistory((prev) => [...prev, {
        emotion: newEmotion,
        empathy: Math.min(100, Math.max(0, empathy + newEmpathyDelta)),
        clarity: newClarity,
        emotionalControl: newEC,
        quality: newQuality,
      }]);

      if (newEmpathyDelta > 6) {
        setShowFlash(true);
        setTimeout(() => setShowFlash(false), 1500);
      }
    } catch {
      if (responseIndex < responses.length) {
        setMessages((prev) => [...prev, { id: prev.length, text: responses[responseIndex], sender: "ai" }]);
        setResponseIndex((i) => i + 1);
        setEmotion((e) => Math.min(100, e + 10));
        setEmpathy((e) => Math.min(100, e + 5));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const hintKey = `hint.${scenarioId}` as any;
  const hintText = t(hintKey) !== hintKey ? t(hintKey) : t("hint.default");

  const phaseLabels = {
    opening: t("sim.phaseOpening"),
    building: t("sim.phaseBuilding"),
    deep: t("sim.phaseDeep"),
    closing: t("sim.phaseClosing"),
  };
  const phaseProgress = { opening: 15, building: 40, deep: 70, closing: 95 };

  const panelContent = (
    <>
      {/* AI Emotion */}
      <div>
        <h3 className="section-title flex items-center gap-2">
          {t("sim.aiEmotion")}
          <div className={`h-2 w-2 rounded-full animate-pulse`} style={{ backgroundColor: getEmotionColor(emotion) }} />
        </h3>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">{getEmotionLabel(emotion, t)}</span>
          <span className="text-muted-foreground font-mono text-xs">{emotion}%</span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted/50 border border-border/50">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${emotion}%`,
              background: `linear-gradient(90deg, hsl(0 80% 55%), hsl(45 90% 55%), hsl(140 60% 48%))`
            }}
          />
        </div>
        {emotionHistory.length >= 2 && (
          <div className="mt-2">
            <p className="text-[10px] text-muted-foreground mb-1">{t("sim.emotionHistory")}</p>
            <MiniEmotionChart history={emotionHistory} />
          </div>
        )}
      </div>

      {/* Your Skills — 3 bars */}
      <div>
        <h3 className="section-title">{t("sim.skills")}</h3>
        <div className="mt-3 space-y-3">
          <SkillBar label={t("sim.empathy")} value={empathy} icon={Heart} color="hsl(var(--primary))" />
          <SkillBar label={t("sim.clarity")} value={clarity} icon={Brain} color="hsl(var(--secondary))" />
          <SkillBar label={t("sim.emotionalControl")} value={emotionalControl} icon={Shield} color="hsl(var(--success))" />
        </div>
        {empathy > 80 && (
          <div className="mt-2 flex items-center gap-1.5">
            <Zap className="h-3 w-3 text-primary" />
            <span className="text-[10px] font-bold text-primary uppercase">{t("sim.excellent")}</span>
          </div>
        )}
        {empathy > 50 && empathy <= 80 && (
          <div className="mt-2">
            <span className="text-[10px] text-muted-foreground">{t("sim.goodProgress")}</span>
          </div>
        )}
        {empathy <= 50 && turnCount > 0 && (
          <div className="mt-2">
            <span className="text-[10px] text-muted-foreground">{t("sim.keepTrying")}</span>
          </div>
        )}
      </div>

      {/* Session Stats */}
      <div>
        <h3 className="section-title">{t("sim.stats")}</h3>
        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="rounded-xl bg-muted/40 p-2.5 text-center">
            <p className="text-lg font-extrabold text-foreground">{turnCount}</p>
            <p className="text-[9px] text-muted-foreground uppercase">{t("sim.turn")}</p>
          </div>
          <div className="rounded-xl bg-muted/40 p-2.5 text-center">
            <p className="text-lg font-extrabold text-foreground">{bestTurn || "—"}</p>
            <p className="text-[9px] text-muted-foreground uppercase">{t("sim.bestTurn")}</p>
          </div>
          <div className="rounded-xl bg-muted/40 p-2.5 text-center">
            <p className="text-lg font-extrabold text-foreground">{avgQuality || "—"}<span className="text-xs font-normal text-muted-foreground">%</span></p>
            <p className="text-[9px] text-muted-foreground uppercase">{t("sim.avgQuality")}</p>
          </div>
        </div>
      </div>

      {/* Conversation Phase */}
      <div>
        <h3 className="section-title">{t("sim.phase")}</h3>
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-foreground">{phaseLabels[phase]}</span>
            <span className="text-[10px] text-muted-foreground">{phaseProgress[phase]}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/50">
            <div
              className="h-full rounded-full bg-secondary transition-all duration-700"
              style={{ width: `${phaseProgress[phase]}%` }}
            />
          </div>
          <div className="flex justify-between mt-1 text-[9px] text-muted-foreground/60">
            <span className={phase === "opening" ? "text-secondary font-bold" : ""}>·</span>
            <span className={phase === "building" ? "text-secondary font-bold" : ""}>·</span>
            <span className={phase === "deep" ? "text-secondary font-bold" : ""}>·</span>
            <span className={phase === "closing" ? "text-secondary font-bold" : ""}>·</span>
          </div>
        </div>
      </div>

      {/* Goal + Tip */}
      <div className="mt-auto space-y-3">
        <div className="rounded-2xl bg-secondary/5 border border-secondary/10 p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <Target className="h-3.5 w-3.5 text-secondary/70" />
            <p className="text-[10px] font-bold text-secondary/70 uppercase tracking-widest">{t("sim.goal")}</p>
          </div>
          <p className="text-sm font-semibold text-foreground leading-relaxed">{goal}</p>
        </div>

        <div className="rounded-2xl bg-muted/30 p-4 border border-border/50">
          <div className="flex items-center gap-2 mb-1.5">
            <Lightbulb className="h-3.5 w-3.5 text-warning" />
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">{t("sim.aiTip")}</p>
          </div>
          <p className="text-[11px] text-muted-foreground italic leading-relaxed">
            «{currentTip}»
          </p>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen flex-col lg:flex-row relative">
      {showFlash && (
        <div className="absolute inset-0 pointer-events-none z-50 bg-primary/10 animate-out fade-out duration-1000 flex items-center justify-center">
          <div className="bg-primary/20 p-8 rounded-full blur-3xl animate-pulse" />
        </div>
      )}

      <div className="flex flex-1 flex-col min-w-0">
        {/* Chat header */}
        <div className="flex items-center justify-between border-b border-border px-5 sm:px-8 py-4 glass shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="rounded-xl p-2 hover:bg-muted transition-colors tap-scale">
              <ArrowLeft className="h-4 w-4 text-muted-foreground" />
            </button>
            <Avatar className="h-10 w-10 border-2 border-secondary/30">
              <AvatarFallback className="bg-secondary/15 text-secondary text-sm font-bold">AI</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-bold text-sm sm:text-base">{t(`scenario.${scenario.id}.title` as any)}</h1>
              <p className="text-xs text-muted-foreground">{t("sim.aiPartner")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Mobile panel toggle */}
            <button
              className="lg:hidden rounded-xl p-2 hover:bg-muted transition-colors tap-scale"
              onClick={() => setShowMobilePanel((v) => !v)}
            >
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </button>
            <Button
              variant="outline" size="sm"
              className="rounded-xl border-destructive/30 text-destructive hover:bg-destructive/5 tap-scale text-xs sm:text-sm"
              onClick={() => navigate("/feedback", { state: {
                scenarioId, score: empathy, messages, scenario,
                difficulty, personality, sessionLength, turnCount,
                clarity, emotionalControl,
              } })}
            >
              <X className="mr-1 h-3.5 w-3.5" /> {t("sim.endSession")}
            </Button>
          </div>
        </div>

        {/* Mobile slide-down panel */}
        {showMobilePanel && (
          <div className="lg:hidden border-b border-border bg-card px-5 py-5 space-y-5 animate-in slide-in-from-top-2 duration-200 max-h-[60vh] overflow-y-auto">
            {panelContent}
          </div>
        )}

        {/* Messages */}
        <div ref={chatRef} className="flex-1 overflow-y-auto px-5 sm:px-8 py-6 space-y-6">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in`}>
              {m.sender === "ai" && (
                <Avatar className="mr-3 mt-1 h-8 w-8 shrink-0">
                  <AvatarFallback className="bg-secondary/15 text-secondary text-xs font-bold">AI</AvatarFallback>
                </Avatar>
              )}
              <div className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-soft ${m.sender === "user" ? "gradient-primary text-primary-foreground rounded-br-lg" : "bg-card text-foreground border border-border rounded-bl-lg"
                }`}>
                {m.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start animate-fade-in">
              <Avatar className="mr-3 mt-1 h-8 w-8 shrink-0">
                <AvatarFallback className="bg-secondary/15 text-secondary text-xs font-bold">AI</AvatarFallback>
              </Avatar>
              <div className="rounded-2xl px-4 py-3 bg-card border border-border rounded-bl-lg">
                <div className="flex gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Hint */}
        {showHint && (
          <div className="mx-5 sm:mx-8 mb-3 flex items-start gap-3 rounded-2xl border border-secondary/20 bg-secondary/5 p-4 animate-fade-in">
            <Lightbulb className="h-5 w-5 shrink-0 text-secondary mt-0.5" />
            <p className="text-sm text-foreground">{hintText}</p>
          </div>
        )}

        {/* Mobile mini-bar */}
        <div className="lg:hidden flex items-center gap-3 border-t border-border/50 px-5 py-2 bg-card/60 backdrop-blur-sm">
          <div className="flex items-center gap-1.5 flex-1">
            <Heart className="h-3 w-3 text-primary" />
            <div className="h-1.5 flex-1 rounded-full bg-muted/50 overflow-hidden">
              <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${empathy}%` }} />
            </div>
            <span className="text-[10px] font-bold text-primary tabular-nums">{empathy}</span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: getEmotionColor(emotion) }} />
            <span className="text-[10px] font-medium text-muted-foreground">{emotion}%</span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-1">
            <MessageCircle className="h-3 w-3 text-muted-foreground" />
            <span className="text-[10px] font-medium text-muted-foreground">{turnCount}</span>
          </div>
        </div>

        {/* Input */}
        <div className="flex items-center gap-3 border-t border-border px-5 sm:px-8 py-4 glass shrink-0">
          <button onClick={() => setShowHint((h) => !h)} className={`shrink-0 rounded-2xl p-3 transition-colors tap-scale ${showHint ? "bg-secondary/10 text-secondary" : "text-muted-foreground hover:bg-muted"}`}>
            <Lightbulb className="h-5 w-5" />
          </button>
          <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder={t("sim.typeResponse")} className="h-12 rounded-2xl bg-card border-border text-base" />
          <Button size="icon" className="h-12 w-12 shrink-0 rounded-2xl shadow-glow tap-scale" onClick={send} disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Side panel - desktop */}
      <div className="hidden lg:flex w-80 flex-col gap-6 border-l border-border bg-card p-6 shrink-0 relative overflow-y-auto">
        <div
          className="absolute top-0 right-0 w-64 h-64 blur-[100px] opacity-15 transition-colors duration-1000 -z-10"
          style={{ backgroundColor: getEmotionColor(emotion) }}
        />
        {panelContent}
      </div>
    </div>
  );
};

export default Simulation;
