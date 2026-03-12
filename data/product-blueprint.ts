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
    description: "让用户每次打开网页都知道该练什么、为什么练、练完会得到什么。",
    items: [
      { title: "课程关卡", detail: "从基准键到句子逐级推进，确保新手不被直接劝退。", status: "ready" },
      { title: "个性化词库", detail: "支持编程、医学、商务和自定义术语导入，训练贴近真实输入场景。", status: "ready" },
      { title: "实时纠错", detail: "区分相邻键偏移、空格节奏、顺序颠倒等错误类型，并给出纠正建议。", status: "ready" }
    ]
  },
  {
    id: "efficiency-intelligence",
    title: "效率与智能",
    description: "除了练字，更要让 Typing Trainer 变成输入效率加速器。",
    items: [
      { title: "多端云同步", detail: "训练记录、好友关系和排行榜优先走云端，本地也可降级使用。", status: "ready" },
      { title: "数据分析", detail: "速度曲线、热力图、错误热键和阶段建议，帮助用户量化进步。", status: "ready" },
      { title: "智能联想补全", detail: "训练页已支持词级和短语级补全，既保留练习感，也能把高频输入迁移到真实工作流。", status: "ready" }
    ]
  },
  {
    id: "social-competition",
    title: "社交与竞技",
    description: "让用户有理由回来，也有对象可以超越。",
    items: [
      { title: "好友邀请", detail: "普通链接就能发给微信、QQ、浏览器，对方点开即可加入。", status: "ready" },
      { title: "好友对战", detail: "同一段文本直接对战，生成专属对战链接和成绩卡。", status: "ready" },
      { title: "赛季排行榜", detail: "已经支持赛季段位、赛季榜和 Boss 挑战入口，后续继续扩月度赛区。", status: "ready" }
    ]
  },
  {
    id: "accessibility",
    title: "辅助与无障碍",
    description: "让长时间练习更舒服，也让更多人能用起来。",
    items: [
      { title: "护眼 / 夜间主题", detail: "训练页可在默认、护眼、夜间之间切换。", status: "ready" },
      { title: "节奏音效", detail: "按键音、上传音乐和节拍训练增强沉浸感。", status: "ready" },
      { title: "语音辅助", detail: "现在支持词库语音录入和全站语音指令，可直接打开页面、开始训练、暂停和切换主题。", status: "ready" }
    ]
  }
];

export const PRODUCT_PAGES: ProductPageNode[] = [
  {
    id: "home",
    title: "首页 / 产品仪表盘",
    goal: "把用户留在系统里，告诉他今天该练什么、为什么值得继续。",
    route: "/",
    modules: ["每日签到", "成就墙", "课程路线", "今日任务", "产品蓝图入口"]
  },
  {
    id: "lessons",
    title: "课程页",
    goal: "展示完整学习路径，帮助新手理解下一步怎么升级。",
    route: "/lessons",
    modules: ["课程关卡卡片", "目标速度", "目标正确率", "通关状态"]
  },
  {
    id: "trainer",
    title: "练习页",
    goal: "用户停留最久的核心舞台，负责沉浸、反馈和爽感。",
    route: "/trainer",
    modules: ["目标文本", "输入区", "实时数据", "错误分析", "音乐节奏", "退出 / 暂停", "智能补全", "语音控制"]
  },
  {
    id: "custom",
    title: "词库与自定义页",
    goal: "让训练内容从随机文章升级为真实工作和学习语料。",
    route: "/custom",
    modules: ["专业词库模板", "术语导入", "语音录入", "我的词库", "自定义练习列表", "云同步词库"]
  },
  {
    id: "challenge",
    title: "挑战页",
    goal: "通过榜单和限时挑战引入竞争欲与阶段目标。",
    route: "/challenge",
    modules: ["好友榜", "全球榜", "赛季榜", "Boss 挑战", "个人成绩插入"]
  },
  {
    id: "season",
    title: "赛季页",
    goal: "把当前赛季段位、Boss 奖励、挑战回顾和成就进度收拢到一个入口。",
    route: "/season",
    modules: ["赛季回顾", "Boss 奖励进度", "赛季奖励", "成就墙"]
  },
  {
    id: "friends",
    title: "好友页",
    goal: "低门槛拉人进来，形成分享和社交扩散。",
    route: "/friends",
    modules: ["邀请链接", "多端适配说明", "好友列表", "好友主页入口"]
  },
  {
    id: "stats",
    title: "成长页",
    goal: "把练习结果变成可视化进步，提升留存和复练率。",
    route: "/stats",
    modules: ["速度曲线", "热力图", "错误热键", "平均速度", "练习时长", "建议"]
  },
  {
    id: "product",
    title: "产品蓝图页",
    goal: "统一展示完整功能结构、页面结构、数据库设计、成长系统和游戏机制。",
    route: "/product",
    modules: ["功能结构图", "页面结构图", "数据库设计", "成长闭环", "游戏化机制"]
  }
];

