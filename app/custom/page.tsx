import { AppShell } from "@/components/app-shell";
import { CustomEditor } from "@/components/custom-editor";
import { PageHero } from "@/components/page-hero";

export default function CustomPage() {
  return (
    <AppShell>
      <PageHero
        eyebrow="Custom practice"
        title="自定义练习"
        description="把你最常打的内容放进来练。可以是英文短文、演讲稿、代码片段，也可以是日常工作里反复输入的固定文本。"
        aside={
          <>
            <div className="rounded-[24px] bg-white/75 p-4 shadow-sm">
              <div className="text-sm text-sky-600/70">适合内容</div>
              <div className="font-display text-3xl text-sky-950">术语 / 短文</div>
            </div>
            <div className="rounded-[24px] bg-white/75 p-4 shadow-sm">
              <div className="text-sm text-sky-600/70">词库玩法</div>
              <div className="font-display text-3xl text-sky-950">导入即练 / 云同步</div>
            </div>
            <div className="rounded-[24px] bg-white/75 p-4 shadow-sm">
              <div className="text-sm text-sky-600/70">辅助录入</div>
              <div className="font-display text-3xl text-sky-950">支持语音</div>
            </div>
          </>
        }
      />
      <CustomEditor />
    </AppShell>
  );
}
