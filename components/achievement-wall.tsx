"use client";

import { Award, Lock, ShieldCheck, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AchievementBadge } from "@/lib/types";

function getTierTone(tier: AchievementBadge["tier"]) {
  if (tier === "gold") return "from-amber-500 to-yellow-400 text-white";
  if (tier === "silver") return "from-slate-500 to-slate-300 text-white";
  return "from-orange-500 to-amber-400 text-white";
}

export function AchievementWall({ badges }: { badges: AchievementBadge[] }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-sky-500" />
          成就墙
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {badges.map((badge) => (
          <div key={badge.id} className="rounded-[24px] border border-sky-100 bg-white/80 p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-lg font-semibold text-sky-950">{badge.title}</div>
                <div className="mt-1 text-sm text-sky-700/80">{badge.description}</div>
              </div>
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${getTierTone(
                  badge.tier
                )} shadow-lg`}
              >
                {badge.unlocked ? <ShieldCheck className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
              </div>
            </div>
            <div className="mt-4 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
              {badge.tier.toUpperCase()} · {badge.metricLabel}
            </div>
            <div className="mt-4">
              <Progress value={Math.round((badge.progress / badge.goal) * 100)} />
            </div>
            <div className="mt-3 flex items-center justify-between text-sm text-sky-800/80">
              <span>
                {badge.progress}/{badge.goal}
              </span>
              <span className="inline-flex items-center gap-1">
                <Star className="h-4 w-4 text-amber-500" />
                {badge.unlocked ? "已解锁" : "进行中"}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
