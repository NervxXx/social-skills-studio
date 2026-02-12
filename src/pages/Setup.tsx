import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { scenarios } from "@/lib/data";

const difficultyLevels = [
  { value: "calm", label: "Calm", emoji: "😊" },
  { value: "normal", label: "Normal", emoji: "😐" },
  { value: "challenging", label: "Challenging", emoji: "😰" },
];

const goals = ["De-escalate", "Show empathy", "Get agreement"];

const Setup = () => {
  const { scenarioId } = useParams();
  const navigate = useNavigate();
  const scenario = scenarios.find((s) => s.id === scenarioId) || scenarios[0];

  const [difficulty, setDifficulty] = useState("normal");
  const [personality, setPersonality] = useState([50]);
  const [goal, setGoal] = useState(goals[0]);

  const personalityLabel =
    personality[0] < 33 ? "Calm" : personality[0] < 66 ? "Nervous" : "Aggressive";

  return (
    <div className="mx-auto max-w-lg px-4 pt-6">
      <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-1 text-sm text-muted-foreground tap-scale">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="text-center">
        <span className="text-5xl">{scenario.emoji}</span>
        <h1 className="mt-3 text-2xl font-bold">{scenario.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{scenario.description}</p>
      </div>

      {/* Difficulty */}
      <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Difficulty
      </h2>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {difficultyLevels.map((d) => (
          <Card
            key={d.value}
            onClick={() => setDifficulty(d.value)}
            className={`cursor-pointer text-center shadow-sm transition-all tap-scale ${
              difficulty === d.value
                ? "border-primary bg-primary/5 ring-2 ring-primary/30"
                : "hover:border-primary/30"
            }`}
          >
            <CardContent className="flex flex-col items-center gap-1 p-4">
              <span className="text-2xl">{d.emoji}</span>
              <span className="text-sm font-medium">{d.label}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Personality */}
      <h2 className="mt-6 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        AI Personality — <span className="text-foreground">{personalityLabel}</span>
      </h2>
      <div className="mt-3 px-1">
        <Slider value={personality} onValueChange={setPersonality} max={100} step={1} />
        <div className="mt-1 flex justify-between text-xs text-muted-foreground">
          <span>Calm</span>
          <span>Nervous</span>
          <span>Aggressive</span>
        </div>
      </div>

      {/* Goal */}
      <h2 className="mt-6 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Your Goal
      </h2>
      <div className="mt-2 flex flex-wrap gap-2">
        {goals.map((g) => (
          <button
            key={g}
            onClick={() => setGoal(g)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all tap-scale ${
              goal === g
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-primary/10"
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Start */}
      <Button
        className="mt-8 w-full rounded-full py-6 text-base font-bold tap-scale"
        onClick={() => navigate("/simulation", { state: { scenarioId: scenario.id, difficulty, personality: personality[0], goal } })}
      >
        Start Simulation
      </Button>
    </div>
  );
};

export default Setup;
