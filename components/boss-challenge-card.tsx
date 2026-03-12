import Link from "next/link";
import { Flame, Shield, Skull, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BossChallengeData, TrainingRecord } from "@/lib/types";

export function BossChallengeCard({
  challenge,
  personalBest,
  cleared = false
}: {
  challenge: BossChallengeData;
  personalBest?: TrainingRecord;
  cleared?: boolean;
}) {
  return (
    <Card
      className="flex h-full flex-col overflow-hidden border-sky-400/30 text-white shadow-[0_24px_60px_rgba(8,15,35,0.38)] backdrop-blur-none"
      style={{
        background:
          "linear-gradient(180deg, rgba(6,18,43,0.96) 0%, rgba(13,34,74,0.94) 100%)"
      }}
    >
      <CardHeader>
        <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-sky-100">
          <Skull className="h-3.5 w-3.5" />
          Boss challenge
        </div>
        <CardTitle className="text-white">{challenge.title}</CardTitle>
        <div className="text-sm text-sky-100/75">
          {cleared ? "已击败，可继续冲更高分" : `${challenge.bossName} 等你挑战`}
        </div>
      </CardHeader>
      <CardContent className="flex h-full flex-col space-y-4">
        <p className="text-sm leading-7 text-sky-100/85">{challenge.description}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-[20px] bg-white/10 p-4">
            <div className="flex items-center gap-2 text-xs text-sky-100/70">
              <Trophy className="h-3.5 w-3.5" />
              奖励
            </div>
            <div className="mt-2 font-semibold">{challenge.reward}</div>
            <div className="mt-1 text-xs text-sky-100/70">{challenge.badgeReward}</div>
          </div>
          <div className="rounded-[20px] bg-white/10 p-4">
            <div className="flex items-center gap-2 text-xs text-sky-100/70">
              <Shield className="h-3.5 w-3.5" />
              赛季加成
            </div>
            <div className="mt-2 font-semibold">+{challenge.seasonRewardPoints} 赛季分基准</div>
            <div className="mt-1 text-xs text-sky-100/70">{challenge.goal}</div>
          </div>
        </div>
        <div className="rounded-[20px] bg-white/10 p-4 text-sm text-sky-100/80">
          <div className="text-xs uppercase tracking-[0.16em] text-sky-100/60">你的最佳成绩</div>
          <div className="mt-2 font-semibold text-white">
            {personalBest
              ? `${personalBest.wpm} WPM · ${personalBest.accuracy}% · ${personalBest.duration}s`
              : "还没有 Boss 记录"}
          </div>
          <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs">
            <Flame className="h-3.5 w-3.5" />
            难度 {challenge.difficulty.toUpperCase()}
          </div>
        </div>
        <Link href={`/trainer?boss=${challenge.id}`} className="mt-auto block">
          <Button className="w-full bg-white text-sky-950 hover:bg-sky-50">挑战 Boss</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
