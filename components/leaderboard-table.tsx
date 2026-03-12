import { Crown, Flame, Gauge, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LeaderboardEntry } from "@/lib/types";

export function LeaderboardTable({
  title,
  description,
  entries
}: {
  title: string;
  description: string;
  entries: LeaderboardEntry[];
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm leading-7 text-sky-800/75">{description}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {entries.map((entry, index) => (
          <div
            key={entry.id}
            className="grid gap-3 rounded-[24px] border border-sky-100 bg-white/75 p-4 md:grid-cols-[72px_minmax(0,1fr)_110px_110px_110px]"
          >
            <div className="flex items-center gap-2 text-sky-900">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 font-display text-xl">
                #{index + 1}
              </div>
              {index === 0 ? <Crown className="h-5 w-5 text-amber-500" /> : null}
            </div>
            <div>
              <div className="font-semibold text-sky-950">{entry.name}</div>
              <div className="mt-1 text-sm text-sky-700/75">
                {entry.country} · {entry.badge}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1 text-xs text-sky-600/70">
                <Gauge className="h-3.5 w-3.5" />
                速度
              </div>
              <div className="mt-2 font-display text-2xl text-sky-950">{entry.wpm}</div>
            </div>
            <div>
              <div className="flex items-center gap-1 text-xs text-sky-600/70">
                <ShieldCheck className="h-3.5 w-3.5" />
                正确率
              </div>
              <div className="mt-2 font-display text-2xl text-sky-950">{entry.accuracy}%</div>
            </div>
            <div>
              <div className="flex items-center gap-1 text-xs text-sky-600/70">
                <Flame className="h-3.5 w-3.5" />
                连续
              </div>
              <div className="mt-2 font-display text-2xl text-sky-950">{entry.streak}天</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
