import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Send, Lightbulb, X } from "lucide-react";
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
  const [emotion, setEmotion] = useState(50); // 0-100: red to green
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

    // Simulate AI reply
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
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <h1 className="font-bold">{scenario.title}</h1>
          <p className="text-xs text-muted-foreground">AI Partner</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive tap-scale"
          onClick={() => navigate("/feedback", { state: { scenarioId } })}
        >
          <X className="mr-1 h-4 w-4" /> End
        </Button>
      </div>

      {/* Emotion meter */}
      <div className="px-4 py-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
          <span>AI Emotion</span>
          <span>{emotion > 66 ? "😊 Positive" : emotion > 33 ? "😐 Neutral" : "😠 Tense"}</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${emotion}%`,
              background: `linear-gradient(90deg, hsl(0 80% 55%), hsl(45 90% 55%), hsl(140 60% 48%))`,
            }}
          />
        </div>
      </div>

      {/* Empathy score */}
      <div className="px-4 pb-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
          <span>Your Empathy</span>
          <span className="font-semibold text-primary">{empathy}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${empathy}%` }}
          />
        </div>
      </div>

      {/* Chat */}
      <div ref={chatRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {m.sender === "ai" && (
              <Avatar className="mr-2 mt-1 h-8 w-8 shrink-0">
                <AvatarFallback className="bg-secondary/20 text-secondary text-xs font-bold">
                  AI
                </AvatarFallback>
              </Avatar>
            )}
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                m.sender === "user"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-muted text-foreground rounded-bl-md"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      {/* Hint */}
      {showHint && (
        <div className="mx-4 mb-2 rounded-2xl border border-secondary/30 bg-secondary/10 p-3 text-sm text-secondary">
          💡 {hints[scenarioId] || "Try being empathetic and clear."}
        </div>
      )}

      {/* Input */}
      <div className="flex items-center gap-2 border-t border-border px-4 py-3">
        <button
          onClick={() => setShowHint((h) => !h)}
          className="shrink-0 rounded-full p-2 text-secondary hover:bg-secondary/10 tap-scale"
        >
          <Lightbulb className="h-5 w-5" />
        </button>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Type your response..."
          className="rounded-full"
        />
        <Button size="icon" className="shrink-0 rounded-full tap-scale" onClick={send}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Simulation;
