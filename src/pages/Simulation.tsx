import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Send, Lightbulb, X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { scenarios, simulatedResponses } from "@/lib/data";

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
}

const hints: Record<string, string> = {
  "first-date": "Try asking about their hobbies or sharing something personal!",
  "ask-raise": "Focus on your specific achievements and use confident language.",
  "calm-toddler": "Get down to their level and validate their feelings first.",
  "say-no": "Use 'I' statements and offer an alternative if possible.",
  "reply-rudeness": "Stay calm, acknowledge their point, then redirect professionally.",
  "wedding-toast": "Start with a funny memory, then shift to something heartfelt.",
};

const Simulation = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
    const userMsg: Message = { id: messages.length, text: input, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      if (responseIndex < responses.length) {
        setMessages((prev) => [
          ...prev,
          { id: prev.length, text: responses[responseIndex], sender: "ai" },
        ]);
        setResponseIndex((i) => i + 1);
        setEmotion((e) => Math.min(100, e + 10));
        setEmpathy((e) => Math.min(100, e + 5));
      }
    }, 1200);
  };

  return (
    <div className="flex h-screen">
      {/* Left panel — Chat */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4 glass">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="rounded-xl p-2 hover:bg-muted transition-colors tap-scale">
              <ArrowLeft className="h-4 w-4 text-muted-foreground" />
            </button>
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-secondary/30">
                <AvatarFallback className="bg-secondary/15 text-secondary text-sm font-bold">AI</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="font-bold">{scenario.title}</h1>
                <p className="text-xs text-muted-foreground">AI Partner · Active</p>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl border-destructive/30 text-destructive hover:bg-destructive/5 tap-scale"
            onClick={() => navigate("/feedback", { state: { scenarioId } })}
          >
            <X className="mr-1 h-3.5 w-3.5" /> End Session
          </Button>
        </div>

        {/* Chat */}
        <div ref={chatRef} className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
            >
              {m.sender === "ai" && (
                <Avatar className="mr-3 mt-1 h-8 w-8 shrink-0">
                  <AvatarFallback className="bg-secondary/15 text-secondary text-xs font-bold">AI</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-soft ${
                  m.sender === "user"
                    ? "gradient-primary text-primary-foreground rounded-br-lg"
                    : "bg-card text-foreground border border-border rounded-bl-lg"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Hint */}
        {showHint && (
          <div className="mx-6 mb-3 flex items-start gap-3 rounded-2xl border border-secondary/20 bg-secondary/5 p-4 animate-fade-in">
            <Lightbulb className="h-5 w-5 shrink-0 text-secondary mt-0.5" />
            <p className="text-sm text-foreground">{hints[scenarioId] || "Try being empathetic and clear."}</p>
          </div>
        )}

        {/* Input */}
        <div className="flex items-center gap-3 border-t border-border px-6 py-4 glass">
          <button
            onClick={() => setShowHint((h) => !h)}
            className={`shrink-0 rounded-2xl p-3 transition-colors tap-scale ${showHint ? "bg-secondary/10 text-secondary" : "text-muted-foreground hover:bg-muted"}`}
          >
            <Lightbulb className="h-5 w-5" />
          </button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Type your response..."
            className="h-12 rounded-2xl bg-card border-border"
          />
          <Button size="icon" className="h-12 w-12 shrink-0 rounded-2xl shadow-glow tap-scale" onClick={send}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Right panel — Meters (desktop only) */}
      <div className="hidden lg:flex w-72 flex-col gap-6 border-l border-border bg-card p-6">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">AI Emotion</h3>
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="font-medium">{emotion > 66 ? "😊 Positive" : emotion > 33 ? "😐 Neutral" : "😠 Tense"}</span>
            <span className="text-muted-foreground">{emotion}%</span>
          </div>
          <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${emotion}%`,
                background: `linear-gradient(90deg, hsl(0 80% 55%), hsl(45 90% 55%), hsl(140 60% 48%))`,
              }}
            />
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Your Empathy</h3>
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="font-bold text-primary">{empathy}%</span>
            <span className="text-muted-foreground">{empathy > 70 ? "Great!" : "Keep going"}</span>
          </div>
          <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-700"
              style={{ width: `${empathy}%` }}
            />
          </div>
        </div>

        <div className="mt-auto rounded-2xl bg-muted/50 p-4">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Goal</p>
          <p className="mt-1 font-semibold text-foreground">{(location.state as any)?.goal || "Show empathy"}</p>
        </div>
      </div>
    </div>
  );
};

export default Simulation;
