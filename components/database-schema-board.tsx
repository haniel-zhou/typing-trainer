import { DatabaseTableSpec } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DatabaseSchemaBoard({ tables }: { tables: DatabaseTableSpec[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>3. 你的数据会怎么被保存</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 xl:grid-cols-2">
        {tables.map((table) => (
          <div key={table.name} className="rounded-[24px] border border-sky-100 bg-white/80 p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="font-display text-2xl text-sky-950">{table.name}</div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  table.stage === "online" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                }`}
              >
                {table.stage === "online" ? "在线结构" : "下一阶段"}
              </span>
            </div>
            <p className="mt-3 text-sm leading-7 text-sky-800/80">{table.purpose}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {table.fields.map((field) => (
                <span key={field} className="rounded-full bg-sky-50 px-3 py-1 text-xs text-sky-700">
                  {field}
                </span>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
