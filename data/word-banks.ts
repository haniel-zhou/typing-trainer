import { WordBankPreset } from "@/lib/types";

export const WORD_BANK_PRESETS: WordBankPreset[] = [
  {
    id: "programming-core",
    title: "编程高频词",
    description: "变量、接口、异步和调试相关的常见术语，适合程序员日常练习。",
    category: "programming",
    accent: "from-sky-500/20 to-cyan-400/20",
    terms: [
      "function",
      "variable",
      "component",
      "interface",
      "promise",
      "async",
      "render",
      "deploy",
      "request",
      "response",
      "database",
      "debug"
    ]
  },
  {
    id: "medical-core",
    title: "医学术语词库",
    description: "门诊记录、检查结果和病历写作里常见的英文术语组合。",
    category: "medical",
    accent: "from-emerald-500/20 to-teal-400/20",
    terms: [
      "diagnosis",
      "symptom",
      "patient",
      "therapy",
      "vitals",
      "dosage",
      "prescription",
      "monitoring",
      "recovery",
      "clinical",
      "report",
      "referral"
    ]
  },
  {
    id: "business-core",
    title: "商务沟通词库",
    description: "开会、邮件和项目推进中反复输入的高频商务表达。",
    category: "business",
    accent: "from-amber-500/20 to-orange-400/20",
    terms: [
      "deadline",
      "meeting",
      "follow-up",
      "proposal",
      "schedule",
      "roadmap",
      "delivery",
      "budget",
      "contract",
      "priority",
      "feedback",
      "summary"
    ]
  },
  {
    id: "daily-core",
    title: "日常英语词库",
    description: "适合新手建立节奏的日常高频词，偏轻松、重复率高。",
    category: "daily",
    accent: "from-fuchsia-500/20 to-rose-400/20",
    terms: [
      "morning",
      "people",
      "always",
      "little",
      "family",
      "before",
      "better",
      "simple",
      "travel",
      "future",
      "window",
      "listen"
    ]
  }
];
