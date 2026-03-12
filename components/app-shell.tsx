"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, BookOpen, ChartColumn, Crown, Keyboard, LayoutTemplate, Sparkles, Swords, Users, Wand2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VoiceCommandHub } from "@/components/voice-command-hub";
import { buttonStyles } from "@/components/ui/button";

export function AppShell({
  children,
  compact = false
}: {
  children: React.ReactNode;
  compact?: boolean;
}) {
  const pathname = usePathname();
  const navItems = [
    { href: "/", label: "首页", icon: Sparkles },
    { href: "/lessons", label: "课程", icon: BookOpen },
    { href: "/trainer", label: "训练", icon: Keyboard },
    { href: "/challenge", label: "挑战", icon: Swords },
    { href: "/friends", label: "好友", icon: Users },
    { href: "/custom", label: "自定义", icon: Wand2 },
    { href: "/season", label: "赛季", icon: Crown },
    { href: "/stats", label: "成长", icon: ChartColumn },
    { href: "/product", label: "产品", icon: LayoutTemplate }
  ];

  if (compact) {
    const compactActions = [
      { href: "/lessons", label: "课程", icon: BookOpen },
      { href: "/challenge", label: "挑战", icon: Swords },
      { href: "/stats", label: "成长", icon: ChartColumn }
    ];

    return (
      <div className="h-screen overflow-hidden p-2">
        <div className="flex h-full w-full min-w-0 flex-col gap-2">
          <Card className="shrink-0 overflow-hidden">
            <CardHeader className="px-3 py-2">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <Link
                    href="/lessons"
                    className={buttonStyles({
                      variant: "outline",
                      className: "gap-1.5 whitespace-nowrap px-2.5 py-1.5 text-xs"
                    })}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    返回课程
                  </Link>
                  <CardTitle className="flex min-w-0 items-center gap-2 text-base md:text-lg">
                    <span className="flex h-8 w-8 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 text-white shadow-lg">
                      <Keyboard className="h-4 w-4" />
                    </span>
                    <span className="truncate">训练模式</span>
                  </CardTitle>
                </div>

                <div className="hidden items-center gap-1.5 lg:flex">
                  {compactActions.map((item) => {
                    const Icon = item.icon;
                    const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={buttonStyles({
                          variant: active ? "default" : "outline",
                          className: "gap-1.5 whitespace-nowrap px-3 py-1.5 text-xs"
                        })}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>

                <div className="min-w-0 flex-1 lg:max-w-[420px]">
                  <VoiceCommandHub compact />
                </div>

                <div className="flex items-center gap-1.5 lg:hidden">
                  {compactActions.map((item) => {
                    const Icon = item.icon;
                    const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={buttonStyles({
                          variant: active ? "default" : "outline",
                          className: "gap-1.5 whitespace-nowrap px-2.5 py-1.5 text-xs"
                        })}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </CardHeader>
          </Card>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <Card className="shrink-0 overflow-hidden">
          <CardHeader className="relative">
            <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-sky-200 to-transparent" />
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-sky-100/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
                  <Sparkles className="h-3.5 w-3.5" />
                  Fun-first touch typing
                </div>
                <div className="space-y-2">
                  <CardTitle className="flex items-center gap-3 text-3xl md:text-4xl">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 text-white shadow-lg">
                      <Keyboard className="h-6 w-6" />
                    </span>
                    Typing Trainer
                  </CardTitle>
                  <p className="max-w-2xl text-sm leading-7 text-sky-800/80 md:text-base">
                    用分关课程、即时反馈和成长记录，把枯燥练习做成可以坚持的打字训练。
                  </p>
                </div>
              </div>
              <CardContent className="space-y-3 p-0">
                <div className="grid gap-2 sm:grid-cols-4 lg:grid-cols-8">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const active =
                      item.href === "/"
                        ? pathname === item.href
                        : pathname === item.href || pathname.startsWith(`${item.href}/`);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={buttonStyles({
                          variant: active ? "default" : "outline",
                          className: "gap-2 px-4 py-3"
                        })}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
                <VoiceCommandHub compact={compact} />
              </CardContent>
            </div>
          </CardHeader>
        </Card>
        {children}
      </div>
    </div>
  );
}
