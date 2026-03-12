"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Crown, Flame, Gift, Shield, Sparkles } from "lucide-react";
import { fetchFriendSnapshot } from "@/lib/cloud";
import { BOSS_CHALLENGES } from "@/data/boss-challenges";
import { ShareCardActions } from "@/components/share-card-actions";
import { buttonStyles } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSeasonProgress } from "@/lib/typing";
import { FriendSnapshot } from "@/lib/types";

export function SeasonShareView({ shareCode }: { shareCode: string }) {
  const [snapshot, setSnapshot] = useState<FriendSnapshot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void fetchFriendSnapshot(shareCode).then((data) => {
      if (cancelled) return;
      setSnapshot(data);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [shareCode]);

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return window.location.href;
  }, []);

  if (loading) {
    return <div className="h-72 animate-pulse rounded-[28px] bg-sky-100/70" />;
  }

  if (!snapshot) {
    return (
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="text-2xl font-semibold text-sky-950">这张赛季卡还没同步出来</div>
          <Link href="/season" className={buttonStyles({ variant: "outline", className: "gap-2" })}>
            <ArrowLeft className="h-4 w-4" />
            返回赛季页
          </Link>
        </CardContent>
      </Card>
    );
  }

  const season = getSeasonProgress(snapshot.seasonPoints);
  const bossClears = BOSS_CHALLENGES.filter((boss) =>
    snapshot.recentRecords.some(
      (record) =>
        record.mode === "boss" &&
        record.challengeId === boss.id &&
        record.wpm >= boss.goalWpm &&
        record.accuracy >= boss.goalAccuracy
    )
  );

  return (
    <div id="season-share-poster" className="space-y-6">
      <Card
        id="season-share-card"
        className="overflow-hidden border-sky-200 bg-[linear-gradient(135deg,rgba(13,23,52,0.98),rgba(91,33,182,0.88),rgba(14,165,233,0.78))] text-white shadow-[0_34px_95px_rgba(28,25,70,0.35)]"
      >
        <CardContent className="grid gap-6 p-6 md:p-8 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/85">
              <Crown className="h-4 w-4" />
              Season share card
            </div>
            <div>
              <div className="text-sm uppercase tracking-[0.2em] text-white/70">赛季战绩卡</div>
              <CardTitle className="mt-3 text-4xl text-white">{snapshot.name}</CardTitle>
              <p className="mt-3 max-w-xl text-sm leading-8 text-white/85">
                这张卡片会展示当前段位、赛季积分、Boss 进度和本阶段的代表奖励，适合直接发给朋友。
              </p>
            </div>
            <ShareCardActions
              shareUrl={shareUrl}
              title={`${snapshot.name} 的赛季战绩卡`}
              text={`来看 ${snapshot.name} 的赛季进度：${season.current.title}，${snapshot.seasonPoints} 赛季分。`}
              captureId="season-share-card"
              posterId="season-share-poster"
              kind="season"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className={`rounded-[24px] bg-gradient-to-br ${season.current.accent} p-4 shadow-lg`}>
              <div className="text-sm text-white/75">当前段位</div>
              <div className="mt-2 font-display text-4xl text-white">{season.current.title}</div>
            </div>
            <div className="rounded-[24px] bg-white/12 p-4 backdrop-blur">
              <div className="flex items-center gap-2 text-sm text-white/75">
                <Shield className="h-4 w-4" />
                赛季积分
              </div>
              <div className="mt-2 font-display text-4xl">{snapshot.seasonPoints}</div>
            </div>
            <div className="rounded-[24px] bg-white/12 p-4 backdrop-blur">
              <div className="flex items-center gap-2 text-sm text-white/75">
                <Flame className="h-4 w-4" />
                Boss 通关
              </div>
              <div className="mt-2 font-display text-4xl">{bossClears.length}</div>
            </div>
            <div className="rounded-[24px] bg-white/12 p-4 backdrop-blur">
              <div className="flex items-center gap-2 text-sm text-white/75">
                <Gift className="h-4 w-4" />
                习惯金币
              </div>
              <div className="mt-2 font-display text-4xl">{snapshot.coins}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <CardHeader>
            <CardTitle>Boss 进度</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {BOSS_CHALLENGES.map((boss) => {
              const cleared = bossClears.some((item) => item.id === boss.id);
              return (
                <div key={boss.id} className="rounded-[22px] bg-sky-50/90 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold text-sky-950">{boss.title}</div>
                      <div className="mt-1 text-sm text-sky-800/80">{boss.badgeReward}</div>
                    </div>
                    <div className={`rounded-full px-3 py-1 text-xs font-semibold ${cleared ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                      {cleared ? "已完成" : "待挑战"}
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>本赛季代表奖励</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {snapshot.achievements.slice(0, 4).map((achievement) => (
              <div key={achievement.id} className="rounded-[22px] bg-sky-50/90 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-sky-950">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  {achievement.title}
                </div>
                <div className="mt-2 text-sm leading-7 text-sky-800/80">{achievement.description}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