export const DATABASE_TABLES: DatabaseTableSpec[] = [
  {
    name: "profiles",
    purpose: "存储用户公开主页与成长汇总数据。",
    stage: "online",
    fields: ["share_code", "name", "best_wpm", "best_accuracy", "average_wpm", "total_duration", "total_sessions", "updated_at"]
  },
  {
    name: "training_records",
    purpose: "记录每一次训练的详细结果，是成长、榜单和复盘的基础。",
    stage: "online",
    fields: ["id", "share_code", "lesson_id", "challenge_id", "duel_id", "title", "mode", "accuracy", "wpm", "duration", "correct_chars", "wrong_chars", "xp_gained", "stars", "error_analysis", "created_at"]
  },
  {
    name: "friends",
    purpose: "保存好友关系与邀请来源，支持好友榜和对战邀请。",
    stage: "online",
    fields: ["owner_share_code", "friend_share_code", "friend_name", "source", "joined_at", "invite_url"]
  },
  {
    name: "duels",
    purpose: "定义好友对战场次和对战文本。",
    stage: "online",
    fields: ["id", "title", "description", "content", "goal_accuracy", "goal_wpm", "time_limit_seconds", "challenger_share_code", "opponent_share_code", "created_at"]
  },
  {
    name: "duel_attempts",
    purpose: "保存每场对战双方成绩，用于大厅结算和复盘。",
    stage: "online",
    fields: ["id", "duel_id", "share_code", "name", "accuracy", "wpm", "duration", "correct_chars", "wrong_chars", "created_at"]
  },
  {
    name: "word_banks",
    purpose: "云同步专业词库和自定义高频语料，让训练内容跨设备复用。",
    stage: "online",
    fields: ["id", "share_code", "title", "category", "terms", "source", "created_at"]
  },
  {
    name: "check_ins",
    purpose: "记录每日签到和奖励领取情况，支撑连续习惯培养。",
    stage: "next",
    fields: ["id", "share_code", "check_in_date", "reward_xp", "reward_coins", "created_at"]
  },
  {
    name: "achievement_unlocks",
    purpose: "存储成就解锁状态，用于跨设备同步展示。",
    stage: "next",
    fields: ["id", "share_code", "achievement_id", "unlocked_at", "meta"]
  },
  {
    name: "daily_mission_claims",
    purpose: "同步每日任务领取状态，避免换设备后奖励进度丢失。",
    stage: "online",
    fields: ["id", "share_code", "mission_date", "mission_id", "created_at"]
  }
];

export const GROWTH_LAYERS: GrowthLayer[] = [
  {
    id: "practice-loop",
    title: "单次练习闭环",
    summary: "每一轮训练都要给用户明确反馈：打得怎样、哪里错了、下一轮该怎么改。",
    loops: ["实时 WPM / 正确率", "错误类型提示", "经验与金币结算", "本关目标达成反馈"]
  },
  {
    id: "daily-loop",
    title: "每日习惯闭环",
    summary: "用户每天回来要有理由，最好是可领取、可完成、可积累的任务。",
    loops: ["每日签到", "今日任务", "连续训练天数", "短时目标建议"]
  },
  {
    id: "season-loop",
    title: "长期成长闭环",
    summary: "让用户在数周甚至数月内仍然有升级感，而不是练几次就流失。",
    loops: ["等级与经验", "成就墙", "好友榜与全球榜", "赛季挑战与段位"]
  }
];

export const GAME_MECHANICS: GameMechanic[] = [
  {
    id: "combo-flow",
    title: "连击流",
    summary: "输入越稳定，连击越高，粒子和节拍反馈越强，强化即时爽感。",
    rewards: ["高连击视觉反馈", "额外经验", "更高结算评价"]
  },
  {
    id: "daily-missions",
    title: "每日任务",
    summary: "围绕速度、正确率和训练时长生成任务，降低用户不知道练什么的成本。",
    rewards: ["每日金币", "任务徽章", "签到加成"]
  },
  {
    id: "boss-challenges",
    title: "Boss 挑战",
    summary: "把困难文本、限时赛和专项词库包装成阶段 Boss，提高趣味性。",
    rewards: ["限定称号", "挑战徽章", "排行榜冲榜分"]
  },
  {
    id: "duel-mode",
    title: "好友对战",
    summary: "通过专属链接把训练变成对战，制造分享动机和竞技压力。",
    rewards: ["对战胜场", "好友榜提升", "专属对战纪念卡"]
  }
];
