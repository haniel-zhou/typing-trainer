"use client";

import { Shield, Sword, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getSeasonProgress } from "@/lib/typing";

export function SeasonRankPanel({
  seasonPoints,
  challengeWins,
  duelWins
}: {
  seasonPoints: number;
  challengeWins: number;
  duelWins: number;
}) {
  const season = getSeasonProgress(seasonPoints);

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-sky-500" />
          赛季段位
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={`rounded-[24px] bg-gradient-to-br ${season.current.accent} p-5 text-white shadow-lg`}>
          <div className="text-sm uppercase tracking-[0.18em] text-white/80">当前段位</div>
          <div className="mt-2 font-display text-4xl">{season.current.title}</div>
          <p className="mt-3 text-sm leading-7 text-white/85">{season.current.summary}</p>
        </div>

        <div className="rounded-[24px] bg-white/80 p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between text-sm text-sky-700/80">
            <span>赛季积分</span>
            <span>{seasonPoints} 分</span>
          </div>
          <Progress value={season.progress} />
          <div className="mt-3 text-sm text-sky-800/80">
            {season.next ? `距离 ${season.next.title} 还差 ${season.pointsToNext} 分` : "当前已达最高段位"}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-[22px] bg-sky-50/90 p-4">
            <div className="flex items-center gap-2 text-sm text-sky-600/75">
              <Trophy className="h-4 w-4" />
              挑战胜场
            </div>
            <div className="mt-2 font-display text-3xl text-sky-950">{challengeWins}</div>
          </div>
          <div className="rounded-[22px] bg-sky-50/90 p-4">
            <div className="flex items-center gap-2 text-sm text-sky-600/75">
              <Sword className="h-4 w-4" />
              对战胜场
            </div>
            <div className="mt-2 font-display text-3xl text-sky-950">{duelWins}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
