import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, Compass, BarChart3, User, Settings, Sparkles, Menu, X, LogOut } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useI18n } from "@/hooks/use-i18n";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
  const { user, isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const hideNav = location.pathname === "/simulation";
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  if (hideNav) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  const goTo = (path: string) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky header */}
      <header className="fixed top-0 left-0 right-0 z-50 h-[var(--header-height)] border-b border-border glass">
        <div className="mx-auto flex h-full max-w-4xl items-center justify-between px-5 sm:px-8 lg:px-10">
          {/* Logo */}
          <button onClick={() => goTo("/")} className="flex items-center gap-2.5 tap-scale">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary shadow-glow">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-base font-extrabold text-foreground leading-none tracking-tight">SocialSim</h1>
              <p className="text-[10px] text-muted-foreground leading-none mt-0.5">{t("nav.subtitle")}</p>
            </div>
          </button>

          {/* Desktop nav */}
          {!isMobile && (
            <nav className="flex items-center gap-1">
              {navKeys.map(({ path, key, icon: Icon }) => {
                const active = location.pathname === path;
                return (
                  <button
                    key={path}
                    onClick={() => goTo(path)}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 tap-scale ${
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" strokeWidth={active ? 2.2 : 1.8} />
                    <span>{t(key)}</span>
                  </button>
                );
              })}
              {!isAuthPage && (
                isAuthenticated && user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground tap-scale">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/20 text-primary text-xs">
                            {(user.full_name || user.email || "?")[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="max-w-24 truncate hidden sm:inline">{user.full_name || user.email}</span>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => navigate("/profile")}>
                        <User className="mr-2 h-4 w-4" />
                        {t("nav.profile")}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { logout(); navigate("/"); }}>
                        <LogOut className="mr-2 h-4 w-4" />
                        {t("nav.logout")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="rounded-xl" onClick={() => navigate("/login")}>
                      {t("nav.login")}
                    </Button>
                    <Button size="sm" className="rounded-xl" onClick={() => navigate("/register")}>
                      {t("nav.register")}
                    </Button>
                  </div>
                )
              )}
            </nav>
          )}

          {/* Mobile burger */}
          {isMobile && (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-xl p-2.5 text-foreground tap-scale hover:bg-muted transition-colors"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          )}
        </div>
      </header>

      {/* Mobile overlay menu */}
      {isMobile && menuOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <div className="fixed top-[var(--header-height)] left-0 right-0 z-50 border-b border-border bg-card shadow-lg animate-fade-in">
            <nav className="mx-auto max-w-4xl px-5 py-3 space-y-1">
              {navKeys.map(({ path, key, icon: Icon }) => {
                const active = location.pathname === path;
                return (
                  <button
                    key={path}
                    onClick={() => goTo(path)}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-200 tap-scale ${
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5" strokeWidth={active ? 2.2 : 1.8} />
                    <span className="text-base">{t(key)}</span>
                  </button>
                );
              })}
              {!isAuthPage && (
                isAuthenticated && user ? (
                  <button
                    onClick={() => { logout(); goTo("/"); }}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground tap-scale"
                  >
                    <LogOut className="h-5 w-5" />
                    {t("nav.logout")}
                  </button>
                ) : (
                  <div className="flex gap-2 px-4 pt-2">
                    <Button variant="outline" size="sm" className="flex-1 rounded-xl" onClick={() => goTo("/login")}>
                      {t("nav.login")}
                    </Button>
                    <Button size="sm" className="flex-1 rounded-xl" onClick={() => goTo("/register")}>
                      {t("nav.register")}
                    </Button>
                  </div>
                )
              )}
            </nav>
          </div>
        </>
      )}

      {/* Main content */}
      <main className="animate-fade-in">{children}</main>
    </div>
  );
};

export default Layout;
