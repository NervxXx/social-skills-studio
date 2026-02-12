import { useLocation, useNavigate } from "react-router-dom";
import { Home, Compass, BarChart3, User, Settings } from "lucide-react";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/explore", label: "Explore", icon: Compass },
  { path: "/stats", label: "Stats", icon: BarChart3 },
  { path: "/profile", label: "Profile", icon: User },
  { path: "/settings", label: "Settings", icon: Settings },
];

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide bottom nav on simulation page
  const hideNav = location.pathname === "/simulation";

  return (
    <div className="min-h-screen bg-background pb-20">
      <main>{children}</main>

      {!hideNav && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card px-2 py-1 safe-area-pb">
          <div className="mx-auto flex max-w-lg items-center justify-around">
            {navItems.map(({ path, label, icon: Icon }) => {
              const active = location.pathname === path;
              return (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className={`flex flex-col items-center gap-0.5 rounded-xl px-3 py-2 text-xs transition-colors tap-scale ${
                    active
                      ? "text-primary font-semibold"
                      : "text-muted-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" fill={active ? "currentColor" : "none"} />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
};

export default Layout;
