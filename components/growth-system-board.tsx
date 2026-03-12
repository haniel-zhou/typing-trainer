import { GrowthLayer } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function GrowthSystemBoard({ layers }: { layers: GrowthLayer[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>4. 用户成长系统</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 xl:grid-cols-3">
        {layers.map((layer) => (
          <div key={layer.id} className="rounded-[24px] border border-sky-100 bg-white/80 p-5 shadow-sm">
            <div className="text-lg font-semibold text-sky-950">{layer.title}</div>
            <p className="mt-3 text-sm leading-7 text-sky-800/80">{layer.summary}</p>
            <div className="mt-4 space-y-2">
              {layer.loops.map((loop) => (
                <div key={loop} className="rounded-[18px] bg-sky-50/80 px-3 py-2 text-sm text-sky-800">
                  {loop}
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
