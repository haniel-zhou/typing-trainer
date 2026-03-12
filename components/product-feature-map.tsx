import { ProductCapabilitySection } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function statusTone(status: "ready" | "building" | "planned") {
  if (status === "ready") return "bg-emerald-50 text-emerald-700";
  if (status === "building") return "bg-amber-50 text-amber-700";
  return "bg-slate-100 text-slate-700";
}

export function ProductFeatureMap({ sections }: { sections: ProductCapabilitySection[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>1. 完整功能结构图</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 xl:grid-cols-2">
        {sections.map((section) => (
          <div key={section.id} className="rounded-[24px] border border-sky-100 bg-white/80 p-5 shadow-sm">
            <div className="text-lg font-semibold text-sky-950">{section.title}</div>
            <p className="mt-2 text-sm leading-7 text-sky-800/80">{section.description}</p>
            <div className="mt-4 space-y-3">
              {section.items.map((item) => (
                <div key={item.title} className="rounded-[20px] bg-sky-50/80 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="font-semibold text-sky-950">{item.title}</div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone(item.status)}`}>
                      {item.status === "ready" ? "已上线" : item.status === "building" ? "建设中" : "规划中"}
                    </span>
                  </div>
                  <div className="mt-2 text-sm leading-7 text-sky-800/80">{item.detail}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
