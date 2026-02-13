import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Volume2, Lightbulb, Moon, Bell, Globe, Trash2, LogOut, ChevronRight, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/hooks/use-theme";
import { useI18n, type Locale } from "@/hooks/use-i18n";

const Settings = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { t, locale, setLocale } = useI18n();
  const [voiceInput, setVoiceInput] = useState(false);
  const [showHints, setShowHints] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [hintFrequency, setHintFrequency] = useState([50]);
  const [showLangPicker, setShowLangPicker] = useState(false);

  const hintLabel = hintFrequency[0] < 33 ? t("settings.hintRarely") : hintFrequency[0] < 66 ? t("settings.hintSometimes") : t("settings.hintOften");

  const languages: { code: Locale; label: string; flag: string }[] = [
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "ru", label: "Русский", flag: "🇷🇺" },
  ];

  return (
    <div className="page-container max-w-2xl">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors tap-scale">
        <ArrowLeft className="h-4 w-4" /> {t("settings.back")}
      </button>

      <h1 className="mt-6 text-2xl font-extrabold lg:text-3xl">{t("settings.title")}</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">{t("settings.subtitle")}</p>

      <h2 className="section-gap section-title">{t("settings.simulation")}</h2>
      <Card className="mt-4 shadow-soft border-border overflow-hidden">
        <CardContent className="divide-y divide-border p-0">
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-primary/10 p-2.5"><Volume2 className="h-4 w-4 text-primary" /></div>
              <div>
                <p className="text-sm font-semibold">{t("settings.voiceInput")}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t("settings.voiceInputDesc")}</p>
              </div>
            </div>
            <Switch checked={voiceInput} onCheckedChange={setVoiceInput} />
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-secondary/10 p-2.5"><Lightbulb className="h-4 w-4 text-secondary" /></div>
              <div>
                <p className="text-sm font-semibold">{t("settings.showHints")}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t("settings.showHintsDesc")}</p>
              </div>
            </div>
            <Switch checked={showHints} onCheckedChange={setShowHints} />
          </div>
          {showHints && (
            <div className="px-5 py-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold">{t("settings.hintFrequency")}</p>
                <span className="text-xs font-bold text-primary rounded-full bg-primary/10 px-3 py-1">{hintLabel}</span>
              </div>
              <Slider value={hintFrequency} onValueChange={setHintFrequency} max={100} step={1} />
            </div>
          )}
        </CardContent>
      </Card>

      <h2 className="section-gap section-title">{t("settings.appearance")}</h2>
      <Card className="mt-4 shadow-soft border-border overflow-hidden">
        <CardContent className="divide-y divide-border p-0">
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-muted p-2.5"><Moon className="h-4 w-4 text-foreground" /></div>
              <div>
                <p className="text-sm font-semibold">{t("settings.darkMode")}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t("settings.darkModeDesc")}</p>
              </div>
            </div>
            <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
          </div>

          <div>
            <button
              className="flex w-full items-center justify-between px-5 py-4 tap-scale"
              onClick={() => setShowLangPicker(!showLangPicker)}
            >
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-accent p-2.5"><Globe className="h-4 w-4 text-accent-foreground" /></div>
                <div className="text-left">
                  <p className="text-sm font-semibold">{t("settings.language")}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {languages.find((l) => l.code === locale)?.flag} {languages.find((l) => l.code === locale)?.label}
                  </p>
                </div>
              </div>
              <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${showLangPicker ? "rotate-90" : ""}`} />
            </button>

            {showLangPicker && (
              <div className="border-t border-border px-5 py-3 animate-fade-in">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLocale(lang.code);
                      setShowLangPicker(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-sm font-medium transition-colors tap-scale ${
                      locale === lang.code ? "bg-primary/10 text-primary" : "hover:bg-muted text-foreground"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-lg">{lang.flag}</span>
                      {lang.label}
                    </span>
                    {locale === lang.code && <Check className="h-4 w-4 text-primary" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <h2 className="section-gap section-title">{t("settings.notifications")}</h2>
      <Card className="mt-4 shadow-soft border-border overflow-hidden">
        <CardContent className="p-0">
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-primary/10 p-2.5"><Bell className="h-4 w-4 text-primary" /></div>
              <div>
                <p className="text-sm font-semibold">{t("settings.dailyReminders")}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t("settings.dailyRemindersDesc")}</p>
              </div>
            </div>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </div>
        </CardContent>
      </Card>

      <h2 className="section-gap section-title">{t("settings.account")}</h2>
      <Card className="mt-4 shadow-soft border-border overflow-hidden">
        <CardContent className="divide-y divide-border p-0">
          <button className="flex w-full items-center justify-between px-5 py-4 tap-scale hover:bg-muted/40 transition-colors">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-muted p-2.5"><LogOut className="h-4 w-4 text-muted-foreground" /></div>
              <p className="text-sm font-semibold">{t("settings.signOut")}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
          <button className="flex w-full items-center justify-between px-5 py-4 tap-scale hover:bg-destructive/5 transition-colors">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-destructive/10 p-2.5"><Trash2 className="h-4 w-4 text-destructive" /></div>
              <p className="text-sm font-semibold text-destructive">{t("settings.deleteAccount")}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        </CardContent>
      </Card>

      <p className="mt-12 pb-8 text-center text-xs text-muted-foreground">SocialSim v1.0 · Made with 💕</p>
    </div>
  );
};

export default Settings;
