import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/hooks/use-i18n";

const Login = () => {
  const navigate = useNavigate();
  const { login, guestLogin } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Заполните все поля");
      return;
    }
    setIsSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка входа");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuest = async () => {
    setError("");
    setIsSubmitting(true);
    try {
      await guestLogin();
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formDisabled = isSubmitting;

  return (
    <div className="page-container flex min-h-[80vh] flex-col items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary shadow-glow">
            <Sparkles className="h-7 w-7 text-primary-foreground" />
          </div>
        </div>
        <Card className="border-border shadow-soft">
          <CardContent className="p-6 pt-6">
            <h1 className="text-xl font-extrabold">{t("auth.loginTitle")}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{t("auth.loginSubtitle")}</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {error && (
                <div className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </div>
              )}
              <div>
                <Label htmlFor="email">{t("auth.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5"
                  autoComplete="email"
                  disabled={formDisabled}
                />
              </div>
              <div>
                <Label htmlFor="password">{t("auth.password")}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1.5"
                  autoComplete="current-password"
                  disabled={formDisabled}
                />
              </div>
              <Button type="submit" className="w-full rounded-xl" disabled={formDisabled}>
                {formDisabled ? "..." : t("auth.login")}
              </Button>
            </form>

            <div className="mt-6">
              <Button
                type="button"
                variant="outline"
                className="w-full rounded-xl"
                onClick={handleGuest}
                disabled={formDisabled}
              >
                {t("auth.guest")}
              </Button>
            </div>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              {t("auth.noAccount")}{" "}
              <Link to="/register" className="font-semibold text-primary hover:underline">
                {t("auth.register")}
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
