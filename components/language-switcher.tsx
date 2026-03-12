"use client";

import { Languages } from "lucide-react";
import { LOCALE_META, SUPPORTED_LOCALES } from "@/lib/i18n";
import { SupportedLocale } from "@/lib/types";
import { useLocale } from "@/components/locale-provider";

export function LanguageSwitcher({
  compact = false,
  value,
  onChange
}: {
  compact?: boolean;
  value?: SupportedLocale;
  onChange?: (locale: SupportedLocale) => void;
}) {
  const { locale, setLocale, t } = useLocale();
  const currentValue = value ?? locale;

  return (
    <label
      className={
        compact
          ? "inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white/90 px-3 py-2 text-xs text-sky-700"
          : "inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white/90 px-4 py-2 text-sm text-sky-700"
      }
    >
      <Languages className="h-4 w-4" />
      <span className="font-semibold">{t("shell.language")}</span>
      <select
        value={currentValue}
        onChange={(event) => {
          const next = event.target.value as SupportedLocale;
          if (onChange) {
            onChange(next);
            return;
          }
          setLocale(next);
        }}
        className="rounded-full bg-transparent text-sky-950 outline-none"
      >
        {SUPPORTED_LOCALES.map((item) => (
          <option key={item} value={item}>
            {LOCALE_META[item].nativeLabel}
          </option>
        ))}
      </select>
    </label>
  );
}
