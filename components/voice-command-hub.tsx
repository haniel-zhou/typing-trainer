"use client";

import { startTransition, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Mic, MicOff, Sparkles, Speech } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VoiceCommandAction, VoiceIntent } from "@/lib/types";
import { parseVoiceIntent } from "@/lib/voice";

const DIRECT_EXECUTION_CONFIDENCE = 0.88;
const CONFIRMATION_CONFIDENCE = 0.65;

type SpeechRecognitionInstance = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionEvent = {
  results: ArrayLike<{
    0: { transcript: string };
  }>;
};

type SpeechWindow = Window & {
  SpeechRecognition?: new () => SpeechRecognitionInstance;
  webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
};

function getSpeechRecognitionConstructor() {
  if (typeof window === "undefined") return null;

  return (
    (window as SpeechWindow).SpeechRecognition ??
    (window as SpeechWindow).webkitSpeechRecognition ??
    null
  );
}

export function VoiceCommandHub({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [supported] = useState(() => Boolean(getSpeechRecognitionConstructor()));
  const [listening, setListening] = useState(false);
  const [hint, setHint] = useState("直接说自然话就行，例如：帮我打开成长统计、我想练第二关、先暂停一下。");
  const [lastIntent, setLastIntent] = useState<VoiceIntent | null>(null);
  const [pendingIntent, setPendingIntent] = useState<VoiceIntent | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const pendingRouteRef = useRef<{
    route: string;
    label: string;
    rawText: string;
  } | null>(null);
  const routeFallbackTimerRef = useRef<number | null>(null);

  const commandHelp = useMemo(
    () => ["帮我打开成长统计", "我想练第二关", "先暂停一下", "切到护眼模式", "帮我查一下我现在的段位"],
    []
  );

  useEffect(() => {
    const SpeechRecognition = getSpeechRecognitionConstructor();

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "zh-CN";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("")
        .trim();

      handleTranscript(transcript);
    };
    recognition.onend = () => {
      setListening(false);
      if (pendingRouteRef.current) {
        const pendingRoute = pendingRouteRef.current;
        pendingRouteRef.current = null;
        executeRoute(pendingRoute.route, pendingRoute.label, pendingRoute.rawText);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      if (routeFallbackTimerRef.current) {
        window.clearTimeout(routeFallbackTimerRef.current);
      }
    };
  }, []);

  function emitActionCommand(action: VoiceCommandAction) {
    window.dispatchEvent(new CustomEvent("app-voice-command", { detail: { action } }));
    window.dispatchEvent(new CustomEvent("trainer-command", { detail: { action } }));
  }

  function clearPendingIntent() {
    pendingRouteRef.current = null;
    setPendingIntent(null);
  }

  function executeRoute(route: string, label: string, rawText: string) {
    if (routeFallbackTimerRef.current) {
      window.clearTimeout(routeFallbackTimerRef.current);
      routeFallbackTimerRef.current = null;
    }

    const nextUrl = new URL(route, window.location.origin);
    const currentUrl = `${window.location.pathname}${window.location.search}`;
    const targetUrl = `${nextUrl.pathname}${nextUrl.search}`;

    if (currentUrl === targetUrl) {
      router.refresh();
      clearPendingIntent();
      setHint(`已识别“${rawText}” -> ${label}，当前已经在这个页面。`);
      return;
    }

    clearPendingIntent();
    setHint(`已识别“${rawText}” -> ${label}，正在执行。`);
    startTransition(() => router.push(route));

    routeFallbackTimerRef.current = window.setTimeout(() => {
      const latestUrl = `${window.location.pathname}${window.location.search}`;
      if (latestUrl !== targetUrl) {
        window.location.assign(route);
      }
    }, 450);
  }

  function executeTrainerAction(action: VoiceCommandAction, label: string, rawText: string) {
    clearPendingIntent();
    emitActionCommand(action);
    setHint(`已识别“${rawText}” -> ${label}，正在执行。`);
  }

  function confirmPendingIntent() {
    if (!pendingIntent) {
      setHint("当前没有待确认的语音动作。");
      return;
    }

    if (pendingIntent.kind === "route") {
      executeRoute(pendingIntent.route, pendingIntent.label, "确认");
      return;
    }

    if (pendingIntent.kind === "trainer") {
      executeTrainerAction(pendingIntent.action, pendingIntent.label, "确认");
    }
  }

  function cancelPendingIntent() {
    if (!pendingIntent) {
      setHint("当前没有待取消的语音动作。");
      return;
    }
    clearPendingIntent();
    setHint("已取消刚才的语音操作。");
  }

  function handleTranscript(rawText: string) {
    const intent = parseVoiceIntent(rawText);
    setLastIntent(intent);

    if (intent.kind === "confirm") {
      confirmPendingIntent();
      return;
    }

    if (intent.kind === "cancel") {
      cancelPendingIntent();
      return;
    }

    if (intent.kind === "route") {
      if (intent.confidence >= DIRECT_EXECUTION_CONFIDENCE) {
        pendingRouteRef.current = {
          route: intent.route,
          label: intent.label,
          rawText
        };
        setPendingIntent(null);
        setHint(`已识别“${rawText}” -> ${intent.label}，准备执行。`);
        recognitionRef.current?.stop();
        return;
      }

      if (intent.confidence >= CONFIRMATION_CONFIDENCE) {
        pendingRouteRef.current = null;
        setPendingIntent(intent);
        setHint(`我猜你是想${intent.label}。说“确认”或点下方按钮执行，说“取消”放弃。`);
        return;
      }

      clearPendingIntent();
      setHint(`我听到了“${rawText}”，但还不够确定。可以换一种更明确的说法，例如：${commandHelp.join("、")}。`);
      return;
    }

    if (intent.kind === "trainer") {
      if (intent.confidence >= DIRECT_EXECUTION_CONFIDENCE) {
        executeTrainerAction(intent.action, intent.label, rawText);
        return;
      }

      if (intent.confidence >= CONFIRMATION_CONFIDENCE) {
        setPendingIntent(intent);
        setHint(`我猜你是想${intent.label}。说“确认”或点下方按钮执行，说“取消”放弃。`);
        return;
      }

      clearPendingIntent();
      setHint(`我听到了“${rawText}”，但还不够确定。可以试试：${commandHelp.join("、")}。`);
      return;
    }

    clearPendingIntent();
    setHint(`没听懂“${rawText}”。可以试试：${commandHelp.join("、")}。`);
  }

  function startListening() {
    if (!recognitionRef.current) return;
    recognitionRef.current.start();
    setListening(true);
    setHint("正在听指令…");
  }
  function toggleListening() {
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
      return;
    }
    startListening();
  }

  const pendingIntentLabel =
    pendingIntent?.kind === "route" || pendingIntent?.kind === "trainer" ? pendingIntent.label : null;

  if (!supported) return null;

  return (
    <div
      className={
        compact
          ? "flex min-w-0 items-center gap-2 rounded-2xl border border-sky-100 bg-sky-50/90 px-2 py-1.5"
          : "rounded-[22px] border border-sky-100 bg-sky-50/70 p-3"
      }
    >
      <div className={compact ? "hidden" : "mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-600"}>
        <Speech className="h-4 w-4" />
        语音指令
      </div>
      <div className={compact ? "flex min-w-0 items-center gap-2" : "flex items-center gap-3"}>
        <Button
          type="button"
          variant={listening ? "default" : "outline"}
          onClick={toggleListening}
          className={compact ? "gap-2 px-2.5 py-2 text-xs" : "gap-2 px-3 py-2 text-xs"}
        >
          {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          {listening ? "停止" : "语音"}
        </Button>
        <div className={compact ? "min-w-0 flex-1 text-xs leading-5 text-sky-700/80" : "min-w-0 flex-1 text-sm leading-6 text-sky-700/80"}>
          <div className={compact ? "truncate" : ""}>
            {compact ? "自然语言：打开成长 / 查段位 / 练第二关 / 暂停一下" : hint}
          </div>
          {pendingIntentLabel && !compact ? (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-sky-700">
                <Sparkles className="h-3.5 w-3.5" />
                待确认：{pendingIntentLabel}
              </div>
              <Button type="button" className="px-3 py-1.5 text-xs" onClick={confirmPendingIntent}>
                确认执行
              </Button>
              <Button type="button" variant="outline" className="px-3 py-1.5 text-xs" onClick={cancelPendingIntent}>
                取消
              </Button>
            </div>
          ) : null}
          {lastIntent && !compact ? (
            <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-sky-700">
              <Sparkles className="h-3.5 w-3.5" />
              当前识别：{lastIntent.label} · 置信度 {Math.round(lastIntent.confidence * 100)}%
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
