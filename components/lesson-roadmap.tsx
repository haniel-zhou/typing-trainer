"use client";

import Link from "next/link";
import { ArrowRight, Star, Trophy } from "lucide-react";
import { Lesson, TrainingRecord } from "@/lib/types";
import { buttonStyles } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type LessonRoadmapProps = {
  lessons: Lesson[];
  records: TrainingRecord[];
};

function getBestStars(records: TrainingRecord[], lessonId: number) {
  return Math.max(
    0,
    ...records.filter((item) => item.lessonId === lessonId).map((item) => item.stars)
  );
}

export function LessonRoadmap({ lessons, records }: LessonRoadmapProps) {
  const nextLesson = lessons.find((lesson) => getBestStars(records, lesson.id) < 3)?.id ?? lessons[0]?.id;

  return (
    <Card>
      <CardHeader>
        <CardTitle>课程进度路线图</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {lessons.map((lesson) => {
          const stars = getBestStars(records, lesson.id);
          const status = stars >= 3 ? "已掌握" : stars > 0 ? "练习中" : "未开始";
          const isNext = lesson.id === nextLesson;

          return (
            <div
              key={lesson.id}
              className="grid gap-4 rounded-[24px] border border-sky-100 bg-white/80 p-4 md:grid-cols-[auto_1fr_auto]"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 font-display text-2xl text-white shadow-lg">
                {lesson.id}
              </div>
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="font-display text-2xl text-sky-950">{lesson.title}</div>
                  <Badge className={isNext ? "bg-amber-50 text-amber-700" : ""}>
                    {isNext ? "推荐下一关" : status}
                  </Badge>
                </div>
                <p className="text-sm leading-7 text-sky-800/80">{lesson.description}</p>
                <div className="rounded-[20px] bg-sky-50/90 p-3 text-sm leading-7 text-sky-900">
                  {lesson.content}
                </div>
                <div className="flex flex-wrap gap-3 text-sm text-sky-700/80">
                  <div>目标正确率：{lesson.goalAccuracy}%</div>
                  <div>目标速度：{lesson.goalWpm} WPM</div>
                  <div className="flex items-center gap-1">
                    最佳星级：
                    {stars > 0 ? (
                      Array.from({ length: stars }).map((_, index) => (
                        <Star key={index} className="h-4 w-4 fill-current text-amber-500" />
                      ))
                    ) : (
                      <span>暂无记录</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 md:items-end">
                {stars >= 3 ? (
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
                    <Trophy className="h-4 w-4" />
                    已通关
                  </div>
                ) : null}
                <Link
                  href={`/trainer?lesson=${lesson.id}`}
                  className={buttonStyles({
                    className: "gap-2",
                    variant: isNext ? "default" : "outline"
                  })}
                >
                  {stars > 0 ? "继续训练" : "开始训练"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
