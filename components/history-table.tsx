import { TrainingRecord } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function HistoryTable({ records }: { records: TrainingRecord[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>最近训练记录</CardTitle>
      </CardHeader>
      <CardContent>
        {records.length === 0 ? (
          <p className="rounded-[24px] bg-sky-50/80 p-4 text-sm text-sky-700">
            还没有训练记录。先去完成一轮课程，图表和历史就会开始累积。
          </p>
        ) : (
          <div className="space-y-3">
            {records.map((item) => (
              <div
                key={item.id}
                className="grid gap-3 rounded-[24px] border border-sky-100 bg-white/70 p-4 md:grid-cols-6"
              >
                <div>
                  <div className="text-xs text-sky-600/70">标题</div>
                  <div className="font-medium text-sky-950">{item.title}</div>
                </div>
                <div>
                  <div className="text-xs text-sky-600/70">速度</div>
                  <div className="font-medium text-sky-950">{item.wpm} WPM</div>
                </div>
                <div>
                  <div className="text-xs text-sky-600/70">正确率</div>
                  <div className="font-medium text-sky-950">{item.accuracy}%</div>
                </div>
                <div>
                  <div className="text-xs text-sky-600/70">错误</div>
                  <div className="font-medium text-sky-950">{item.wrongChars}</div>
                </div>
                <div>
                  <div className="text-xs text-sky-600/70">经验</div>
                  <div className="font-medium text-sky-950">+{item.xpGained}</div>
                </div>
                <div>
                  <div className="text-xs text-sky-600/70">时间</div>
                  <div className="font-medium text-sm text-sky-950">{item.createdAt}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
