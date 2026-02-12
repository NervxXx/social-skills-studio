import { useLocation, useNavigate } from "react-router-dom";
import { Home, Compass, BarChart3, User, Settings, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useI18n } from "@/hooks/use-i18n";

const navKeys = [
  { path: "/", key: "nav.home" as const, icon: Home },
  { path: "/explore", key: "nav.explore" as const, icon: Compass },
  { path: "/stats", key: "nav.stats" as const, icon: BarChart3 },
  { path: "/profile", key: "nav.profile" as const, icon: User },
  { path: "/settings", key: "nav.settings" as const, icon: Settings },
];

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { t } = useI18n();

  const hideNav = location.pathname === "/simulation";

  if (hideNav) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  if (!isMobile) {
    return (
      <div className="flex min-h-screen bg-background">
        <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar">
          <div className="flex items-center gap-3 px-6 py-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-glow">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-foreground tracking-tight">SocialSim</h1>
              <p className="text-[11px] text-muted-foreground -mt-0.5">{t("nav.subtitle")}</p>
            </div>
          </div>

          <nav className="flex-1 px-3 py-2 space-y-1">
            {navKeys.map(({ path, key, icon: Icon }) => {
              const active = location.pathname === path;
              return (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 tap-scale ${
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                      : "text-sidebar-foreground hover:bg-muted/60 hover:text-foreground"
                  }`}
                >
                  <Icon className="h-[18px] w-[18px]" fill={active ? "currentColor" : "none"} strokeWidth={active ? 2 : 1.8} />
                  {t(key)}
                </button>
              );
            })}
          </nav>

          <div className="border-t border-sidebar-border p-4">
            <button
              onClick={() => navigate("/profile")}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-muted/60 tap-scale"
            >
              <Avatar className="h-9 w-9 border-2 border-primary/30">
                <AvatarFallback className="bg-primary/15 text-primary text-sm font-bold">AJ</AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="text-sm font-semibold text-foreground">Alex Johnson</p>
                <p className="text-xs text-muted-foreground">Level 4 · 320 XP</p>
              </div>
            </button>
          </div>
        </aside>

        <main className="ml-64 flex-1 min-h-screen">
          <div className="animate-fade-in">{children}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <main className="animate-fade-in">{children}</main>
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border glass px-2 py-1">
        <div className="mx-auto flex max-w-lg items-center justify-around">
          {navKeys.map(({ path, key, icon: Icon }) => {
            const active = location.pathname === path;
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`flex flex-col items-center gap-0.5 rounded-xl px-3 py-2 text-xs transition-colors tap-scale ${
                  active ? "text-primary font-semibold" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-5 w-5" fill={active ? "currentColor" : "none"} />
                <span>{t(key)}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
