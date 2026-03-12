"use client";

import { useEffect, useState } from "react";
import { LessonCard } from "@/components/lesson-card";
import { LessonRoadmap } from "@/components/lesson-roadmap";
import { loadRecords } from "@/lib/storage";
import { Lesson, TrainingRecord } from "@/lib/types";

export function LessonsClientView({ lessons }: { lessons: Lesson[] }) {
  const [records, setRecords] = useState<TrainingRecord[]>([]);

  useEffect(() => {
    setRecords(loadRecords());
  }, []);

  return (
    <div className="space-y-6">
      <LessonRoadmap lessons={lessons} records={records} />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {lessons.map((lesson) => (
          <LessonCard key={lesson.id} lesson={lesson} />
        ))}
      </div>
    </div>
  );
}
