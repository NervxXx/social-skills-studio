import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import CategoryPill from "@/components/CategoryPill";
import ScenarioCard from "@/components/ScenarioCard";
import { categories, scenarios } from "@/lib/data";
import { useI18n } from "@/hooks/use-i18n";

const Explore = () => {
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeDifficulty, setActiveDifficulty] = useState<string>("all");

  const filtered = scenarios.filter((s) => {
    const title = t(`scenario.${s.id}.title` as any).toLowerCase();
    if (search && !title.includes(search.toLowerCase())) return false;
    if (activeCategory && s.category !== activeCategory) return false;
    if (activeDifficulty !== "all" && s.difficulty !== activeDifficulty) return false;
    return true;
  });

  const difficulties = ["all", "easy", "medium", "hard"] as const;

  return (
    <div className="page-container">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{t("explore.subtitle")}</p>
          <h1 className="text-2xl font-extrabold lg:text-3xl mt-0.5">{t("explore.title")}</h1>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <SlidersHorizontal className="h-4 w-4" />
          <span className="text-sm font-medium">{filtered.length} {t("explore.scenarios")}</span>
        </div>
      </div>

      <div className="relative mt-6">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t("explore.search")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-12 rounded-2xl bg-card pl-11 text-base sm:text-sm shadow-soft border-border focus-visible:ring-primary/30"
        />
      </div>

      <div className="mt-5 flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        <CategoryPill emoji="✨" name="All" translationKey="explore.all" active={!activeCategory} onClick={() => setActiveCategory(null)} />
        {categories.map((c) => (
          <CategoryPill
            key={c.id}
            emoji={c.emoji}
            name={c.name}
            translationKey={`cat.${c.id}`}
            active={activeCategory === c.id}
            onClick={() => setActiveCategory(activeCategory === c.id ? null : c.id)}
          />
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        {difficulties.map((d) => (
          <button
            key={d}
            onClick={() => setActiveDifficulty(d)}
            className={`rounded-xl px-4 py-2.5 text-xs font-semibold transition-all duration-200 tap-scale ${
              activeDifficulty === d
                ? "gradient-secondary text-secondary-foreground shadow-sm"
                : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/20"
            }`}
          >
            {t(`difficulty.${d}` as any)}
          </button>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 pb-8">
        {filtered.map((s) => (
          <ScenarioCard key={s.id} scenario={s} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full flex flex-col items-center py-24">
            <span className="text-5xl">🔍</span>
            <p className="mt-4 text-lg font-semibold text-foreground">{t("explore.noResults")}</p>
            <p className="text-sm text-muted-foreground mt-1">{t("explore.adjustFilters")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
