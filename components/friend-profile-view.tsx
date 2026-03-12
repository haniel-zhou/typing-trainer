"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Award, Gauge, Layers3, Scale, ShieldCheck, Sparkles, Swords } from "lucide-react";
import { createCloudDuel, fetchFriendSnapshot } from "@/lib/cloud";
import { loadFriendProfile, loadRecords } from "@/lib/storage";
import { FriendSnapshot } from "@/lib/types";
import { buttonStyles } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  shareCode: string;
};

function formatDuration(seconds: number) {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes}m ${rest}s`;
}

export function FriendProfileView({ shareCode }: Props) {
  const router = useRouter();
  const [snapshot, setSnapshot] = useState<FriendSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingDuel, setIsCreatingDuel] = useState(false);
  const myProfile = useMemo(() => loadFriendProfile(), []);
  const myStats = useMemo(() => {
    const records = loadRecords();
    const totalSessions = records.length;
    const bestWpm = records.length ? Math.max(...records.map((item) => item.wpm)) : 0;
    const bestAccuracy = records.length ? Math.max(...records.map((item) => item.accuracy)) : 0;

    return {
      bestWpm,
      bestAccuracy,
      totalSessions
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    void fetchFriendSnapshot(shareCode).then((data) => {
      if (cancelled) return;
      setSnapshot(data);
      setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [shareCode]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="h-48 animate-pulse rounded-[24px] bg-sky-100/70" />
        </CardContent>
      </Card>
    );
  }

  if (!snapshot) {
    return (
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="text-2xl font-semibold text-sky-950">没有找到这个好友主页</div>
          <p className="text-sm leading-7 text-sky-800/80">
            可能对方还没同步到云端，或者这个链接已经失效。
          </p>
          <Link href="/friends" className={buttonStyles({ variant: "outline", className: "gap-2" })}>
            <ArrowLeft className="h-4 w-4" />
            返回好友页
          </Link>
        </CardContent>
      </Card>
    );
  }

  async function createDuel() {
    if (!snapshot) return;
    setIsCreatingDuel(true);
    const session = await createCloudDuel(myProfile, {
      shareCode: snapshot.shareCode,
      name: snapshot.name
    });
    setIsCreatingDuel(false);
    if (!session) return;
    router.push(`/duel/${session.id}`);
  }

  const compareItems = [
    {
      label: "最佳速度",
      mine: myStats.bestWpm,
      friend: snapshot.bestWpm,
      unit: "WPM",
      icon: Gauge
    },
    {
      label: "最佳正确率",
      mine: myStats.bestAccuracy,
      friend: snapshot.bestAccuracy,
      unit: "%",
      icon: ShieldCheck
    },
    {
      label: "总练习次数",
      mine: myStats.totalSessions,
      friend: snapshot.totalSessions,
      unit: "次",
      icon: Layers3
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/friends" className={buttonStyles({ variant: "outline", className: "gap-2" })}>
          <ArrowLeft className="h-4 w-4" />
          返回好友页
        </Link>
        <Link
          href={`/friends?invite=${encodeURIComponent(myProfile.shareCode)}&name=${encodeURIComponent(myProfile.name)}`}
          className={buttonStyles({ className: "gap-2" })}
        >
          <Scale className="h-4 w-4" />
          也把我的主页发给对方
        </Link>
        <button onClick={() => void createDuel()} className={buttonStyles({ className: "gap-2" })}>
          <Swords className="h-4 w-4" />
          {isCreatingDuel ? "生成中..." : "发起好友对战"}
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="page-intro overflow-hidden">
          <CardContent className="grid gap-6 p-6 md:p-8">
            <div>
              <div className="inline-flex rounded-full bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700 shadow-sm">
                Friend profile
              </div>
              <CardTitle className="mt-4 text-4xl">{snapshot.name}</CardTitle>
              <p className="mt-3 max-w-2xl text-sm leading-8 text-sky-800/80">
                这是他的云端主页。这里显示最佳速度、练习频率和最近成绩，方便你判断差距在哪。
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-[24px] bg-white/80 p-4">
                <div className="text-sm text-sky-600/75">最佳速度</div>
                <div className="mt-2 text-3xl font-semibold text-sky-950">{snapshot.bestWpm} WPM</div>
              </div>
              <div className="rounded-[24px] bg-white/80 p-4">
                <div className="text-sm text-sky-600/75">最佳正确率</div>
                <div className="mt-2 text-3xl font-semibold text-sky-950">{snapshot.bestAccuracy}%</div>
              </div>
              <div className="rounded-[24px] bg-white/80 p-4">
                <div className="text-sm text-sky-600/75">平均速度</div>
                <div className="mt-2 text-3xl font-semibold text-sky-950">{snapshot.averageWpm} WPM</div>
              </div>
              <div className="rounded-[24px] bg-white/80 p-4">
                <div className="text-sm text-sky-600/75">总时长</div>
                <div className="mt-2 text-3xl font-semibold text-sky-950">{formatDuration(snapshot.totalDuration)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>和你对比</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {compareItems.map((item) => {
              const Icon = item.icon;
              const diff = item.friend - item.mine;
              return (
                <div key={item.label} className="rounded-[22px] bg-sky-50/90 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-sky-700">
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs text-sky-500">你</div>
                      <div className="text-2xl font-semibold text-sky-950">{item.mine}{item.unit}</div>
                    </div>
                    <div className="text-sm text-sky-500">vs</div>
                    <div className="text-right">
                      <div className="text-xs text-sky-500">{snapshot.name}</div>
                      <div className="text-2xl font-semibold text-sky-950">{item.friend}{item.unit}</div>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-sky-800/80">
                    {diff > 0 ? `对方目前领先 ${diff}${item.unit}` : diff < 0 ? `你目前领先 ${Math.abs(diff)}${item.unit}` : "你们目前持平"}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-sky-500" />
            已解锁成就
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {snapshot.achievements.length === 0 ? (
            <div className="rounded-[22px] bg-sky-50/90 p-4 text-sm leading-7 text-sky-800/80 md:col-span-2">
              这个好友暂时还没有同步公开成就，等他完成 Boss 或赛季任务后这里会更丰富。
            </div>
          ) : (
            snapshot.achievements.map((badge) => (
              <div key={badge.id} className="rounded-[22px] bg-sky-50/90 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-sky-950">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  {badge.title}
                </div>
                <div className="mt-2 text-sm leading-7 text-sky-800/80">{badge.description}</div>
                <div className="mt-3 text-xs text-sky-600/70">
                  {badge.tier.toUpperCase()} · {badge.metricLabel}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>最近成绩</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {snapshot.recentRecords.length === 0 ? (
            <div className="rounded-[22px] bg-sky-50/90 p-4 text-sm text-sky-800/80">
              这个好友还没有公开同步最近成绩。
            </div>
          ) : (
            snapshot.recentRecords.map((record) => (
              <div key={record.id} className="grid gap-3 rounded-[22px] bg-sky-50/90 p-4 md:grid-cols-5">
                <div>
                  <div className="text-xs text-sky-500">标题</div>
                  <div className="mt-1 font-medium text-sky-950">{record.title}</div>
                </div>
                <div>
                  <div className="text-xs text-sky-500">速度</div>
                  <div className="mt-1 font-medium text-sky-950">{record.wpm} WPM</div>
                </div>
                <div>
                  <div className="text-xs text-sky-500">正确率</div>
                  <div className="mt-1 font-medium text-sky-950">{record.accuracy}%</div>
                </div>
                <div>
                  <div className="text-xs text-sky-500">时长</div>
                  <div className="mt-1 font-medium text-sky-950">{record.duration}s</div>
                </div>
                <div>
                  <div className="text-xs text-sky-500">时间</div>
                  <div className="mt-1 font-medium text-sky-950">{record.createdAt}</div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
