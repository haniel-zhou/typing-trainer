const KEYS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
  [";", ",", ".", "/"],
  ["SPACE"]
];

type KeyboardVisualProps = {
  activeKey: string | null;
  allowedKeys?: string[];
  compact?: boolean;
};

export function KeyboardVisual({ activeKey, allowedKeys, compact = false }: KeyboardVisualProps) {
  const allowedSet = allowedKeys?.length ? new Set(allowedKeys) : null;
  const rows = KEYS.map((row) =>
    allowedSet ? row.filter((key) => allowedSet.has(key) || key === activeKey) : row
  ).filter((row) => row.length > 0);

  return (
    <div
      className={`space-y-2 rounded-[28px] bg-sky-950 shadow-[0_24px_40px_rgba(15,23,42,0.32)] ${
        compact ? "p-3" : "p-4"
      }`}
    >
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex flex-wrap gap-2">
          {row.map((key) => {
            const active = activeKey === key;
            return (
              <div
                key={key}
                className={`flex items-center justify-center rounded-2xl border font-semibold transition duration-200 ${
                  compact ? "min-w-10 px-3 py-2 text-xs" : "min-w-12 px-4 py-3 text-sm"
                } ${
                  active
                    ? "border-sky-200 bg-gradient-to-br from-sky-300 to-amber-200 text-sky-950 shadow-[0_0_28px_rgba(125,211,252,0.48)]"
                    : "border-sky-900 bg-sky-900/80 text-sky-100"
                }`}
              >
                {key}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
