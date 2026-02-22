import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Settings, Edit, Trophy, Target, Flame, Brain, ChevronDown, ChevronUp } from "lucide-react";
import { achievements, type Achievement, type AchievementTier } from "@/lib/data";
import { useI18n } from "@/hooks/use-i18n";
import { useAuth } from "@/contexts/AuthContext";
import { profilesApi, statsApi, type ProfileResponse, type PersonalityProfile } from "@/lib/api";

const TIER_CONFIG: Record<AchievementTier, { color: string; bg: string; border: string; label: string }> = {
  bronze: { color: "text-amber-700", bg: "bg-amber-50 dark:bg-amber-950/30", border: "border-amber-300/40", label: "🥉" },
  silver: { color: "text-slate-500", bg: "bg-slate-50 dark:bg-slate-900/30", border: "border-slate-300/40", label: "🥈" },
  gold: { color: "text-yellow-600", bg: "bg-yellow-50 dark:bg-yellow-950/30", border: "border-yellow-400/40", label: "🥇" },
  diamond: { color: "text-cyan-500", bg: "bg-cyan-50 dark:bg-cyan-950/30", border: "border-cyan-300/50", label: "💎" },
};

const TRAIT_KEYS = [
  "empathy_orientation",
  "assertiveness_drive",
  "composure_index",
  "clarity_precision",
  "adaptability",
  "persistence",
] as const;

function TraitRadar({ traits }: { traits: Record<string, number> }) {
  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  const r = 80;
  const levels = [20, 40, 60, 80, 100];
  const n = TRAIT_KEYS.length;

  function pointOnAxis(i: number, value: number): [number, number] {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const dist = (value / 100) * r;
    return [cx + dist * Math.cos(angle), cy + dist * Math.sin(angle)];
  }

  const polygon = TRAIT_KEYS.map((k, i) => pointOnAxis(i, traits[k] || 0));
  const polygonStr = polygon.map((p) => p.join(",")).join(" ");

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[220px] mx-auto">
      {levels.map((lv) => (
        <polygon
          key={lv}
          points={Array.from({ length: n }, (_, i) => pointOnAxis(i, lv).join(",")).join(" ")}
          fill="none"
          stroke="currentColor"
          className="text-border"
          strokeWidth={lv === 100 ? 1.5 : 0.5}
        />
      ))}
      {TRAIT_KEYS.map((_, i) => {
        const [ex, ey] = pointOnAxis(i, 100);
        return <line key={i} x1={cx} y1={cy} x2={ex} y2={ey} stroke="currentColor" className="text-border" strokeWidth={0.5} />;
      })}
      <polygon points={polygonStr} fill="hsl(var(--primary) / 0.15)" stroke="hsl(var(--primary))" strokeWidth={2} />
      {polygon.map(([px, py], i) => (
        <circle key={i} cx={px} cy={py} r={3} fill="hsl(var(--primary))" />
      ))}
    </svg>
  );
}

