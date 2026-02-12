import { useI18n } from "@/hooks/use-i18n";

interface CategoryPillProps {
  emoji: string;
  name: string;
  translationKey?: string;
  active?: boolean;
  onClick?: () => void;
}

const CategoryPill = ({ emoji, name, translationKey, active, onClick }: CategoryPillProps) => {
  const { t } = useI18n();
  const label = translationKey ? t(translationKey as any) : name;

  return (
    <button
      onClick={onClick}
      className={`flex shrink-0 items-center gap-2.5 rounded-2xl border px-5 py-2.5 text-sm font-semibold transition-all duration-200 tap-scale ${
        active
          ? "border-primary/40 bg-primary/10 text-primary shadow-sm"
          : "border-border bg-card text-foreground hover:border-primary/20 hover:bg-primary/5 hover:shadow-soft"
      }`}
    >
      <span className="text-lg">{emoji}</span>
      <span>{label}</span>
    </button>
  );
};

export default CategoryPill;
