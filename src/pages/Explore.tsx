import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import CategoryPill from "@/components/CategoryPill";
import ScenarioCard from "@/components/ScenarioCard";
import { categories, scenarios } from "@/lib/data";

const difficulties = ["All", "Easy", "Medium", "Hard"] as const;

const Explore = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeDifficulty, setActiveDifficulty] = useState<string>("All");

  const filtered = scenarios.filter((s) => {
    if (search && !s.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (activeCategory && s.category !== activeCategory) return false;
    if (activeDifficulty !== "All" && s.difficulty !== activeDifficulty.toLowerCase()) return false;
    return true;
  });

  return (
    <div className="px-6 py-8 lg:px-10 max-w-5xl">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Find your next challenge</p>
          <h1 className="text-2xl font-extrabold lg:text-3xl">Explore Scenarios</h1>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <SlidersHorizontal className="h-4 w-4" />
          <span className="text-sm font-medium">{filtered.length} scenarios</span>
        </div>
      </div>

      {/* Search */}
      <div className="relative mt-6">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search scenarios..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-12 rounded-2xl bg-card pl-11 text-sm shadow-soft border-border focus-visible:ring-primary/30"
        />
      </div>

      {/* Category filters */}
      <div className="mt-5 flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        <CategoryPill
          emoji="✨"
          name="All"
          active={!activeCategory}
          onClick={() => setActiveCategory(null)}
        />
        {categories.map((c) => (
          <CategoryPill
            key={c.id}
            emoji={c.emoji}
            name={c.name}
            active={activeCategory === c.id}
            onClick={() => setActiveCategory(activeCategory === c.id ? null : c.id)}
          />
        ))}
      </div>

      {/* Difficulty filters */}
      <div className="mt-3 flex gap-2">
        {difficulties.map((d) => (
          <button
            key={d}
            onClick={() => setActiveDifficulty(d)}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200 tap-scale ${
              activeDifficulty === d
                ? "gradient-secondary text-secondary-foreground shadow-sm"
                : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/20"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 pb-6">
        {filtered.map((s) => (
          <ScenarioCard key={s.id} scenario={s} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full flex flex-col items-center py-20">
            <span className="text-5xl">🔍</span>
            <p className="mt-3 text-lg font-semibold text-foreground">No scenarios found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
