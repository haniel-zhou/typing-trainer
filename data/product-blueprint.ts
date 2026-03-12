import {
  DatabaseTableSpec,
  GameMechanic,
  GrowthLayer,
  ProductCapabilitySection,
  ProductPageNode
} from "@/lib/types";

export const PRODUCT_CAPABILITIES: ProductCapabilitySection[] = [
  {
    id: "core-training",
    title: "核心训练",
    description: "每次打开网页，你都能立刻知道现在该练什么、重点是什么、这一轮结束后会得到什么反馈。",
    items: [
      { title: "课程关卡", detail: "从基准键到单词、句子逐级推进，就算是零基础也能按节奏慢慢上手。", status: "ready" },
      { title: "个性化词库", detail: "支持编程、医学、商务和自定义术语导入，让练习内容更贴近你的学习和工作场景。", status: "ready" },
      { title: "实时纠错", detail: "不只告诉你哪里错了，还会区分常见错误类型，帮你更快找到需要纠正的习惯。", status: "ready" }
    ]
  },
  {
    id: "efficiency-intelligence",
    title: "效率与智能",
    description: "除了练字，这一套系统也会尽量帮你把输入效率、复盘效率和跨设备使用体验一起补齐。",
    items: [
      { title: "多端云同步", detail: "训练记录、好友关系和榜单数据可以跨设备同步，换一台设备也能接着练。", status: "ready" },
      { title: "数据分析", detail: "速度曲线、热力图、错误热键和阶段建议会帮你把“感觉有进步”变成“看得见的进步”。", status: "ready" },
      { title: "输入辅助", detail: "在自由练习里可以按需开启输入辅助，既不影响正式训练，也能照顾高频输入场景。", status: "ready" }
    ]
  },
  {
    id: "social-competition",
    title: "社交与竞技",
    description: "想一个人慢慢练可以，想和朋友一起冲榜、对战、比较成绩也可以。",
    items: [
      { title: "好友邀请", detail: "普通链接就能发到微信、QQ 或浏览器，对方点开后就能直接进入网页使用。", status: "ready" },
      { title: "好友对战", detail: "同一段文本直接比速度和正确率，还能生成专属对战链接和结果卡。", status: "ready" },
      { title: "赛季排行榜", detail: "可以看赛季积分、好友榜和 Boss 挑战，给长期练习一个更明确的目标。", status: "ready" }
    ]
  },
  {
    id: "accessibility",
    title: "辅助与无障碍",
    description: "长时间练习要舒服、操作要轻松，最好还能用更自然的方式和网页交流。",
    items: [
      { title: "护眼 / 夜间主题", detail: "训练页可以在默认、护眼、夜间之间切换，长时间打字时更舒服。", status: "ready" },
      { title: "节奏音效", detail: "按键音、上传音乐和节拍训练可以增强沉浸感，让练习不那么枯燥。", status: "ready" },
      { title: "语音辅助", detail: "支持词库语音录入和全站语音指令，能更自然地打开页面、开始训练或切换功能。", status: "ready" }
    ]
  }
];

export const PRODUCT_PAGES: ProductPageNode[] = [
  {
    id: "home",
    title: "首页 / 产品仪表盘",
    goal: "你一进来就能看到今天适合做什么、现在练到哪里、继续下去会有什么收获。",
    route: "/",
    modules: ["每日签到", "成就墙", "课程路线", "今日任务", "产品蓝图入口"]
  },
  {
    id: "lessons",
    title: "课程页",
    goal: "把学习路径讲清楚，让你知道下一步该练哪一关、为什么要练这一关。",
    route: "/lessons",
    modules: ["课程关卡卡片", "目标速度", "目标正确率", "通关状态"]
  },
  {
    id: "trainer",
    title: "练习页",
    goal: "这是你停留最久的地方，重点是沉浸、反馈及时、打起来顺手而且有节奏感。",
    route: "/trainer",
    modules: ["目标文本", "输入区", "实时数据", "错误分析", "音乐节奏", "退出 / 暂停", "智能补全", "语音控制"]
  },
  {
    id: "custom",
    title: "词库与自定义页",
    goal: "把练习内容从普通文章升级成你真的会用到的专业术语、工作词汇和高频表达。",
    route: "/custom",
    modules: ["专业词库模板", "术语导入", "语音录入", "我的词库", "自定义练习列表", "云同步词库"]
  },
  {
    id: "challenge",
    title: "挑战页",
    goal: "如果你想练得更有目标，这里会用榜单、Boss 和限时挑战把节奏拉起来。",
    route: "/challenge",
    modules: ["好友榜", "全球榜", "赛季榜", "Boss 挑战", "个人成绩插入"]
  },
  {
    id: "season",
    title: "赛季页",
    goal: "这里会把你的赛季段位、Boss 奖励、挑战回顾和成就进度集中展示出来。",
    route: "/season",
    modules: ["赛季回顾", "Boss 奖励进度", "赛季奖励", "成就墙"]
  },
  {
    id: "friends",
    title: "好友页",
    goal: "把链接发给朋友，对方点开就能用，一起练、一起比、一起冲榜会更有动力。",
    route: "/friends",
    modules: ["邀请链接", "多端适配说明", "好友列表", "好友主页入口"]
  },
  {
    id: "stats",
    title: "成长页",
    goal: "把每次练习都变成清楚的成长记录，让你知道自己到底快了多少、稳了多少。",
    route: "/stats",
    modules: ["速度曲线", "热力图", "错误热键", "平均速度", "练习时长", "建议"]
  },
  {
    id: "product",
    title: "产品蓝图页",
    goal: "如果你想更系统地了解这套产品，这一页会把功能、页面、成长和游戏机制一次看清。",
    route: "/product",
    modules: ["功能结构图", "页面结构图", "数据库设计", "成长闭环", "游戏化机制"]
  }
];

