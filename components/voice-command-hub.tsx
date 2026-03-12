"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Mic, MicOff, Sparkles, Speech } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VoiceCommandAction, VoiceIntent } from "@/lib/types";
import { parseVoiceIntent } from "@/lib/voice";

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
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const commandHelp = useMemo(
    () => ["帮我打开成长统计", "我想练第二关", "先暂停一下", "切到护眼模式"],
    []
  );

  const emitTrainerCommand = (action: VoiceCommandAction) => {
    window.dispatchEvent(new CustomEvent("trainer-command", { detail: { action } }));
  };

  const handleTranscript = (rawText: string) => {
    const intent = parseVoiceIntent(rawText);
    setLastIntent(intent);

    if (intent.kind === "route") {
      router.push(intent.route);
      setHint(`已识别“${rawText}” -> ${intent.label}`);
      return;
    }

    if (intent.kind === "trainer") {
      emitTrainerCommand(intent.action);
      setHint(`已识别“${rawText}” -> ${intent.label}`);
      return;
    }

    setHint(`没听懂“${rawText}”。可以试试：${commandHelp.join("、")}。`);
  };

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
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;

    return () => recognition.stop();
  }, []);
  function toggleListening() {
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
      return;
    }
    recognitionRef.current.start();
    setListening(true);
    setHint("正在听指令…");
  }

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
        <div className={compact ? "min-w-0 flex-1 text-xs leading-5 text-sky-700/80" : "text-sm leading-6 text-sky-700/80"}>
          <div className={compact ? "truncate" : ""}>
            {compact ? "自然语言：打开成长 / 练第二关 / 暂停一下" : hint}
          </div>
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
