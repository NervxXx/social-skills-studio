import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RotateCcw, ArrowRight, CheckCircle2, AlertTriangle } from "lucide-react";
import { scenarios } from "@/lib/data";

const skills = [
  { name: "Empathy", score: 82 },
  { name: "Clarity", score: 75 },
  { name: "Emotional Control", score: 88 },
  { name: "Assertiveness", score: 70 },
];

const positives = [
  { phrase: '"I understand how you feel"', note: "Great empathy signal" },
  { phrase: '"Let\'s find a solution together"', note: "Collaborative tone" },
];

const negatives = [
  { phrase: '"You always do this"', note: "Avoid generalizations" },
  { phrase: '"Whatever"', note: "Dismissive language reduces trust" },
];

const Feedback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const scenarioId = (location.state as any)?.scenarioId || "first-date";
  const scenario = scenarios.find((s) => s.id === scenarioId) || scenarios[0];
  const overallScore = 79;

  return (
    <div className="px-6 py-8 lg:px-10 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-6">
        <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-3xl bg-primary/10 shadow-glow">
          <span className="text-5xl">{scenario.emoji}</span>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Session Complete ✨</p>
          <h1 className="text-2xl font-extrabold lg:text-3xl">{scenario.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here's how you did — keep practicing to improve!
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Score */}
        <Card className="shadow-soft border-border flex flex-col items-center justify-center">
          <CardContent className="flex flex-col items-center p-8">
            <div className="relative flex h-36 w-36 items-center justify-center">
              <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" strokeWidth="8" className="stroke-muted" />
                <circle
                  cx="60" cy="60" r="50" fill="none" strokeWidth="8"
                  strokeLinecap="round"
                  className="stroke-primary"
                  strokeDasharray={`${overallScore * 3.14} 314`}
                  style={{ transition: "stroke-dasharray 1s ease" }}
                />
              </svg>
              <span className="text-4xl font-extrabold text-primary">{overallScore}%</span>
            </div>
            <p className="mt-3 text-sm font-medium text-muted-foreground">Overall Score</p>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card className="shadow-soft border-border lg:col-span-2">
          <CardContent className="p-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Skill Breakdown
            </h2>
            <div className="mt-4 space-y-4">
              {skills.map((s) => (
                <div key={s.name}>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="font-semibold">{s.name}</span>
                    <span className="font-bold text-primary">{s.score}%</span>
                  </div>
                  <Progress value={s.score} className="h-2.5 rounded-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key phrases */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
            What went well
          </h2>
          {positives.map((p, i) => (
            <Card key={i} className="mb-2 border-success/20 bg-success/5 shadow-soft">
              <CardContent className="flex items-start gap-3 p-4">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-success mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{p.phrase}</p>
                  <p className="text-xs text-muted-foreground">{p.note}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
            Room to improve
          </h2>
          {negatives.map((n, i) => (
            <Card key={i} className="mb-2 border-warning/20 bg-warning/5 shadow-soft">
              <CardContent className="flex items-start gap-3 p-4">
                <AlertTriangle className="h-5 w-5 shrink-0 text-warning mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{n.phrase}</p>
                  <p className="text-xs text-muted-foreground">{n.note}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Tip */}
      <Card className="mt-6 shadow-soft border-secondary/20 bg-secondary/5">
        <CardContent className="flex items-start gap-4 p-5">
          <span className="text-2xl">💡</span>
          <div>
            <p className="font-bold text-foreground">Tip of the Day</p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Mirror the other person's emotions before offering solutions. People feel heard when you
              reflect their feelings first.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row pb-4">
        <Button
          variant="outline"
          className="flex-1 rounded-2xl py-5 font-bold tap-scale"
          onClick={() => navigate(`/setup/${scenarioId}`)}
        >
          <RotateCcw className="h-4 w-4 mr-2" /> Practice Again
        </Button>
        <Button
          className="flex-1 rounded-2xl py-5 font-bold shadow-glow tap-scale gradient-primary border-none"
          onClick={() => navigate("/explore")}
        >
          Next Scenario <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default Feedback;