export const DATABASE_TABLES: DatabaseTableSpec[] = [
  {
    name: "profiles",
    purpose: "保存你的公开主页和成长摘要，让好友、分享页和排行榜都能读到一致的数据。",
    stage: "online",
    fields: ["share_code", "name", "best_wpm", "best_accuracy", "average_wpm", "total_duration", "total_sessions", "updated_at"]
  },
  {
    name: "training_records",
    purpose: "记录每一次训练结果，是生成成长曲线、排行榜和训练复盘的基础。",
    stage: "online",
    fields: ["id", "share_code", "lesson_id", "challenge_id", "duel_id", "title", "mode", "accuracy", "wpm", "duration", "correct_chars", "wrong_chars", "xp_gained", "stars", "error_analysis", "created_at"]
  },
  {
    name: "friends",
    purpose: "保存好友关系和邀请来源，方便你分享链接、加好友和发起对战。",
    stage: "online",
    fields: ["owner_share_code", "friend_share_code", "friend_name", "source", "joined_at", "invite_url"]
  },
  {
    name: "duels",
    purpose: "保存每一场好友对战的主题、文本和规则，让对战结果能被复盘和分享。",
    stage: "online",
    fields: ["id", "title", "description", "content", "goal_accuracy", "goal_wpm", "time_limit_seconds", "challenger_share_code", "opponent_share_code", "created_at"]
  },
  {
    name: "duel_attempts",
    purpose: "记录对战双方成绩，用于结算、对比和结果分享。",
    stage: "online",
    fields: ["id", "duel_id", "share_code", "name", "accuracy", "wpm", "duration", "correct_chars", "wrong_chars", "created_at"]
  },
  {
    name: "word_banks",
    purpose: "同步你的专业词库和自定义练习内容，让这些内容在不同设备上都能继续使用。",
    stage: "online",
    fields: ["id", "share_code", "title", "category", "terms", "source", "created_at"]
  },
  {
    name: "check_ins",
    purpose: "记录每日签到和奖励领取情况，让连续训练更有反馈。",
    stage: "next",
    fields: ["id", "share_code", "check_in_date", "reward_xp", "reward_coins", "created_at"]
  },
  {
    name: "achievement_unlocks",
    purpose: "保存你的成就解锁进度，让徽章和奖励在不同设备上保持一致。",
    stage: "next",
    fields: ["id", "share_code", "achievement_id", "unlocked_at", "meta"]
  },
  {
    name: "daily_mission_claims",
    purpose: "同步每日任务领取状态，避免换设备后任务奖励丢失。",
    stage: "online",
    fields: ["id", "share_code", "mission_date", "mission_id", "created_at"]
  }
];

export const GROWTH_LAYERS: GrowthLayer[] = [
  {
    id: "practice-loop",
    title: "单次练习闭环",
    summary: "每一轮训练结束后，你都能立刻知道自己打得怎样、哪里出了问题、下一轮该怎么改。",
    loops: ["实时 WPM / 正确率", "错误类型提示", "经验与金币结算", "本关目标达成反馈"]
  },
  {
    id: "daily-loop",
    title: "每日习惯闭环",
    summary: "每天回来都应该有明确的事可做，而且这些小目标能被积累下来，慢慢变成习惯。",
    loops: ["每日签到", "今日任务", "连续训练天数", "短时目标建议"]
  },
  {
    id: "season-loop",
    title: "长期成长闭环",
    summary: "就算练了几周甚至几个月，你也依然能感觉到升级、冲榜和解锁奖励的动力。",
    loops: ["等级与经验", "成就墙", "好友榜与全球榜", "赛季挑战与段位"]
  }
];

export const GAME_MECHANICS: GameMechanic[] = [
  {
    id: "combo-flow",
    title: "连击流",
    summary: "输入越稳定，连击越高，视觉和节拍反馈也会更强，让每一轮都更有手感。",
    rewards: ["高连击视觉反馈", "额外经验", "更高结算评价"]
  },
  {
    id: "daily-missions",
    title: "每日任务",
    summary: "围绕速度、正确率和训练时长给出当天任务，帮你减少“今天到底练什么”的犹豫。",
    rewards: ["每日金币", "任务徽章", "签到加成"]
  },
  {
    id: "boss-challenges",
    title: "Boss 挑战",
    summary: "把困难文本、限时赛和专项词库包装成阶段 Boss，让高难度训练更有目标感。",
    rewards: ["限定称号", "挑战徽章", "排行榜冲榜分"]
  },
  {
    id: "duel-mode",
    title: "好友对战",
    summary: "通过专属链接把训练变成一场对战，让分享更自然，也让练习更有张力。",
    rewards: ["对战胜场", "好友榜提升", "专属对战纪念卡"]
  }
];
