"use client";

import Link from "next/link";
import { ArrowRight, Crown, Flag, Target } from "lucide-react";
import { LESSONS } from "@/data/lessons";
import { TrainingRecord } from "@/lib/types";
import { buttonStyles } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type MissionPanelProps = {
  records: TrainingRecord[];
};

export function MissionPanel({ records }: MissionPanelProps) {
  const recordsByLesson = new Map<number, TrainingRecord[]>();
  for (const record of records) {
    if (!record.lessonId) continue;
    const list = recordsByLesson.get(record.lessonId) ?? [];
    list.push(record);
    recordsByLesson.set(record.lessonId, list);
  }

  const nextLesson =
    LESSONS.find((lesson) => Math.max(...(recordsByLesson.get(lesson.id) ?? []).map((item) => item.stars), 0) < 3) ??
    LESSONS[LESSONS.length - 1];
  const completedLessons = LESSONS.filter(
    (lesson) => Math.max(...(recordsByLesson.get(lesson.id) ?? []).map((item) => item.stars), 0) >= 2
  ).length;
  const perfectLessons = LESSONS.filter(
    (lesson) => Math.max(...(recordsByLesson.get(lesson.id) ?? []).map((item) => item.stars), 0) >= 3
  ).length;

  const missions = [
    {
      label: "下一关任务",
      value: nextLesson.title,
      hint: "优先完成当前推荐关卡，拿到 2 星以上再推进。",
      progress: Math.round((completedLessons / LESSONS.length) * 100),
      icon: Flag,
      actionHref: `/trainer?lesson=${nextLesson.id}`,
      actionLabel: "继续训练"
    },
    {
      label: "课程通过率",
      value: `${completedLessons}/${LESSONS.length}`,
      hint: "达成 2 星视为通过，可以继续冲更高速度。",
      progress: Math.round((completedLessons / LESSONS.length) * 100),
      icon: Target,
      actionHref: "/lessons",
      actionLabel: "查看课程"
    },
    {
      label: "三星彩蛋",
      value: `${perfectLessons} 关`,
      hint: "拿满 3 星说明准确率和速度都稳住了。",
      progress: Math.round((perfectLessons / LESSONS.length) * 100),
      icon: Crown,
      actionHref: "/stats",
      actionLabel: "看成长"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>当前任务面板</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {missions.map((mission) => (
          <div key={mission.label} className="rounded-[24px] bg-white/80 p-4 shadow-sm">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <div className="text-sm text-sky-600/75">{mission.label}</div>
                <div className="mt-1 font-display text-2xl text-sky-950">{mission.value}</div>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 text-white shadow-lg">
                <mission.icon className="h-5 w-5" />
              </div>
            </div>
            <Progress value={mission.progress} />
            <p className="mt-3 text-sm leading-7 text-sky-800/80">{mission.hint}</p>
            <Link
              href={mission.actionHref}
              className={buttonStyles({ variant: "outline", className: "mt-4 w-full gap-2" })}
            >
              {mission.actionLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
