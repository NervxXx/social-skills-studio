import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/hooks/use-i18n";

const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Заполните email и пароль");
      return;
    }
    try {
      await register(email.trim(), password, fullName.trim() || undefined);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка регистрации");
    }
  };

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
            <h1 className="text-xl font-extrabold">{t("auth.registerTitle")}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{t("auth.registerSubtitle")}</p>

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
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="fullName">{t("auth.fullName")}</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Alex"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1.5"
                  autoComplete="name"
                  disabled={isLoading}
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
                  autoComplete="new-password"
                  disabled={isLoading}
                />
                <p className="mt-1 text-xs text-muted-foreground">{t("auth.passwordHint")}</p>
              </div>
              <Button type="submit" className="w-full rounded-xl" disabled={isLoading}>
                {isLoading ? "..." : t("auth.register")}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              {t("auth.hasAccount")}{" "}
              <Link to="/login" className="font-semibold text-primary hover:underline">
                {t("auth.login")}
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
