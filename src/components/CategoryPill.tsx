interface CategoryPillProps {
  emoji: string;
  name: string;
  active?: boolean;
  onClick?: () => void;
}

const CategoryPill = ({ emoji, name, active, onClick }: CategoryPillProps) => (
  <button
    onClick={onClick}
    className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all tap-scale hover-lift ${
      active
        ? "border-primary bg-primary/10 text-primary"
        : "border-border bg-card text-foreground hover:bg-primary/5"
    }`}
  >
    <span>{emoji}</span>
    <span>{name}</span>
  </button>
);

export default CategoryPill;
