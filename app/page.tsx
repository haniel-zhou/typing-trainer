"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  ChartNoAxesCombined,
  Link2,
  LayoutTemplate,
  Crown,
  Share2,
  Sparkles,
  Swords,
  Users,
  WandSparkles
} from "lucide-react";
import { AchievementWall } from "@/components/achievement-wall";
import { AppShell } from "@/components/app-shell";
import { DailyCheckInCard } from "@/components/daily-checkin-card";
import { DailyMissionBoard } from "@/components/daily-mission-board";
import { DashboardCards } from "@/components/dashboard-cards";
import { LessonRoadmap } from "@/components/lesson-roadmap";
import { MissionPanel } from "@/components/mission-panel";
import { ShareHistoryPanel } from "@/components/share-history-panel";
import { buttonStyles } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LESSONS } from "@/data/lessons";
import { pullCloudAchievements } from "@/lib/cloud";
import { buildAchievementBadges, mergeAchievementBadges } from "@/lib/typing";
import { loadFriendProfile, loadProgress, loadRecords } from "@/lib/storage";
import { AchievementBadge, AppProgress, TrainingRecord } from "@/lib/types";

export default function HomePage() {
  const [progress, setProgress] = useState<AppProgress>({
    level: 1,
    xp: 0,
    streak: 0,
    lastPracticeDate: null,
    totalCheckIns: 0,
    coins: 0,
    lastCheckInDate: null,
    seasonPoints: 0
  });
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestWpm, setBestWpm] = useState(0);
  const [records, setRecords] = useState<TrainingRecord[]>([]);
  const [badges, setBadges] = useState<AchievementBadge[]>([]);
  const [myShareCode, setMyShareCode] = useState("");

  useEffect(() => {
    const progress = loadProgress();
    const records = loadRecords();
    const profile = loadFriendProfile();
    const localBadges = buildAchievementBadges(records, progress);
    setProgress(progress);
    setLevel(progress.level);
    setXp(progress.xp);
    setStreak(progress.streak);
    setBestWpm(records.length ? Math.max(...records.map((r) => r.wpm)) : 0);
    setRecords(records);
    setBadges(localBadges);
    setMyShareCode(profile.shareCode);

    void pullCloudAchievements(profile.shareCode).then((items) => {
      if (items.length === 0) return;
      setBadges(mergeAchievementBadges(localBadges, items));
    });
  }, []);

  return (
    <AppShell>
      <DashboardCards level={level} xp={xp} streak={streak} bestWpm={bestWpm} coins={progress.coins} />

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
        <Card className="page-intro overflow-hidden">
          <CardContent className="grid gap-8 p-6 md:p-8 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-sky-700 shadow-sm">
                <Sparkles className="h-4 w-4" />
                Beginner-friendly typing lab
              </div>
              <div className="space-y-4">
                <h1 className="font-display text-4xl leading-tight text-sky-950 md:text-5xl">
                  把打字训练做成一条
                  <span className="text-sky-500">有反馈、有节奏、有成长感</span>
                  的学习路径
                </h1>
                <p className="max-w-2xl text-base leading-8 text-sky-800/80">
                  从基准键开始，逐关建立正确手型；训练过程中即时显示速度、正确率和键位提示，让每一次输入都知道自己该怎么变快。
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/trainer?lesson=1" className={buttonStyles({ className: "gap-2" })}>
                  从第一关开始
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/challenge"
                  className={buttonStyles({ variant: "outline", className: "gap-2" })}
                >
                  <Swords className="h-4 w-4" />
                  进入挑战榜
                </Link>
                <Link
                  href="/custom"
                  className={buttonStyles({ variant: "outline", className: "gap-2" })}
                >
                  <WandSparkles className="h-4 w-4" />
                  创建自定义练习
                </Link>
                <Link
                  href="/friends"
                  className={buttonStyles({ variant: "outline", className: "gap-2" })}
                >
                  <Users className="h-4 w-4" />
                  邀请好友
                </Link>
                <Link
                  href="/product"
                  className={buttonStyles({ variant: "outline", className: "gap-2" })}
                >
                  <LayoutTemplate className="h-4 w-4" />
                  产品蓝图
                </Link>
                <Link
                  href="/season"
                  className={buttonStyles({ variant: "outline", className: "gap-2" })}
                >
                  <Crown className="h-4 w-4" />
                  赛季回顾
                </Link>
                {myShareCode ? (
                  <Link
                    href={`/share/profile/${encodeURIComponent(myShareCode)}`}
                    className={buttonStyles({ variant: "outline", className: "gap-2" })}
                  >
                    <Share2 className="h-4 w-4" />
                    分享战绩卡
                  </Link>
                ) : null}
              </div>
            </div>
            <div className="grid gap-4">
              <div className="rounded-[28px] bg-sky-950 p-5 text-white shadow-[0_24px_50px_rgba(14,91,135,0.28)]">
                <div className="mb-3 text-sm uppercase tracking-[0.18em] text-sky-200">
                  今日建议
                </div>
                <div className="font-display text-3xl">15 分钟短练习</div>
                <p className="mt-3 text-sm leading-7 text-sky-100/80">
                  先稳住准确率，再逐步提速。节奏稳定比盲目冲速度更重要。
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[24px] bg-white/75 p-4 shadow-sm">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-sky-700">
                    <BookOpen className="h-4 w-4" />
                    课程路线
                  </div>
                  <p className="text-sm leading-7 text-sky-800/80">
                    共 {LESSONS.length} 个关卡，从基准键到完整句子逐步升级。
                  </p>
                </div>
                <div className="rounded-[24px] bg-white/75 p-4 shadow-sm">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-sky-700">
                    <ChartNoAxesCombined className="h-4 w-4" />
                    成长记录
                  </div>
                  <p className="text-sm leading-7 text-sky-800/80">
                    已完成后可在成长页查看速度曲线与最近训练历史。
                  </p>
                </div>
                <div className="rounded-[24px] bg-white/75 p-4 shadow-sm sm:col-span-2">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-sky-700">
                    <Swords className="h-4 w-4" />
                    冲榜模式
                  </div>
                  <p className="text-sm leading-7 text-sky-800/80">
                    新增挑战页，包含好友榜、全球榜和限时赛，适合把平时训练变成带目标的冲刺。
                  </p>
                </div>
                <div className="rounded-[24px] bg-white/75 p-4 shadow-sm sm:col-span-2">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-sky-700">
                    <Link2 className="h-4 w-4" />
                    好友邀请
                  </div>
                  <p className="text-sm leading-7 text-sky-800/80">
                    复制一个浏览器邀请链接发给朋友，对方在微信、QQ 或手机浏览器里点开就能直接进入网页。
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>今天的练习策略</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="rounded-[24px] bg-sky-50/90 p-4">
                <div className="text-sm text-sky-600/75">目标</div>
                <div className="mt-2 text-lg font-semibold text-sky-950">练习 15 分钟</div>
              </div>
              <div className="rounded-[24px] bg-sky-50/90 p-4">
                <div className="text-sm text-sky-600/75">重点</div>
                <div className="mt-2 text-lg font-semibold text-sky-950">先准确率，再提速</div>
              </div>
              <div className="rounded-[24px] bg-sky-50/90 p-4">
                <div className="text-sm text-sky-600/75">建议</div>
                <div className="mt-2 text-lg font-semibold text-sky-950">从第一关开始</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <LessonRoadmap lessons={LESSONS.slice(0, 3)} records={records} />
        <MissionPanel records={records} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <DailyCheckInCard
          progress={progress}
          onProgressChange={(next) => {
            setProgress(next);
            setLevel(next.level);
            setXp(next.xp);
            setStreak(next.streak);
          }}
        />
        <AchievementWall badges={badges} />
      </div>

      <DailyMissionBoard
        records={records}
        progress={progress}
        onProgressChange={(next) => {
          setProgress(next);
          setLevel(next.level);
          setXp(next.xp);
          setStreak(next.streak);
        }}
      />

      <ShareHistoryPanel />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>推荐学习路径</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {LESSONS.slice(0, 3).map((lesson) => (
              <div key={lesson.id} className="rounded-[24px] bg-sky-50/90 p-4">
                <div className="mb-3 text-sm font-semibold text-sky-700">阶段 {lesson.id}</div>
                <div className="font-display text-2xl text-sky-950">{lesson.title}</div>
                <p className="mt-3 text-sm leading-7 text-sky-800/80">{lesson.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>说明</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-sky-800/80">
            <p>这是一个为初学者设计的网页打字训练器。</p>
            <p>你可以从基准键开始，逐步练习单词、句子和文章。</p>
            <p>系统会记录速度、正确率、经验和成长进度。</p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
