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
        eyebrow="Product blueprint"
        title="产品级 Typing Trainer 蓝图"
        description="这里把完整功能结构、页面结构、数据库设计、成长系统和游戏化机制统一收进一个页面。目标不是做一个单纯练字网页，而是做一套能长期留住用户、支持分享扩散和持续升级的产品。"
        aside={
          <>
            <div className="rounded-[24px] bg-white/75 p-4 shadow-sm">
              <div className="text-sm text-sky-600/70">产品定位</div>
              <div className="font-display text-3xl text-sky-950">练习工具 + 成长系统</div>
            </div>
            <div className="rounded-[24px] bg-white/75 p-4 shadow-sm">
              <div className="text-sm text-sky-600/70">核心抓手</div>
              <div className="font-display text-3xl text-sky-950">训练 / 留存 / 分享</div>
            </div>
            <div className="rounded-[24px] bg-white/75 p-4 shadow-sm">
              <div className="text-sm text-sky-600/70">产品目标</div>
              <div className="font-display text-3xl text-sky-950">每日可回访</div>
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
