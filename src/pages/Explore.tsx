import { useState } from "react";
import { Search } from "lucide-react";
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
    <div className="mx-auto max-w-2xl px-4 pt-6">
      <h1 className="text-2xl font-bold">Explore Scenarios</h1>

      {/* Search */}
      <div className="relative mt-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search scenarios..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-full pl-10"
        />
      </div>

      {/* Category filters */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
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
      <div className="mt-2 flex gap-2">
        {difficulties.map((d) => (
          <button
            key={d}
            onClick={() => setActiveDifficulty(d)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors tap-scale ${
              activeDifficulty === d
                ? "bg-secondary text-secondary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="mt-5 grid grid-cols-2 gap-3 pb-6 md:grid-cols-4">
        {filtered.map((s) => (
          <ScenarioCard key={s.id} scenario={s} />
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full py-12 text-center text-muted-foreground">
            No scenarios match your filters.
          </p>
        )}
      </div>
    </div>
  );
};

export default Explore;
