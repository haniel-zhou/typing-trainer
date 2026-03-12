import { AppShell } from "@/components/app-shell";
import { LESSONS } from "@/data/lessons";
import { PageHero } from "@/components/page-hero";
import { LessonsClientView } from "@/components/lessons-client-view";

export default function LessonsPage() {
  return (
    <AppShell>
      <PageHero
        eyebrow="Course roadmap"
        title="课程路线"
        description="从基准键、基础组合到完整句子，每一关都带着明确的正确率和速度目标。建议按顺序完成，先稳住动作，再追求更高的 WPM。"
        aside={
          <>
            <div className="rounded-[24px] bg-white/75 p-4 shadow-sm">
              <div className="text-sm text-sky-600/70">课程总数</div>
              <div className="font-display text-3xl text-sky-950">{LESSONS.length}</div>
            </div>
            <div className="rounded-[24px] bg-white/75 p-4 shadow-sm">
              <div className="text-sm text-sky-600/70">推荐顺序</div>
              <div className="font-display text-3xl text-sky-950">按关推进</div>
            </div>
            <div className="rounded-[24px] bg-white/75 p-4 shadow-sm">
              <div className="text-sm text-sky-600/70">核心原则</div>
              <div className="font-display text-3xl text-sky-950">先准后快</div>
            </div>
          </>
        }
      />
      <LessonsClientView lessons={LESSONS} />
    </AppShell>
  );
}
