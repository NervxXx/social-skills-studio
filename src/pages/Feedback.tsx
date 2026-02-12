import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { scenarios } from "@/lib/data";

const skills = [
  { name: "Empathy", score: 82, color: "bg-primary" },
  { name: "Clarity", score: 75, color: "bg-secondary" },
  { name: "Emotional Control", score: 88, color: "bg-primary" },
  { name: "Assertiveness", score: 70, color: "bg-secondary" },
];

const positives = [
  '"I understand how you feel" — Great empathy signal',
  '"Let\'s find a solution together" — Collaborative tone',
];

const negatives = [
  '"You always do this" — Avoid generalizations',
  '"Whatever" — Dismissive language reduces trust',
];

const Feedback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const scenarioId = (location.state as any)?.scenarioId || "first-date";
  const scenario = scenarios.find((s) => s.id === scenarioId) || scenarios[0];
  const overallScore = 79;

  return (
    <div className="mx-auto max-w-lg px-4 pt-6 pb-8">
      <div className="text-center">
        <span className="text-5xl">{scenario.emoji}</span>
        <h1 className="mt-3 text-xl font-bold">{scenario.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Session Complete</p>
      </div>

      {/* Overall score */}
      <div className="mt-6 flex flex-col items-center">
        <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-primary bg-primary/10">
          <span className="text-4xl font-extrabold text-primary">{overallScore}%</span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">Overall Performance</p>
      </div>

      {/* Skills */}
      <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Skill Breakdown
      </h2>
      <div className="mt-3 space-y-3">
        {skills.map((s) => (
          <div key={s.name}>
            <div className="mb-1 flex justify-between text-sm">
              <span className="font-medium">{s.name}</span>
              <span className="text-muted-foreground">{s.score}%</span>
            </div>
            <Progress value={s.score} className="h-2.5 rounded-full" />
          </div>
        ))}
      </div>

      {/* Key phrases */}
      <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Key Phrases
      </h2>
      <div className="mt-3 space-y-2">
        {positives.map((p, i) => (
          <Card key={i} className="border-green-200 bg-green-50 shadow-sm">
            <CardContent className="p-3 text-sm text-green-800">✅ {p}</CardContent>
          </Card>
        ))}
        {negatives.map((n, i) => (
          <Card key={i} className="border-red-200 bg-red-50 shadow-sm">
            <CardContent className="p-3 text-sm text-red-800">⚠️ {n}</CardContent>
          </Card>
        ))}
      </div>

      {/* Tip */}
      <Card className="mt-6 border-secondary/30 bg-secondary/5 shadow-sm">
        <CardContent className="p-4 text-sm">
          <p className="font-semibold text-secondary">💡 Tip of the Day</p>
          <p className="mt-1 text-muted-foreground">
            Mirror the other person's emotions before offering solutions. People feel heard when you
            reflect their feelings first.
          </p>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="mt-6 flex gap-3">
        <Button
          variant="outline"
          className="flex-1 rounded-full tap-scale"
          onClick={() => navigate(`/setup/${scenarioId}`)}
        >
          Practice Again
        </Button>
        <Button
          className="flex-1 rounded-full tap-scale"
          onClick={() => navigate("/explore")}
        >
          Next Scenario
        </Button>
      </div>
    </div>
  );
};

export default Feedback;
