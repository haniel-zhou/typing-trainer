import { VoiceCommandAction, VoiceIntent } from "@/lib/types";

const ROUTE_INTENTS = [
  { label: "首页", route: "/", nouns: ["首页", "主页", "主界面"] },
  { label: "课程", route: "/lessons", nouns: ["课程", "课表", "学习路线"] },
  { label: "训练", route: "/trainer?lesson=1", nouns: ["训练", "练习", "打字", "自由训练"] },
  { label: "挑战", route: "/challenge", nouns: ["挑战", "排行榜", "冲榜", "boss"] },
  { label: "好友", route: "/friends", nouns: ["好友", "朋友", "邀请"] },
  { label: "自定义", route: "/custom", nouns: ["自定义", "词库", "术语"] },
  { label: "成长", route: "/stats", nouns: ["成长", "统计", "数据", "成绩"] },
  { label: "赛季", route: "/season", nouns: ["赛季", "段位", "结算"] },
  { label: "产品", route: "/product", nouns: ["产品", "蓝图", "结构图"] }
] as const;

const NAV_VERBS = ["打开", "进入", "去", "切到", "跳到", "带我去", "前往", "看看", "回到"];

const TRAINER_ACTIONS: Array<{
  action: VoiceCommandAction;
  label: string;
  phrases: string[];
}> = [
  { action: "pause", label: "暂停训练", phrases: ["暂停训练", "先暂停一下", "停一下", "我想暂停", "休息一下", "别打了"] },
  { action: "resume", label: "继续训练", phrases: ["继续训练", "继续吧", "恢复训练", "接着打", "继续输入"] },
  { action: "reset", label: "重新开始", phrases: ["重新开始", "重来一次", "从头开始", "清空重来", "再来一轮"] },
  { action: "exit", label: "退出训练", phrases: ["退出训练", "离开训练", "返回课程", "回挑战页", "不练了"] },
  { action: "theme-eye-care", label: "切换护眼", phrases: ["切换护眼", "护眼模式", "柔和一点", "眼睛舒服一点", "暖色模式"] },
  { action: "theme-night", label: "切换夜间", phrases: ["切换夜间", "夜间模式", "暗一点", "深色一点", "黑一点"] },
  { action: "theme-default", label: "切换默认", phrases: ["切换默认", "默认模式", "恢复默认", "亮一点", "回正常模式"] },
  { action: "accept-suggestion", label: "接受补全", phrases: ["接受补全", "帮我补全", "把这个词补完", "用智能补全", "自动补全一下"] }
];

const CHINESE_NUMBERS: Record<string, number> = {
  一: 1,
  二: 2,
  三: 3,
  四: 4,
  五: 5,
  六: 6,
  七: 7,
  八: 8,
  九: 9,
  十: 10
};

type RouteMatch = {
  label: string;
  route: string;
  confidence: number;
};

function normalize(rawText: string) {
  return rawText.replace(/[，。！？、；：“”"'`~,.!?;:\s]/g, "");
}

function includesAny(text: string, phrases: readonly string[]) {
  return phrases.some((phrase) => text.includes(phrase));
}

function resolveLessonNumber(text: string) {
  const digitMatch = text.match(/第?(\d+)关/);
  if (digitMatch) {
    return Number(digitMatch[1]);
  }

  const chineseMatch = text.match(/第?([一二三四五六七八九十])关/);
  if (chineseMatch) {
    return CHINESE_NUMBERS[chineseMatch[1]] ?? null;
  }

  return null;
}

function scoreRouteIntent(text: string, nouns: readonly string[]) {
  const hasNoun = includesAny(text, nouns);
  const hasVerb = includesAny(text, NAV_VERBS);
  if (hasNoun && hasVerb) return 0.96;
  if (hasNoun) return 0.78;
  return 0;
}

export function parseVoiceIntent(rawText: string): VoiceIntent {
  const text = normalize(rawText);
  if (!text) {
    return { kind: "unknown", label: "没有识别到有效内容", confidence: 0 };
  }

  const lessonNumber = resolveLessonNumber(text);
  if (
    lessonNumber &&
    includesAny(text, ["开始", "练", "训练", "闯关", "进入", "打开", "我想练", "带我去"])
  ) {
    return {
      kind: "route",
      label: `开始第 ${lessonNumber} 关`,
      confidence: 0.98,
      route: `/trainer?lesson=${lessonNumber}`
    };
  }

  if (includesAny(text, ["开始训练", "开始练习", "我想打字", "我要练习", "带我去训练"])) {
    return {
      kind: "route",
      label: "进入训练",
      confidence: 0.94,
      route: "/trainer?lesson=1"
    };
  }

  for (const item of TRAINER_ACTIONS) {
    if (includesAny(text, item.phrases)) {
      return {
        kind: "trainer",
        label: item.label,
        confidence: 0.94,
        action: item.action
      };
    }
  }

  let bestRoute: RouteMatch | null = null;
  for (const item of ROUTE_INTENTS) {
    const confidence = scoreRouteIntent(text, item.nouns);
    if ((!bestRoute || confidence > bestRoute.confidence) && confidence > 0) {
      bestRoute = { label: `打开${item.label}`, route: item.route, confidence };
    }
  }

  if (bestRoute) {
    return {
      kind: "route",
      label: bestRoute.label,
      confidence: bestRoute.confidence,
      route: bestRoute.route
    };
  }

  return {
    kind: "unknown",
    label: `没听懂“${rawText}”`,
    confidence: 0.22
  };
}
