"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrainingRecord } from "@/lib/types";

function createHeatmap(records: TrainingRecord[]) {
  const buckets = new Map<string, number>();

  records.forEach((record) => {
    const timestamp = Number(record.id);
    const day = Number.isFinite(timestamp) ? new Date(timestamp) : new Date(record.createdAt);
    if (Number.isNaN(day.getTime())) return;
    const key = day.toISOString().slice(0, 10);
    buckets.set(key, (buckets.get(key) ?? 0) + 1);
  });

  return Array.from({ length: 28 }).map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (27 - index));
    const key = date.toISOString().slice(0, 10);
    const value = buckets.get(key) ?? 0;
    const label = `${date.getMonth() + 1}/${date.getDate()}`;

    return { key, value, label };
  });
}

function getCellTone(value: number) {
  if (value >= 4) return "bg-sky-600";
  if (value >= 3) return "bg-sky-500";
  if (value >= 2) return "bg-sky-300";
  if (value >= 1) return "bg-sky-200";
  return "bg-slate-100";
}

export function StatsHeatmap({ records }: { records: TrainingRecord[] }) {
  const cells = createHeatmap(records);

  return (
    <Card>
      <CardHeader>
        <CardTitle>最近 28 天练习热力图</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-7 gap-3">
          {cells.map((cell) => (
            <div key={cell.key} className="space-y-2">
              <div
                className={`h-14 rounded-[18px] border border-white/70 ${getCellTone(cell.value)} shadow-sm transition-transform hover:-translate-y-0.5`}
                title={`${cell.label} · ${cell.value} 次练习`}
              />
              <div className="text-center text-[11px] text-sky-700/75">{cell.label}</div>
            </div>
          ))}
        </div>
        <p className="text-sm leading-7 text-sky-800/80">
          颜色越深表示当天练习次数越多。连续出现在格子里的节奏，比偶尔一次高强度冲刺更能拉开差距。
        </p>
      </CardContent>
    </Card>
  );
}
