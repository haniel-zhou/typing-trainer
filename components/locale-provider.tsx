"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { formatMessage, getDirection } from "@/lib/i18n";
import { loadUserPreferences, saveUserPreferences } from "@/lib/storage";
import { SupportedLocale, TextDirection, UserPreferences } from "@/lib/types";

type LocaleContextValue = {
  locale: SupportedLocale;
  inputLanguage: SupportedLocale;
  direction: TextDirection;
  recommendedLanguage: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  setInputLanguage: (locale: SupportedLocale) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>({
    interfaceLanguage: "zh-CN",
    inputLanguage: "zh-CN",
    direction: "ltr",
    recommendedLanguage: "zh-CN",
    autoDetected: true
  });

  useEffect(() => {
    setPreferences(loadUserPreferences());
  }, []);

  useEffect(() => {
    saveUserPreferences(preferences);
    document.documentElement.lang = preferences.interfaceLanguage;
    document.documentElement.dir = preferences.direction;
  }, [preferences]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale: preferences.interfaceLanguage,
      inputLanguage: preferences.inputLanguage,
      direction: preferences.direction,
      recommendedLanguage: preferences.recommendedLanguage,
      setLocale: (locale) =>
        setPreferences((prev) => ({
          ...prev,
          interfaceLanguage: locale,
          direction: getDirection(locale),
          autoDetected: false
        })),
      setInputLanguage: (locale) =>
        setPreferences((prev) => ({
          ...prev,
          inputLanguage: locale,
          autoDetected: false
        })),
      t: (key, replacements) => formatMessage(preferences.interfaceLanguage, key, replacements)
    }),
    [preferences]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return context;
}
