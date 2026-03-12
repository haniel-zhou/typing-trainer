import { ProductPageNode } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProductPageMap({ pages }: { pages: ProductPageNode[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>2. 你可以怎么使用这套产品</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {pages.map((page) => (
          <div key={page.id} className="rounded-[24px] border border-sky-100 bg-white/80 p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-lg font-semibold text-sky-950">{page.title}</div>
                <div className="mt-1 text-sm text-sky-600/75">{page.route}</div>
              </div>
              <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                页面目标
              </span>
            </div>
            <p className="mt-3 text-sm leading-7 text-sky-800/80">{page.goal}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {page.modules.map((module) => (
                <span key={module} className="rounded-full bg-white px-3 py-1 text-xs text-sky-700 shadow-sm">
                  {module}
                </span>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
