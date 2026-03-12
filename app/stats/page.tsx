"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { DashboardCards } from "@/components/dashboard-cards";
import { HistoryTable } from "@/components/history-table";
import { MissionPanel } from "@/components/mission-panel";
import { PageHero } from "@/components/page-hero";
import { StatsHeatmap } from "@/components/stats-heatmap";
import { StatsOverview } from "@/components/stats-overview";
import { loadProgress, loadRecords } from "@/lib/storage";
import { aggregateErrorHotspots } from "@/lib/typing";
import { TrainingRecord } from "@/lib/types";

export default function StatsPage() {
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [coins, setCoins] = useState(0);
  const [bestWpm, setBestWpm] = useState(0);
  const [records, setRecords] = useState<TrainingRecord[]>([]);

  useEffect(() => {
    const progress = loadProgress();
    const recordList = loadRecords();
    setLevel(progress.level);
    setXp(progress.xp);
    setStreak(progress.streak);
    setCoins(progress.coins);
    setBestWpm(recordList.length ? Math.max(...recordList.map((r) => r.wpm)) : 0);
    setRecords(recordList);
  }, []);

  const totalSessions = records.length;
  const averageWpm = totalSessions
    ? Math.round(records.reduce((sum, item) => sum + item.wpm, 0) / totalSessions)
    : 0;
  const averageAccuracy = totalSessions
    ? Math.round(records.reduce((sum, item) => sum + item.accuracy, 0) / totalSessions)
    : 0;
  const totalWrongChars = records.reduce((sum, item) => sum + item.wrongChars, 0);
  const totalDuration = records.reduce((sum, item) => sum + item.duration, 0);
  const averageDuration = totalSessions ? Math.round(totalDuration / totalSessions) : 0;
  const bestAccuracy = totalSessions ? Math.max(...records.map((item) => item.accuracy)) : 0;
  const hotspotKeys = aggregateErrorHotspots(records);

  return (
    <AppShell>
      <PageHero
        eyebrow="Growth dashboard"
        title="成长统计"
        description="这里不是简单的成绩单，而是你会不会继续练下去的核心钩子。看自己的最高速度、平均输出、总练习时长和最近 28 天活跃节奏，会更容易形成升级感。"
        aside={
          <>
            <div className="rounded-[24px] bg-white/70 p-4 shadow-sm">
              <div className="text-sm text-sky-600/70">历史最高速度</div>
              <div className="font-display text-3xl text-sky-950">{bestWpm} WPM</div>
            </div>
            <div className="rounded-[24px] bg-white/70 p-4 shadow-sm">
              <div className="text-sm text-sky-600/70">平均速度</div>
              <div className="font-display text-3xl text-sky-950">{averageWpm} WPM</div>
            </div>
            <div className="rounded-[24px] bg-white/70 p-4 shadow-sm">
              <div className="text-sm text-sky-600/70">累计练习时长</div>
              <div className="font-display text-3xl text-sky-950">{Math.round(totalDuration / 60)} 分钟</div>
            </div>
          </>
        }
      />
      <DashboardCards level={level} xp={xp} streak={streak} bestWpm={bestWpm} coins={coins} />
      <div className="grid gap-6 xl:grid-cols-4">
        <div className="rounded-[28px] border border-sky-100 bg-white/80 p-6 shadow-[0_22px_55px_rgba(15,59,86,0.08)]">
          <div className="text-sm text-sky-600/70">总训练次数</div>
          <div className="mt-3 font-display text-5xl text-sky-950">{totalSessions}</div>
          <p className="mt-4 text-sm leading-7 text-sky-800/80">次数越多，说明节奏越稳定，提升也越可持续。</p>
        </div>
        <div className="rounded-[28px] border border-sky-100 bg-white/80 p-6 shadow-[0_22px_55px_rgba(15,59,86,0.08)]">
          <div className="text-sm text-sky-600/70">平均正确率</div>
          <div className="mt-3 font-display text-5xl text-sky-950">{averageAccuracy}%</div>
          <p className="mt-4 text-sm leading-7 text-sky-800/80">这是最能决定你后续提速空间的底层指标。</p>
        </div>
        <div className="rounded-[28px] border border-sky-100 bg-white/80 p-6 shadow-[0_22px_55px_rgba(15,59,86,0.08)]">
          <div className="text-sm text-sky-600/70">平均单次时长</div>
          <div className="mt-3 font-display text-5xl text-sky-950">{averageDuration}s</div>
          <p className="mt-4 text-sm leading-7 text-sky-800/80">短练习更容易坚持，形成规律比一次练很久更重要。</p>
        </div>
        <div className="rounded-[28px] border border-sky-100 bg-white/80 p-6 shadow-[0_22px_55px_rgba(15,59,86,0.08)]">
          <div className="text-sm text-sky-600/70">历史最佳正确率</div>
          <div className="mt-3 font-display text-5xl text-sky-950">{bestAccuracy}%</div>
          <p className="mt-4 text-sm leading-7 text-sky-800/80">如果这里长期接近 100%，说明你已经能安全提速。</p>
        </div>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <StatsOverview records={records} />
        <MissionPanel records={records} />
      </div>
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <StatsHeatmap records={records} />
        <div className="rounded-[28px] border border-sky-100 bg-white/80 p-6 shadow-[0_22px_55px_rgba(15,59,86,0.08)]">
          <div className="mb-2 text-sm text-sky-600/70">累计错误数</div>
          <div className="font-display text-5xl text-sky-950">{totalWrongChars}</div>
          <p className="mt-4 text-sm leading-7 text-sky-800/80">
            如果这个数字增长很快，通常意味着手型还不稳定，建议回到更熟悉的课程，优先守住正确率，再冲速度。
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[22px] bg-sky-50/90 p-4">
              <div className="text-sm text-sky-600/75">最近冲刺建议</div>
              <div className="mt-2 text-lg font-semibold text-sky-950">
                {averageAccuracy >= 95 ? "可以尝试提高速度目标" : "建议先回到更熟悉的课程"}
              </div>
            </div>
            <div className="rounded-[22px] bg-sky-50/90 p-4">
              <div className="text-sm text-sky-600/75">成长状态</div>
              <div className="mt-2 text-lg font-semibold text-sky-950">
                {streak >= 5 ? "连续训练稳定" : "先建立每日练习节奏"}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[28px] border border-sky-100 bg-white/80 p-6 shadow-[0_22px_55px_rgba(15,59,86,0.08)]">
          <div className="text-sm text-sky-600/70">错误热键分析</div>
          {hotspotKeys.length === 0 ? (
            <p className="mt-4 text-sm leading-7 text-sky-800/80">
              还没有足够的纠错数据。完成几轮训练后，这里会告诉你最容易出错的键位和习惯。
            </p>
          ) : (
            <>
              <div className="mt-4 flex flex-wrap gap-3">
                {hotspotKeys.map((item) => (
                  <div key={item.key} className="rounded-[20px] bg-sky-50/90 px-4 py-3">
                    <div className="text-xs text-sky-600/75">高频错键</div>
                    <div className="mt-1 text-xl font-semibold text-sky-950">
                      {item.key} × {item.count}
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm leading-7 text-sky-800/80">
                这些键位是你最值得单独回炉的地方。热键越集中，越说明你可以通过针对性重复练习快速修正。
              </p>
            </>
          )}
        </div>
        <div className="rounded-[28px] border border-sky-100 bg-white/80 p-6 shadow-[0_22px_55px_rgba(15,59,86,0.08)]">
          <div className="text-sm text-sky-600/70">智能纠错建议</div>
          <div className="mt-4 grid gap-3">
            <div className="rounded-[22px] bg-sky-50/90 p-4">
              <div className="text-sm font-semibold text-sky-950">先修热键，再冲速度</div>
              <p className="mt-2 text-sm leading-7 text-sky-800/80">
                如果错误集中在 1 到 3 个键位，优先做短时专项练习，收益通常比盲目提速更高。
              </p>
            </div>
            <div className="rounded-[22px] bg-sky-50/90 p-4">
              <div className="text-sm font-semibold text-sky-950">看错误类型，不只看错几个</div>
              <p className="mt-2 text-sm leading-7 text-sky-800/80">
                空格漏打、顺序颠倒和相邻键偏移代表的是不同问题。前两者偏节奏，后者偏指法和归位。
              </p>
            </div>
            <div className="rounded-[22px] bg-sky-50/90 p-4">
              <div className="text-sm font-semibold text-sky-950">把常用术语放进词库</div>
              <p className="mt-2 text-sm leading-7 text-sky-800/80">
                练真实会打的词，才能把速度提升迁移回工作和学习场景，这比随机文章更有效。
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid gap-6">
        <HistoryTable records={records} />
      </div>
    </AppShell>
  );
}