const Profile = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [stats, setStats] = useState<{
    total_sessions: number;
    best_score: number;
    streak_days: number;
    skills: Record<string, number>;
    achievements: string[];
    personality: PersonalityProfile;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAllAch, setShowAllAch] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) { setLoading(false); return; }
    Promise.all([profilesApi.getMe(), statsApi.getMyStats()])
      .then(([p, s]) => { setProfile(p); setStats(s); })
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  const skills = [
    { key: "skill.empathy" as const, score: stats?.skills?.empathy ?? 0 },
    { key: "skill.clarity" as const, score: stats?.skills?.clarity ?? 0 },
    { key: "skill.emotionalControl" as const, score: stats?.skills?.emotional_control ?? 0 },
    { key: "skill.assertiveness" as const, score: stats?.skills?.assertiveness ?? 0 },
  ];

  const xpForLevel = (level: number) => level * 100;
  const xpInLevel = profile ? profile.xp % xpForLevel(profile.level) : 0;
  const xpNeeded = profile ? xpForLevel(profile.level) : 100;
  const xpPercent = profile ? Math.min(100, (xpInLevel / xpNeeded) * 100) : 0;

  const earnedSet = useMemo(() => new Set(stats?.achievements ?? []), [stats?.achievements]);
  const earnedCount = earnedSet.size;
  const totalCount = achievements.length;

  const groupedAchievements = useMemo(() => {
    const tiers: AchievementTier[] = ["diamond", "gold", "silver", "bronze"];
    const groups: { tier: AchievementTier; items: (Achievement & { unlocked: boolean })[] }[] = [];
    for (const tier of tiers) {
      const items = achievements
        .filter((a) => a.tier === tier)
        .map((a) => ({ ...a, unlocked: earnedSet.has(a.id) }))
        .sort((a, b) => (a.unlocked === b.unlocked ? 0 : a.unlocked ? -1 : 1));
      if (items.length > 0) groups.push({ tier, items });
    }
    return groups;
  }, [earnedSet]);

  const personality = stats?.personality;
  const archetype = personality?.archetype ?? "newcomer";

  if (!isAuthenticated) {
    return (
      <div className="page-container max-w-3xl flex flex-col items-center justify-center py-24">
        <p className="text-muted-foreground text-center">{t("auth.loginSubtitle")}</p>
        <div className="flex gap-3 mt-6">
          <Button onClick={() => navigate("/login")}>{t("nav.login")}</Button>
          <Button variant="outline" onClick={() => navigate("/register")}>{t("nav.register")}</Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="page-container max-w-3xl flex items-center justify-center py-24">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="page-container max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold lg:text-3xl">{t("nav.profile")}</h1>
        <Button variant="outline" size="sm" className="rounded-xl tap-scale" onClick={() => navigate("/settings")}>
          <Settings className="h-4 w-4 mr-1.5" /> {t("profile.settings")}
        </Button>
      </div>

      {/* ── Header card ── */}
      <Card className="mt-8 shadow-soft border-border overflow-hidden">
        <div className="gradient-primary h-20 sm:h-24" />
        <CardContent className="relative px-6 pb-6">
          <div className="flex flex-col items-center sm:flex-row sm:items-end gap-4 -mt-12 sm:-mt-10">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-card shadow-glow">
                <AvatarFallback className="bg-primary/20 text-primary text-3xl font-extrabold">
                  {(user?.full_name || user?.email || "?")[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-1 right-1 rounded-full bg-primary p-1.5 text-primary-foreground shadow-md tap-scale" onClick={() => navigate("/settings")}>
                <Edit className="h-3 w-3" />
              </button>
            </div>
            <div className="text-center sm:text-left sm:pb-1">
              <h2 className="text-xl font-extrabold">{profile?.display_name || user?.full_name || user?.email || "User"}</h2>
              <p className="text-sm text-muted-foreground mt-0.5">{t("home.level")} {profile?.level ?? 1} · {profile?.xp ?? 0} / {xpNeeded} XP</p>
              <Progress value={xpPercent} className="mt-2.5 h-2 w-48 rounded-full" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Quick stats ── */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        {[
          { labelKey: "home.sessions" as const, value: String(stats?.total_sessions ?? 0), icon: Target },
          { labelKey: "profile.streak" as const, value: String(stats?.streak_days ?? 0), icon: Flame, suffix: "🔥" },
          { labelKey: "profile.bestScore" as const, value: `${stats?.best_score ?? 0}%`, icon: Trophy },
        ].map((s) => (
          <Card key={s.labelKey} className="shadow-soft border-border">
            <CardContent className="flex flex-col items-center p-4 sm:p-5">
              <s.icon className="h-5 w-5 text-primary mb-2" />
              <span className="text-xl font-extrabold sm:text-2xl">{s.value}{s.suffix || ""}</span>
              <span className="text-[11px] text-muted-foreground mt-0.5">{t(s.labelKey)}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Communication Profile (Personality) ── */}
      <Card className="mt-6 shadow-soft border-border">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <Brain className="h-5 w-5 text-primary" />
            <h2 className="section-title !mt-0">{t("profile.personalityProfile" as any)}</h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 items-center">
            <TraitRadar traits={personality?.traits ?? {}} />

            <div className="flex-1 space-y-3 w-full">
              {TRAIT_KEYS.map((key) => {
                const value = personality?.traits?.[key] ?? 50;
                return (
                  <div key={key}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold">{t(`trait.${key}` as any)}</span>
                      <span className="font-bold text-primary">{value}</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${value}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-5 rounded-xl bg-muted/50 p-4 text-center">
            <p className="text-xs text-muted-foreground">{t("profile.yourArchetype" as any)}</p>
            <p className="text-lg font-extrabold mt-1">{t(`archetype.${archetype}` as any)}</p>
            <p className="text-xs text-muted-foreground mt-1">{t(`archetypeDesc.${archetype}` as any)}</p>
            {personality && personality.sessions_analyzed > 0 && (
              <p className="text-[10px] text-muted-foreground/60 mt-2">{personality.sessions_analyzed} {t("profile.sessionsAnalyzed" as any)}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="section-gap grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* ── Skills ── */}
        <Card className="shadow-soft border-border">
          <CardContent className="p-6">
            <h2 className="section-title">{t("profile.skillProgress")}</h2>
            <div className="mt-5 space-y-5">
              {skills.map((s) => (
                <div key={s.key}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-semibold">{t(s.key)}</span>
                    <span className="font-bold text-primary">{s.score}%</span>
                  </div>
                  <Progress value={s.score} className="h-2 rounded-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ── Achievements ── */}
        <Card className="shadow-soft border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-1">
              <h2 className="section-title !mt-0">{t("profile.achievements")}</h2>
              <span className="text-xs text-muted-foreground font-medium">{earnedCount}/{totalCount}</span>
            </div>
            <Progress value={(earnedCount / totalCount) * 100} className="h-1.5 rounded-full mb-5" />

            {groupedAchievements.map(({ tier, items }) => {
              const cfg = TIER_CONFIG[tier];
              const displayItems = showAllAch ? items : items.slice(0, 6);
              return (
                <div key={tier} className="mb-4 last:mb-0">
                  <p className={`text-[11px] font-bold uppercase tracking-wider mb-2 ${cfg.color}`}>
                    {cfg.label} {t(`tier.${tier}` as any)}
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {displayItems.map((a) => (
                      <div
                        key={a.id}
                        className={`flex flex-col items-center gap-1 rounded-xl border p-2.5 text-center transition-all ${
                          a.unlocked
                            ? `${cfg.bg} ${cfg.border} hover-lift`
                            : "opacity-30 grayscale border-border"
                        }`}
                        title={a.description}
                      >
                        <span className="text-xl">{a.emoji}</span>
                        <span className="text-[10px] font-semibold leading-tight">{t(`ach.${a.id}` as any)}</span>
                        {a.unlocked && <span className={`text-[9px] font-medium ${cfg.color}`}>{t("profile.unlocked")}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {totalCount > 18 && (
              <button
                onClick={() => setShowAllAch((v) => !v)}
                className="mt-3 flex items-center gap-1 mx-auto text-xs text-primary font-medium hover:underline"
              >
                {showAllAch ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                {showAllAch ? "Show less" : `Show all ${totalCount}`}
              </button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
