"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { TrainingRecord } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StatsOverview({ records }: { records: TrainingRecord[] }) {
  const chartData = records
    .slice(0, 10)
    .reverse()
    .map((item, index) => ({
      name: `${index + 1}`,
      wpm: item.wpm,
      accuracy: item.accuracy
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>最近速度曲线</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex h-72 items-center justify-center rounded-[24px] bg-sky-50/80 text-sm text-sky-700">
            先完成几次训练，再来看你的速度曲线。
          </div>
        ) : (
          <div className="h-72 w-full rounded-[24px] bg-white/70 p-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="name" stroke="#4c6f86" tickLine={false} axisLine={false} />
                <YAxis stroke="#4c6f86" tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "18px",
                    border: "1px solid rgba(125, 211, 252, 0.5)",
                    background: "rgba(255,255,255,0.95)"
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="wpm"
                  stroke="#0ea5e9"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#0ea5e9" }}
                />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="#fbbf24"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
