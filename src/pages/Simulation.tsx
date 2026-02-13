import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Send, Lightbulb, X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { scenarios, simulatedResponses } from "@/lib/data";
import { useI18n } from "@/hooks/use-i18n";

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
}

const Simulation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useI18n();
  const scenarioId = (location.state as any)?.scenarioId || "first-date";
  const scenario = scenarios.find((s) => s.id === scenarioId) || scenarios[0];
  const responses = simulatedResponses[scenarioId] || simulatedResponses["first-date"];

  const [messages, setMessages] = useState<Message[]>([
    { id: 0, text: responses[0], sender: "ai" },
  ]);
  const [input, setInput] = useState("");
  const [responseIndex, setResponseIndex] = useState(1);
  const [emotion, setEmotion] = useState(50);
  const [empathy, setEmpathy] = useState(60);
  const [showHint, setShowHint] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { id: prev.length, text: input, sender: "user" }]);
    setInput("");
    setTimeout(() => {
      if (responseIndex < responses.length) {
        setMessages((prev) => [...prev, { id: prev.length, text: responses[responseIndex], sender: "ai" }]);
        setResponseIndex((i) => i + 1);
        setEmotion((e) => Math.min(100, e + 10));
        setEmpathy((e) => Math.min(100, e + 5));
      }
    }, 1200);
  };

  const hintKey = `hint.${scenarioId}` as any;
  const hintText = t(hintKey) !== hintKey ? t(hintKey) : t("hint.default");

  return (
    <div className="flex h-screen flex-col lg:flex-row">
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
            onClick={() => navigate("/feedback", { state: { scenarioId } })}
          >
            <X className="mr-1 h-3.5 w-3.5" /> {t("sim.endSession")}
          </Button>
        </div>

        {/* Messages */}
        <div ref={chatRef} className="flex-1 overflow-y-auto px-5 sm:px-8 py-6 space-y-4">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in`}>
              {m.sender === "ai" && (
                <Avatar className="mr-3 mt-1 h-8 w-8 shrink-0">
                  <AvatarFallback className="bg-secondary/15 text-secondary text-xs font-bold">AI</AvatarFallback>
                </Avatar>
              )}
              <div className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-soft ${
                m.sender === "user" ? "gradient-primary text-primary-foreground rounded-br-lg" : "bg-card text-foreground border border-border rounded-bl-lg"
              }`}>
                {m.text}
              </div>
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
          <Button size="icon" className="h-12 w-12 shrink-0 rounded-2xl shadow-glow tap-scale" onClick={send}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Side panel - desktop only */}
      <div className="hidden lg:flex w-72 flex-col gap-8 border-l border-border bg-card p-6 shrink-0">
        <div>
          <h3 className="section-title">{t("sim.aiEmotion")}</h3>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="font-medium">{emotion > 66 ? t("sim.positive") : emotion > 33 ? t("sim.neutral") : t("sim.tense")}</span>
            <span className="text-muted-foreground">{emotion}%</span>
          </div>
          <div className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${emotion}%`, background: `linear-gradient(90deg, hsl(0 80% 55%), hsl(45 90% 55%), hsl(140 60% 48%))` }} />
          </div>
        </div>
        <div>
          <h3 className="section-title">{t("sim.yourEmpathy")}</h3>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="font-bold text-primary">{empathy}%</span>
            <span className="text-muted-foreground">{empathy > 70 ? t("sim.great") : t("sim.keepGoing")}</span>
          </div>
          <div className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${empathy}%` }} />
          </div>
        </div>
        <div className="mt-auto rounded-2xl bg-muted/50 p-5">
          <p className="section-title">{t("sim.goal")}</p>
          <p className="mt-2 font-semibold text-foreground">{(location.state as any)?.goal || t("setup.showEmpathy")}</p>
        </div>
      </div>
    </div>
  );
};

export default Simulation;
