"use client";

import Link from "next/link";
import { Crown, Flame, Shield, Sparkles, Swords, Trophy } from "lucide-react";
import { buttonStyles } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AchievementBadge, AppProgress, TrainingRecord } from "@/lib/types";
import { getSeasonProgress } from "@/lib/typing";
import { BOSS_CHALLENGES } from "@/data/boss-challenges";

export function SeasonSummaryBoard({
  progress,
  records,
  badges
}: {
  progress: AppProgress;
  records: TrainingRecord[];
  badges: AchievementBadge[];
}) {
  const season = getSeasonProgress(progress.seasonPoints);
  const bossClears = BOSS_CHALLENGES.filter((boss) =>
    records.some(
      (record) =>
        record.mode === "boss" &&
        record.challengeId === boss.id &&
        record.wpm >= boss.goalWpm &&
        record.accuracy >= boss.goalAccuracy
    )
  );
  const challengeWins = records.filter((record) => record.mode === "challenge" && record.accuracy >= 95).length;
  const duelWins = records.filter((record) => record.mode === "duel" && record.accuracy >= 95).length;
  const topBadges = badges.filter((badge) => badge.unlocked).slice(0, 4);
  const averageWpm = records.length
    ? Math.round(records.reduce((sum, record) => sum + record.wpm, 0) / records.length)
    : 0;

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <Card className="overflow-hidden border border-sky-100 bg-[linear-gradient(180deg,rgba(6,18,43,0.96),rgba(13,34,74,0.94))] text-white shadow-[0_30px_80px_rgba(8,15,35,0.32)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Crown className="h-5 w-5 text-amber-300" />
            当前赛季回顾
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className={`rounded-[26px] bg-gradient-to-br ${season.current.accent} p-5 shadow-lg`}>
            <div className="text-sm uppercase tracking-[0.22em] text-white/80">当前段位</div>
            <div className="mt-2 font-display text-4xl">{season.current.title}</div>
            <p className="mt-3 max-w-xl text-sm leading-7 text-white/85">{season.current.summary}</p>
          </div>
          <div className="rounded-[22px] bg-white/10 p-4">
            <div className="mb-2 flex items-center justify-between text-sm text-white/80">
              <span>赛季积分</span>
              <span>{progress.seasonPoints} 分</span>
            </div>
            <Progress value={season.progress} />
            <div className="mt-3 text-sm text-white/80">
              {season.next ? `距离 ${season.next.title} 还差 ${season.pointsToNext} 分` : "你已经处在最高赛季段位"}
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[22px] bg-white/10 p-4">
              <div className="text-sm text-white/70">平均速度</div>
              <div className="mt-2 font-display text-3xl">{averageWpm} WPM</div>
            </div>
            <div className="rounded-[22px] bg-white/10 p-4">
              <div className="text-sm text-white/70">挑战胜场</div>
              <div className="mt-2 font-display text-3xl">{challengeWins}</div>
            </div>
            <div className="rounded-[22px] bg-white/10 p-4">
              <div className="text-sm text-white/70">对战胜场</div>
              <div className="mt-2 font-display text-3xl">{duelWins}</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/challenge" className={buttonStyles({ className: "gap-2 bg-white text-sky-950 hover:bg-sky-50" })}>
              <Swords className="h-4 w-4" />
              继续冲榜
            </Link>
            <Link href="/trainer?boss=boss-echo-falcon" className={buttonStyles({ variant: "outline", className: "gap-2 border-white/20 bg-white/10 text-white hover:bg-white/15" })}>
              <Flame className="h-4 w-4" />
              进入 Boss 线
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-sky-500" />
              Boss 奖励进度
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {BOSS_CHALLENGES.map((boss) => {
              const cleared = bossClears.some((item) => item.id === boss.id);
              return (
                <div key={boss.id} className="rounded-[22px] bg-sky-50/90 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold text-sky-950">{boss.title}</div>
                      <div className="mt-1 text-sm text-sky-700/80">{boss.badgeReward} · {boss.goal}</div>
                    </div>
                    <div className={`rounded-full px-3 py-1 text-xs font-semibold ${cleared ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                      {cleared ? "已击败" : "未完成"}
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-sky-500" />
              已解锁赛季奖励
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topBadges.length === 0 ? (
              <div className="rounded-[22px] bg-sky-50/90 p-4 text-sm leading-7 text-sky-800/80">
                本赛季还没有解锁成就。先完成一次挑战或 Boss，奖励会开始滚起来。
              </div>
            ) : (
              topBadges.map((badge) => (
                <div key={badge.id} className="rounded-[22px] bg-sky-50/90 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-sky-950">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    {badge.title}
                  </div>
                  <div className="mt-2 text-sm leading-7 text-sky-800/80">{badge.description}</div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
