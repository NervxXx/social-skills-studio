import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Send, Lightbulb, X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { scenarios as fallbackScenarios, simulatedResponses } from "@/lib/data";
import { chatApi, type ScenarioResponse } from "@/lib/api";

const SCENARIO_FIRST_MSG_KEY: Record<string, string> = {
  "first-date": "sim.firstDate.msg0",
  "ask-raise": "sim.askRaise.msg0",
  "calm-toddler": "sim.calmToddler.msg0",
  "say-no": "sim.sayNo.msg0",
  "reply-rudeness": "sim.replyRudeness.msg0",
  "wedding-toast": "sim.weddingToast.msg0",
};
import { useI18n } from "@/hooks/use-i18n";

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
  thought?: string;
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

  const initialEmotion = personality < 33 ? 60 : personality < 66 ? 50 : 40;

  const [messages, setMessages] = useState<Message[]>([
    { id: 0, text: firstMsg, sender: "ai" },
  ]);
  const [input, setInput] = useState("");
  const [responseIndex, setResponseIndex] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [emotion, setEmotion] = useState(initialEmotion);
  const [empathy, setEmpathy] = useState(60);
  const [showHint, setShowHint] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

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
      });
      setMessages((prev) => [...prev, { id: prev.length, text: res.reply, sender: "ai", thought: res.thought }]);
      if (typeof res.emotion_after === "number") {
        setEmotion(res.emotion_after);
      } else {
        setEmotion((e) => Math.min(100, e + 10));
      }
      if (typeof res.empathy_delta === "number") {
        setEmpathy((e) => Math.min(100, Math.max(0, e + res.empathy_delta!)));
        if (res.empathy_delta > 6) {
          setShowFlash(true);
          setTimeout(() => setShowFlash(false), 1500);
        }
      } else {
        setEmpathy((e) => Math.min(100, e + 5));
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

  const [revealedThoughts, setRevealedThoughts] = useState<Set<number>>(new Set());

  const toggleThought = (id: number) => {
    setRevealedThoughts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="flex h-screen flex-col lg:flex-row relative">
      {/* Empathy Flash Effect */}
      {showFlash && (
        <div className="absolute inset-0 pointer-events-none z-50 bg-primary/10 animate-out fade-out duration-1000 flex items-center justify-center">
          <div className="bg-primary/20 p-8 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary font-black text-6xl opacity-30 select-none">
            EXCELLENT
          </div>
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
          <Button
            variant="outline" size="sm"
            className="rounded-xl border-destructive/30 text-destructive hover:bg-destructive/5 tap-scale text-xs sm:text-sm"
            onClick={() => navigate("/feedback", { state: { scenarioId, score: empathy, messages, scenario } })}
          >
            <X className="mr-1 h-3.5 w-3.5" /> {t("sim.endSession")}
          </Button>
        </div>

        {/* Messages */}
        <div ref={chatRef} className="flex-1 overflow-y-auto px-5 sm:px-8 py-6 space-y-6">
          {messages.map((m) => (
            <div key={m.id} className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"} animate-fade-in`}>
              <div className={`flex w-full ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                {m.sender === "ai" && (
                  <Avatar className="mr-3 mt-1 h-8 w-8 shrink-0">
                    <AvatarFallback className="bg-secondary/15 text-secondary text-xs font-bold">AI</AvatarFallback>
                  </Avatar>
                )}
                <div className="relative group max-w-[80%] sm:max-w-[70%]">
                  <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-soft ${m.sender === "user" ? "gradient-primary text-primary-foreground rounded-br-lg" : "bg-card text-foreground border border-border rounded-bl-lg"
                    }`}>
                    {m.text}
                  </div>

                  {m.sender === "ai" && m.thought && (
                    <button
                      onClick={() => toggleThought(m.id)}
                      className={`mt-2 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider transition-colors ${revealedThoughts.has(m.id) ? "text-secondary" : "text-muted-foreground/60 hover:text-secondary/80"
                        }`}
                    >
                      <div className={`h-1.5 w-1.5 rounded-full ${revealedThoughts.has(m.id) ? "bg-secondary animate-pulse" : "bg-muted-foreground/30"}`} />
                      {revealedThoughts.has(m.id) ? "Мысли персонажа" : "Услышать мысли"}
                    </button>
                  )}
                </div>
              </div>

              {m.sender === "ai" && m.thought && revealedThoughts.has(m.id) && (
                <div className="mt-2 ml-11 max-w-[75%] rounded-xl bg-secondary/5 border border-secondary/20 p-3 text-xs italic text-secondary/90 animate-in fade-in slide-in-from-top-2 duration-300">
                  <span className="font-bold not-italic mr-1">💭</span> {m.thought}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Hint */}
        {showHint && (
          <div className="mx-5 sm:mx-8 mb-3 flex items-start gap-3 rounded-2xl border border-secondary/20 bg-secondary/5 p-4 animate-fade-in">
            <Lightbulb className="h-5 w-5 shrink-0 text-secondary mt-0.5" />
            <p className="text-sm text-foreground">{hintText}</p>
          </div>
        )}

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

      {/* Side panel - desktop only */}
      <div className="hidden lg:flex w-72 flex-col gap-8 border-l border-border bg-card p-6 shrink-0 relative overflow-hidden">
        {/* Decorative background glow that changes with emotion */}
        <div
          className="absolute top-0 right-0 w-64 h-64 blur-[100px] opacity-20 transition-colors duration-1000 -z-10"
          style={{ backgroundColor: emotion > 66 ? "hsl(var(--success))" : emotion > 33 ? "hsl(var(--secondary))" : "hsl(var(--destructive))" }}
        />

        <div>
          <h3 className="section-title flex items-center gap-2">
            {t("sim.aiEmotion")}
            <div className={`h-2 w-2 rounded-full animate-pulse ${emotion > 66 ? "bg-success" : emotion > 33 ? "bg-secondary" : "bg-destructive"}`} />
          </h3>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">
              {emotion > 75 ? "Доверительный" : emotion > 60 ? "Открытый" : emotion > 40 ? "Нейтральный" : "Напряженный"}
            </span>
            <span className="text-muted-foreground font-mono">{emotion}%</span>
          </div>
          <div className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-muted/50 border border-border/50">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${emotion}%`,
                background: `linear-gradient(90deg, hsl(0 80% 55%), hsl(45 90% 55%), hsl(140 60% 48%))`
              }}
            />
          </div>
        </div>

        <div>
          <h3 className="section-title">{t("sim.yourEmpathy")}</h3>
          <div className="mt-4 flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-2xl text-primary animate-in zoom-in duration-500" key={empathy}>
                {empathy}%
              </span>
              {empathy > 80 && <div className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary uppercase">Elite</div>}
            </div>
            <span className="text-muted-foreground text-xs">{empathy > 70 ? "Отличный резонанс!" : "Продолжайте..."}</span>
          </div>
          <div className="mt-3.5 h-3 w-full overflow-hidden rounded-full bg-muted/50 border border-border/50 p-0.5">
            <div
              className="h-full rounded-full bg-primary transition-all duration-1000 ease-out shadow-glow"
              style={{ width: `${empathy}%` }}
            />
          </div>
        </div>

        <div className="mt-auto space-y-4">
          <div className="rounded-2xl bg-secondary/5 border border-secondary/10 p-5 backdrop-blur-sm">
            <p className="section-title text-[10px] text-secondary/70 uppercase tracking-widest">{t("sim.goal")}</p>
            <p className="mt-2 text-sm font-semibold text-foreground leading-relaxed">{goal}</p>
          </div>

          <div className="rounded-2xl bg-muted/30 p-4 border border-border/50">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter mb-2">Совет от ИИ</p>
            <p className="text-[11px] text-muted-foreground italic">
              «Попробуйте не просто решить проблему, а подтвердить чувства собеседника.»
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Simulation;
