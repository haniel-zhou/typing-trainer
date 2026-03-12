"use client";

import { useEffect, useMemo, useState } from "react";
import { Globe2, Languages, LogOut, Mail, Phone, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLocale } from "@/components/locale-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LOCALE_META, getDirection } from "@/lib/i18n";
import { clearAuthSession, loadAuthSession, loadFriendProfile, saveAuthSession, saveFriendProfile } from "@/lib/storage";
import { AuthMethod, AuthSession, SupportedLocale } from "@/lib/types";

type AuthMode = "login" | "register";
type ContactMode = "email" | "phone";

function buildDisplayName(contact: string) {
  if (contact.includes("@")) return contact.split("@")[0];
  return `user-${contact.slice(-4) || "0001"}`;
}

function createSession(
  method: AuthMethod,
  name: string,
  contact: string,
  preferredLanguage: SupportedLocale,
  inputLanguage: SupportedLocale
): AuthSession {
  return {
    id: `${method}-${Date.now()}`,
    name,
    contact,
    method,
    preferredLanguage,
    inputLanguage,
    createdAt: new Date().toISOString()
  };
}

export function AuthGateway() {
  const router = useRouter();
  const { locale, inputLanguage, recommendedLanguage, setInputLanguage, setLocale, t } = useLocale();
  const [mode, setMode] = useState<AuthMode>("login");
  const [contactMode, setContactMode] = useState<ContactMode>("email");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [hint, setHint] = useState("");
  const [session, setSession] = useState<AuthSession | null>(null);
  const [localInterfaceLanguage, setLocalInterfaceLanguage] = useState(locale);
  const [localInputLanguage, setLocalInputLanguage] = useState(inputLanguage);

  useEffect(() => {
    setSession(loadAuthSession());
  }, []);

  useEffect(() => {
    setLocalInterfaceLanguage(locale);
    setLocalInputLanguage(inputLanguage);
  }, [inputLanguage, locale]);

  const recommendedLabel = useMemo(
    () => LOCALE_META[recommendedLanguage].nativeLabel,
    [recommendedLanguage]
  );

  function persistSession(nextSession: AuthSession) {
    saveAuthSession(nextSession);
    setSession(nextSession);

    const profile = loadFriendProfile();
    saveFriendProfile({
      ...profile,
      name: nextSession.name,
      updatedAt: new Date().toISOString()
    });

    window.dispatchEvent(new Event("auth-session-changed"));
    setHint(t("auth.success"));
    router.push("/");
  }

  function applyLanguagePreferences() {
    setLocale(localInterfaceLanguage);
    setInputLanguage(localInputLanguage);
    document.documentElement.lang = localInterfaceLanguage;
    document.documentElement.dir = getDirection(localInterfaceLanguage);
  }

  function handleSubmit() {
    const trimmedContact = contact.trim();
    const trimmedName = name.trim();

    if (!trimmedContact) {
      setHint(contactMode === "email" ? t("auth.emailPlaceholder") : t("auth.phonePlaceholder"));
      return;
    }

    applyLanguagePreferences();

    const nextName =
      mode === "register"
        ? trimmedName || buildDisplayName(trimmedContact)
        : session?.name || trimmedName || buildDisplayName(trimmedContact);

    const nextSession = createSession(
      contactMode,
      nextName,
      trimmedContact,
      localInterfaceLanguage,
      localInputLanguage
    );
    persistSession(nextSession);
  }

  function handleSocialLogin(method: AuthMethod) {
    applyLanguagePreferences();
    const nextSession = createSession(
      method,
      `${method.charAt(0).toUpperCase()}${method.slice(1)} User`,
      method,
      localInterfaceLanguage,
      localInputLanguage
    );
    persistSession(nextSession);
  }

  function handleGuestEntry() {
    applyLanguagePreferences();
    const nextSession = createSession(
      "guest",
      name.trim() || "Guest",
      "guest",
      localInterfaceLanguage,
      localInputLanguage
    );
    persistSession(nextSession);
  }

  function handleSignOut() {
    clearAuthSession();
    setSession(null);
    window.dispatchEvent(new Event("auth-session-changed"));
    setHint("");
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <Card className="overflow-hidden">
        <CardHeader>
          <div className="inline-flex items-center gap-2 rounded-full bg-sky-100/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
            <Globe2 className="h-3.5 w-3.5" />
            {t("auth.eyebrow")}
          </div>
          <CardTitle className="mt-3 text-3xl md:text-4xl">{t("auth.title")}</CardTitle>
          <p className="text-sm leading-7 text-sky-800/80">{t("auth.description")}</p>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex flex-wrap gap-2">
            {[
              { id: "login", label: t("auth.loginTab") },
              { id: "register", label: t("auth.registerTab") }
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setMode(item.id as AuthMode)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  mode === item.id ? "bg-sky-600 text-white" : "bg-sky-50 text-sky-700"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="space-y-4 rounded-[24px] border border-sky-100 bg-sky-50/80 p-4">
            <div>
              <div className="text-sm font-semibold text-sky-950">{t("auth.preferencesTitle")}</div>
              <div className="mt-1 text-sm leading-7 text-sky-700/80">{t("auth.preferencesDescription")}</div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <LanguageSwitcher
                value={localInterfaceLanguage}
                onChange={(value) => setLocalInterfaceLanguage(value)}
              />
              <label className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white/90 px-4 py-2 text-sm text-sky-700">
                <Languages className="h-4 w-4" />
                <span className="font-semibold">{t("auth.inputLanguage")}</span>
                <select
                  value={localInputLanguage}
                  onChange={(event) => setLocalInputLanguage(event.target.value as SupportedLocale)}
                  className="rounded-full bg-transparent text-sky-950 outline-none"
                >
                  {Object.entries(LOCALE_META).map(([code, meta]) => (
                    <option key={code} value={code}>
                      {meta.nativeLabel}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="rounded-[20px] bg-white/85 p-4 text-sm leading-7 text-sky-800/80">
              <div className="font-semibold text-sky-950">
                {t("auth.detectedLanguage")} · {recommendedLabel}
              </div>
              <div className="mt-1">{t("auth.detectedHint")}</div>
              <div className="mt-2 text-xs text-sky-600/80">{t("auth.note")}</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { id: "email", label: t("auth.email"), icon: Mail },
              { id: "phone", label: t("auth.phone"), icon: Phone }
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setContactMode(item.id as ContactMode)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  contactMode === item.id ? "bg-sky-950 text-white" : "bg-white text-sky-700"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </div>

          {mode === "register" ? (
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={t("auth.namePlaceholder")}
            />
          ) : null}

          <Input
            value={contact}
            onChange={(event) => setContact(event.target.value)}
            placeholder={contactMode === "email" ? t("auth.emailPlaceholder") : t("auth.phonePlaceholder")}
            dir={localInputLanguage === "ar" ? "rtl" : "ltr"}
            lang={localInputLanguage}
          />
          <Input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={t("auth.passwordPlaceholder")}
            type="password"
          />

          <div className="flex flex-wrap gap-3">
            <Button onClick={handleSubmit}>
              {mode === "login" ? t("auth.loginAction") : t("auth.registerAction")}
            </Button>
            <Button variant="outline" onClick={handleGuestEntry}>
              {t("auth.guestAction")}
            </Button>
          </div>
          {hint ? <p className="text-sm leading-7 text-emerald-700">{hint}</p> : null}
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("auth.socialTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-7 text-sky-800/80">{t("auth.socialDescription")}</p>
            <div className="grid gap-3">
              <Button variant="outline" className="justify-start gap-3" onClick={() => handleSocialLogin("google")}>
                <ShieldCheck className="h-4 w-4" />
                {t("auth.socialGoogle")}
              </Button>
              <Button variant="outline" className="justify-start gap-3" onClick={() => handleSocialLogin("facebook")}>
                <ShieldCheck className="h-4 w-4" />
                {t("auth.socialFacebook")}
              </Button>
              <Button variant="outline" className="justify-start gap-3" onClick={() => handleSocialLogin("apple")}>
                <ShieldCheck className="h-4 w-4" />
                {t("auth.socialApple")}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("auth.currentSession")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {session ? (
              <>
                <div className="rounded-[22px] bg-sky-50/90 p-4 text-sm leading-7 text-sky-800/80">
                  <div className="font-semibold text-sky-950">{session.name}</div>
                  <div>{session.method}</div>
                  <div>{session.contact}</div>
                  <div>{LOCALE_META[session.preferredLanguage].nativeLabel}</div>
                </div>
                <Button variant="outline" onClick={handleSignOut} className="gap-2">
                  <LogOut className="h-4 w-4" />
                  {t("auth.signOut")}
                </Button>
              </>
            ) : (
              <div className="rounded-[22px] bg-slate-50 p-4 text-sm leading-7 text-sky-800/80">
                {t("auth.guestAction")}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
