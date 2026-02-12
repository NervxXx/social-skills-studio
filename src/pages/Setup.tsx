import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { scenarios } from "@/lib/data";

const difficultyLevels = [
  { value: "calm", label: "Calm", emoji: "😊", desc: "Relaxed conversation" },
  { value: "normal", label: "Normal", emoji: "😐", desc: "Realistic tension" },
  { value: "challenging", label: "Challenging", emoji: "😰", desc: "High pressure" },
];

const goals = [
  { label: "De-escalate", emoji: "🕊️" },
  { label: "Show empathy", emoji: "💖" },
  { label: "Get agreement", emoji: "🤝" },
];

const Setup = () => {
  const { scenarioId } = useParams();
  const navigate = useNavigate();
  const scenario = scenarios.find((s) => s.id === scenarioId) || scenarios[0];

  const [difficulty, setDifficulty] = useState("normal");
  const [personality, setPersonality] = useState([50]);
  const [goal, setGoal] = useState(goals[0].label);

  const personalityLabel =
    personality[0] < 33 ? "😌 Calm" : personality[0] < 66 ? "😬 Nervous" : "😡 Aggressive";

  return (
    <div className="px-6 py-8 lg:px-10 max-w-3xl">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors tap-scale"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      {/* Scenario header */}
      <div className="mt-6 flex items-start gap-5">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-primary/10 text-5xl shadow-soft">
          {scenario.emoji}
        </div>
        <div>
          <h1 className="text-2xl font-extrabold lg:text-3xl">{scenario.title}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{scenario.description}</p>
        </div>
      </div>

      {/* Difficulty */}
      <h2 className="mt-10 text-xs font-bold uppercase tracking-widest text-muted-foreground">
        Difficulty
      </h2>
      <div className="mt-3 grid grid-cols-3 gap-3">
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
            <CardContent className="flex flex-col items-center gap-1.5 p-5">
              <span className="text-3xl">{d.emoji}</span>
              <span className="font-bold text-sm">{d.label}</span>
              <span className="text-[11px] text-muted-foreground">{d.desc}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Personality */}
      <h2 className="mt-8 text-xs font-bold uppercase tracking-widest text-muted-foreground">
        AI Personality
      </h2>
      <Card className="mt-3 shadow-soft border-border">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">Character mood</span>
            <span className="text-sm font-bold">{personalityLabel}</span>
          </div>
          <Slider value={personality} onValueChange={setPersonality} max={100} step={1} />
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>Calm</span>
            <span>Nervous</span>
            <span>Aggressive</span>
          </div>
        </CardContent>
      </Card>

      {/* Goal */}
      <h2 className="mt-8 text-xs font-bold uppercase tracking-widest text-muted-foreground">
        Your Goal
      </h2>
      <div className="mt-3 grid grid-cols-3 gap-3">
        {goals.map((g) => (
          <button
            key={g.label}
            onClick={() => setGoal(g.label)}
            className={`flex flex-col items-center gap-2 rounded-2xl border p-4 text-sm font-semibold transition-all duration-200 tap-scale ${
              goal === g.label
                ? "border-primary/40 bg-primary/10 text-primary shadow-sm"
                : "border-border bg-card text-muted-foreground hover:border-primary/20 hover:text-foreground"
            }`}
          >
            <span className="text-2xl">{g.emoji}</span>
            {g.label}
          </button>
        ))}
      </div>

      {/* Start */}
      <Button
        className="mt-10 w-full rounded-2xl py-6 text-base font-extrabold shadow-glow tap-scale gradient-primary hover:opacity-90 border-none"
        onClick={() => navigate("/simulation", { state: { scenarioId: scenario.id, difficulty, personality: personality[0], goal } })}
      >
        <Play className="h-5 w-5 mr-2" />
        Start Simulation
      </Button>
    </div>
  );
};

export default Setup;
