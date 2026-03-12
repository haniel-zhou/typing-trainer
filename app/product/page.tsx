import { AppShell } from "@/components/app-shell";
import { DatabaseSchemaBoard } from "@/components/database-schema-board";
import { GamificationBoard } from "@/components/gamification-board";
import { GrowthSystemBoard } from "@/components/growth-system-board";
import { PageHero } from "@/components/page-hero";
import { ProductFeatureMap } from "@/components/product-feature-map";
import { ProductPageMap } from "@/components/product-page-map";
import {
  DATABASE_TABLES,
  GAME_MECHANICS,
  GROWTH_LAYERS,
  PRODUCT_CAPABILITIES,
  PRODUCT_PAGES
} from "@/data/product-blueprint";

export default function ProductPage() {
  return (
    <AppShell>
      <PageHero
        eyebrow="Product overview"
        title="Typing Trainer 功能全景"
        description="这一页会带你快速看清这套打字训练能做什么、怎么帮你进步，以及为什么它不只是一个练字网页，而是一套可以长期使用、持续升级的打字产品。"
        aside={
          <>
            <div className="rounded-[24px] bg-white/75 p-4 shadow-sm">
              <div className="text-sm text-sky-600/70">你会得到</div>
              <div className="font-display text-3xl text-sky-950">训练 + 成长 + 分享</div>
            </div>
            <div className="rounded-[24px] bg-white/75 p-4 shadow-sm">
              <div className="text-sm text-sky-600/70">核心体验</div>
              <div className="font-display text-3xl text-sky-950">练得清楚，进步看得见</div>
            </div>
            <div className="rounded-[24px] bg-white/75 p-4 shadow-sm">
              <div className="text-sm text-sky-600/70">适合谁</div>
              <div className="font-display text-3xl text-sky-950">新手、学生、办公与专业输入</div>
            </div>
          </>
        }
      />

      <div className="space-y-6">
        <ProductFeatureMap sections={PRODUCT_CAPABILITIES} />
        <ProductPageMap pages={PRODUCT_PAGES} />
        <DatabaseSchemaBoard tables={DATABASE_TABLES} />
        <GrowthSystemBoard layers={GROWTH_LAYERS} />
        <GamificationBoard mechanics={GAME_MECHANICS} />
      </div>
    </AppShell>
  );
}
