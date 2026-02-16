import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ThemeProvider } from "@/hooks/use-theme";
import { I18nProvider } from "@/hooks/use-i18n";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import Index from "./pages/Index";
import Explore from "./pages/Explore";
import Setup from "./pages/Setup";
import Simulation from "./pages/Simulation";
import Feedback from "./pages/Feedback";
import Profile from "./pages/Profile";
import Stats from "./pages/Stats";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <I18nProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Layout>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/explore" element={<Explore />} />
                  <Route path="/setup/:scenarioId" element={<Setup />} />
                  <Route path="/simulation" element={<Simulation />} />
                  <Route path="/feedback" element={<Feedback />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/stats" element={<Stats />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
