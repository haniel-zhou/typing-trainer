"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Share2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { AchievementWall } from "@/components/achievement-wall";
import { DashboardCards } from "@/components/dashboard-cards";
import { PageHero } from "@/components/page-hero";
import { SeasonSummaryBoard } from "@/components/season-summary-board";
import { pullCloudAchievements } from "@/lib/cloud";
import { loadFriendProfile, loadProgress, loadRecords } from "@/lib/storage";
import { buildAchievementBadges, mergeAchievementBadges } from "@/lib/typing";
import { AchievementBadge, AppProgress, TrainingRecord } from "@/lib/types";

export default function SeasonPage() {
  const [progress] = useState<AppProgress>(() =>
    typeof window === "undefined"
      ? {
          level: 1,
          xp: 0,
          streak: 0,
          lastPracticeDate: null,
          totalCheckIns: 0,
          coins: 0,
          lastCheckInDate: null,
          seasonPoints: 0
        }
      : loadProgress()
  );
  const [records] = useState<TrainingRecord[]>(() => (typeof window === "undefined" ? [] : loadRecords()));
  const [badges, setBadges] = useState<AchievementBadge[]>(() =>
    buildAchievementBadges(
      typeof window === "undefined" ? [] : loadRecords(),
      typeof window === "undefined"
        ? {
            level: 1,
            xp: 0,
            streak: 0,
            lastPracticeDate: null,
            totalCheckIns: 0,
            coins: 0,
            lastCheckInDate: null,
            seasonPoints: 0
          }
        : loadProgress()
    )
  );

  useEffect(() => {
    void pullCloudAchievements(loadFriendProfile().shareCode).then((items) => {
      if (items.length === 0) return;
      setBadges((current) => mergeAchievementBadges(current, items));
    });
  }, []);

  const bestWpm = records.length ? Math.max(...records.map((item) => item.wpm)) : 0;
  const myProfile = loadFriendProfile();

  return (
    <AppShell>
      <PageHero
        eyebrow="Season summary"
        title="赛季回顾"
        description="这里收拢整个赛季的目标、奖励和 Boss 进度。它不是单纯的统计页，而是告诉你这一阶段打到了什么位置、下一步该冲什么。"
        aside={
          <>
            <div className="rounded-[24px] bg-white/70 p-4 shadow-sm">
              <div className="text-sm text-sky-600/70">当前赛季分</div>
              <div className="font-display text-3xl text-sky-950">{progress.seasonPoints}</div>
            </div>
            <div className="rounded-[24px] bg-white/70 p-4 shadow-sm">
              <div className="text-sm text-sky-600/70">累计签到</div>
              <div className="font-display text-3xl text-sky-950">{progress.totalCheckIns}</div>
            </div>
            <div className="rounded-[24px] bg-white/70 p-4 shadow-sm">
              <div className="text-sm text-sky-600/70">习惯金币</div>
              <div className="font-display text-3xl text-sky-950">{progress.coins}</div>
            </div>
          </>
        }
      />

      <DashboardCards
        level={progress.level}
        xp={progress.xp}
        streak={progress.streak}
        bestWpm={bestWpm}
        coins={progress.coins}
      />

      <SeasonSummaryBoard progress={progress} records={records} badges={badges} />

      <div className="flex flex-wrap gap-3">
        <Link
          href={`/share/season/${encodeURIComponent(myProfile.shareCode)}`}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(14,165,233,0.28)] transition duration-200 hover:-translate-y-0.5 hover:bg-sky-600"
        >
          <Share2 className="h-4 w-4" />
          打开赛季分享卡
        </Link>
      </div>

      <AchievementWall badges={badges} />
    </AppShell>
  );
}
