"use client";

import Link from "next/link";
import { ArrowRight, Gauge, Target } from "lucide-react";
import { Lesson } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonStyles } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function LessonCard({ lesson }: { lesson: Lesson }) {
  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <Badge>关卡 {lesson.id}</Badge>
          <Badge className="bg-amber-50 text-amber-700">循序渐进</Badge>
        </div>
        <CardTitle>{lesson.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-7 text-sky-800/80">{lesson.description}</p>
        <div className="rounded-[24px] bg-sky-50/80 p-4 text-sm text-sky-900">
          <div className="mb-2 line-clamp-2 font-medium">{lesson.content}</div>
          <div className="grid gap-2 text-sm text-sky-800/80">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-sky-500" />
              目标正确率：{lesson.goalAccuracy}%
            </div>
            <div className="flex items-center gap-2">
              <Gauge className="h-4 w-4 text-amber-500" />
              目标速度：{lesson.goalWpm} WPM
            </div>
          </div>
        </div>
        <Link href={`/trainer?lesson=${lesson.id}`} className={buttonStyles({ className: "w-full gap-2" })}>
          开始训练
          <ArrowRight className="h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  );
}
