"use client";

import { useEffect, useState } from "react";
import { Copy, Download, History, Share2, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { loadShareHistory } from "@/lib/storage";
import { ShareRecord } from "@/lib/types";

const KIND_LABELS: Record<ShareRecord["kind"], string> = {
  profile: "个人战绩卡",
  season: "赛季分享卡",
  duel: "对战结果卡"
};

const ACTION_META: Record<
  ShareRecord["action"],
  { label: string; icon: typeof Share2 }
> = {
  share: { label: "系统分享", icon: Share2 },
  copy: { label: "复制链接", icon: Copy },
  download: { label: "下载图片", icon: Download },
  "download-poster": { label: "下载长图", icon: Sparkles }
};

function formatTime(iso: string) {
  const date = new Date(iso);
  return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
}

export function ShareHistoryPanel() {
  const [items, setItems] = useState<ShareRecord[]>([]);

  useEffect(() => {
    setItems(loadShareHistory());
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5 text-sky-500" />
          最近分享记录
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length === 0 ? (
          <div className="rounded-[22px] bg-sky-50/90 p-4 text-sm leading-7 text-sky-800/80">
            还没有分享记录。下次把个人战绩卡、赛季卡或对战卡发出去后，这里会自动留下最近动作。
          </div>
        ) : (
          items.slice(0, 6).map((item) => {
            const meta = ACTION_META[item.action];
            const Icon = meta.icon;

            return (
              <div key={item.id} className="rounded-[22px] bg-sky-50/90 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-sky-700">
                        {KIND_LABELS[item.kind]}
                      </span>
                      <span className="rounded-full bg-white px-3 py-1 text-xs text-sky-700/80">
                        {formatTime(item.createdAt)}
                      </span>
                    </div>
                    <div className="font-semibold text-sky-950">{item.title}</div>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
                    <Icon className="h-3.5 w-3.5" />
                    {meta.label}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
