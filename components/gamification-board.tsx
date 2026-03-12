import { GameMechanic } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function GamificationBoard({ mechanics }: { mechanics: GameMechanic[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>5. 为什么练习会更容易坚持</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 xl:grid-cols-2">
        {mechanics.map((mechanic) => (
          <div key={mechanic.id} className="rounded-[24px] border border-sky-100 bg-white/80 p-5 shadow-sm">
            <div className="text-lg font-semibold text-sky-950">{mechanic.title}</div>
            <p className="mt-3 text-sm leading-7 text-sky-800/80">{mechanic.summary}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {mechanic.rewards.map((reward) => (
                <span key={reward} className="rounded-full bg-white px-3 py-1 text-xs text-sky-700 shadow-sm">
                  {reward}
                </span>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
