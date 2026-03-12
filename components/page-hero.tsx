import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description: string;
  aside?: ReactNode;
};

export function PageHero({ eyebrow, title, description, aside }: PageHeroProps) {
  return (
    <Card className="page-intro overflow-hidden">
      <CardContent className="grid gap-6 p-6 md:p-8 xl:grid-cols-[1.15fr_0.85fr] xl:items-center">
        <div className="space-y-4">
          {eyebrow ? (
            <div className="inline-flex rounded-full bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700 shadow-sm">
              {eyebrow}
            </div>
          ) : null}
          <div className="space-y-3">
            <CardTitle className="text-3xl md:text-4xl">{title}</CardTitle>
            <p className="max-w-3xl text-sm leading-8 text-sky-800/80 md:text-base">
              {description}
            </p>
          </div>
        </div>
        {aside ? <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-1">{aside}</div> : null}
      </CardContent>
    </Card>
  );
}
