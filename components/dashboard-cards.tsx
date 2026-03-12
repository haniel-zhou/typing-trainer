"use client";

import { Flame, Rocket, Star, Trophy } from "lucide-react";
import { useLocale } from "@/components/locale-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type Props = {
  level: number;
  xp: number;
  streak: number;
  bestWpm: number;
  coins?: number;
};

export function DashboardCards({ level, xp, streak, bestWpm, coins = 0 }: Props) {
  const { t } = useLocale();
  const levelProgress = xp % 100;
  const items = [
    {
      label: t("dashboard.level"),
      value: `Lv.${level}`,
      hint: t("dashboard.levelHint", { value: level + 1, xp: 100 - levelProgress }),
      progress: levelProgress,
      icon: Rocket
    },
    {
      label: t("dashboard.xp"),
      value: `${xp}`,
      hint: t("dashboard.xpHint"),
      progress: Math.min(100, Math.round(((xp % 300) / 300) * 100)),
      icon: Star
    },
    {
      label: t("dashboard.streak"),
      value: `${streak} 天`,
      hint: streak >= 7 ? t("dashboard.streakHintGood") : t("dashboard.streakHintNormal"),
      progress: Math.min(100, streak * 12),
      icon: Flame
    },
    {
      label: t("dashboard.bestWpm"),
      value: `${bestWpm} WPM`,
      hint: bestWpm >= 30 ? t("dashboard.bestWpmHintFast") : t("dashboard.bestWpmHintNormal"),
      progress: Math.min(100, Math.round((bestWpm / 60) * 100)),
      icon: Trophy
    },
    {
      label: t("dashboard.coins"),
      value: `${coins}`,
      hint: t("dashboard.coinsHint"),
      progress: Math.min(100, Math.round((coins / 500) * 100)),
      icon: Star
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      {items.map((item) => (
        <Card key={item.label} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-sm text-sky-700/75">{item.label}</CardTitle>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 text-white shadow-lg">
                <item.icon className="h-5 w-5" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="font-display text-3xl font-bold text-sky-950">{item.value}</div>
            <Progress value={item.progress} />
            <p className="text-sm leading-6 text-sky-800/75">{item.hint}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
