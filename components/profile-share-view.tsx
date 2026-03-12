"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Award, Gauge, Sparkles, Timer, Trophy } from "lucide-react";
import { fetchFriendSnapshot } from "@/lib/cloud";
import { FriendSnapshot } from "@/lib/types";
import { ShareCardActions } from "@/components/share-card-actions";
import { buttonStyles } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function formatDuration(seconds: number) {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes}m ${rest}s`;
}

export function ProfileShareView({ shareCode }: { shareCode: string }) {
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
          <div className="text-2xl font-semibold text-sky-950">这张战绩卡还没有同步出来</div>
          <Link href="/friends" className={buttonStyles({ variant: "outline", className: "gap-2" })}>
            <ArrowLeft className="h-4 w-4" />
            返回好友页
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div id="profile-share-poster" className="space-y-6">
      <Card
        id="profile-share-card"
        className="overflow-hidden border-sky-200 bg-[linear-gradient(135deg,rgba(7,29,66,0.97),rgba(20,89,135,0.94),rgba(244,250,255,0.82))] text-white shadow-[0_32px_90px_rgba(11,31,65,0.34)]"
      >
        <CardContent className="grid gap-6 p-6 md:p-8 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-sky-100">
              <Sparkles className="h-4 w-4" />
              Typing share card
            </div>
            <div>
              <div className="text-sm uppercase tracking-[0.2em] text-sky-100/70">个人战绩卡</div>
              <CardTitle className="mt-3 text-4xl text-white">{snapshot.name}</CardTitle>
              <p className="mt-3 max-w-xl text-sm leading-8 text-sky-100/85">
                这是一张可以直接分享的打字主页。打开后就能看到最高速度、赛季状态和代表成就。
              </p>
            </div>
            <ShareCardActions
              shareUrl={shareUrl}
              title={`${snapshot.name} 的打字战绩卡`}
              text={`来看 ${snapshot.name} 的 Typing Trainer 战绩卡：${snapshot.bestWpm} WPM，${snapshot.bestAccuracy}% 正确率。`}
              captureId="profile-share-card"
              posterId="profile-share-poster"
              kind="profile"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[24px] bg-white/12 p-4 backdrop-blur">
              <div className="flex items-center gap-2 text-sm text-sky-100/75">
                <Gauge className="h-4 w-4" />
                最高速度
              </div>
              <div className="mt-2 font-display text-4xl">{snapshot.bestWpm}</div>
              <div className="text-sm text-sky-100/70">WPM</div>
            </div>
            <div className="rounded-[24px] bg-white/12 p-4 backdrop-blur">
              <div className="flex items-center gap-2 text-sm text-sky-100/75">
                <Trophy className="h-4 w-4" />
                最佳正确率
              </div>
              <div className="mt-2 font-display text-4xl">{snapshot.bestAccuracy}%</div>
              <div className="text-sm text-sky-100/70">稳定输出</div>
            </div>
            <div className="rounded-[24px] bg-white/12 p-4 backdrop-blur">
              <div className="flex items-center gap-2 text-sm text-sky-100/75">
                <Timer className="h-4 w-4" />
                累计时长
              </div>
              <div className="mt-2 font-display text-4xl">{formatDuration(snapshot.totalDuration)}</div>
              <div className="text-sm text-sky-100/70">总练习</div>
            </div>
            <div className="rounded-[24px] bg-white/12 p-4 backdrop-blur">
              <div className="flex items-center gap-2 text-sm text-sky-100/75">
                <Award className="h-4 w-4" />
                已解锁成就
              </div>
              <div className="mt-2 font-display text-4xl">{snapshot.achievements.length}</div>
              <div className="text-sm text-sky-100/70">枚徽章</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle>代表成就</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {snapshot.achievements.length === 0 ? (
              <div className="rounded-[22px] bg-sky-50/90 p-4 text-sm leading-7 text-sky-800/80">
                这张主页还没有公开同步成就。
              </div>
            ) : (
              snapshot.achievements.slice(0, 4).map((achievement) => (
                <div key={achievement.id} className="rounded-[22px] bg-sky-50/90 p-4">
                  <div className="font-semibold text-sky-950">{achievement.title}</div>
                  <div className="mt-2 text-sm leading-7 text-sky-800/80">{achievement.description}</div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>最近状态</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {snapshot.recentRecords.slice(0, 3).map((record) => (
              <div key={record.id} className="rounded-[22px] bg-sky-50/90 p-4">
                <div className="text-sm font-semibold text-sky-950">{record.title}</div>
                <div className="mt-3 flex flex-wrap gap-2 text-sm text-sky-800/80">
                  <span className="rounded-full bg-white px-3 py-1">{record.wpm} WPM</span>
                  <span className="rounded-full bg-white px-3 py-1">{record.accuracy}%</span>
                  <span className="rounded-full bg-white px-3 py-1">{record.duration}s</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
