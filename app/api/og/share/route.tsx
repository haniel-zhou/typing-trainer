import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const kind = searchParams.get("kind") ?? "profile";
  const title = searchParams.get("title") ?? "Typing Trainer";
  const subtitle = searchParams.get("subtitle") ?? "把训练变成可分享的成长结果";
  const statPrimary = searchParams.get("statPrimary") ?? "60 WPM";
  const statPrimaryLabel = searchParams.get("statPrimaryLabel") ?? "最高速度";
  const statSecondary = searchParams.get("statSecondary") ?? "98%";
  const statSecondaryLabel = searchParams.get("statSecondaryLabel") ?? "正确率";

  const accentByKind: Record<string, { bg: string; chip: string }> = {
    profile: { bg: "linear-gradient(135deg,#071d42 0%,#0e7490 52%,#dff6ff 100%)", chip: "#0ea5e9" },
    season: { bg: "linear-gradient(135deg,#130f40 0%,#5b21b6 50%,#38bdf8 100%)", chip: "#8b5cf6" },
    duel: { bg: "linear-gradient(135deg,#111827 0%,#0f4c81 50%,#f59e0b 100%)", chip: "#f59e0b" }
  };
  const accent = accentByKind[kind] ?? accentByKind.profile;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: 40,
          background: accent.bg,
          color: "white",
          fontFamily: "Trebuchet MS, Avenir Next, Segoe UI, sans-serif"
        }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            borderRadius: 36,
            border: "1px solid rgba(255,255,255,0.18)",
            background: "rgba(8,18,37,0.32)",
            backdropFilter: "blur(16px)",
            padding: 36,
            justifyContent: "space-between",
            gap: 24
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  alignSelf: "flex-start",
                  padding: "10px 18px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.12)",
                  fontSize: 20,
                  letterSpacing: 3,
                  textTransform: "uppercase"
                }}
              >
                Typing Trainer
              </div>
              <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.05 }}>{title}</div>
              <div style={{ fontSize: 30, lineHeight: 1.45, color: "rgba(255,255,255,0.84)" }}>{subtitle}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  display: "flex",
                  padding: "12px 20px",
                  borderRadius: 999,
                  background: accent.chip,
                  fontSize: 20,
                  fontWeight: 700
                }}
              >
                Fun-first touch typing
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", width: 360, gap: 18 }}>
            {[{
              label: statPrimaryLabel,
              value: statPrimary
            }, {
              label: statSecondaryLabel,
              value: statSecondary
            }].map((item) => (
              <div
                key={item.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  padding: 24,
                  borderRadius: 28,
                  background: "rgba(255,255,255,0.14)"
                }}
              >
                <div style={{ fontSize: 18, color: "rgba(255,255,255,0.72)" }}>{item.label}</div>
                <div style={{ fontSize: 54, fontWeight: 700 }}>{item.value}</div>
              </div>
            ))}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                padding: 24,
                borderRadius: 28,
                background: "rgba(255,255,255,0.1)"
              }}
            >
              <div style={{ fontSize: 18, color: "rgba(255,255,255,0.72)" }}>分享页类型</div>
              <div style={{ fontSize: 40, fontWeight: 700 }}>{kind === "duel" ? "对战结果" : kind === "season" ? "赛季战绩" : "个人主页"}</div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630
    }
  );
}
