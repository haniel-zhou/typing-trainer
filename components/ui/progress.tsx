export function Progress({ value }: { value: number }) {
  return (
    <div className="h-3 w-full overflow-hidden rounded-full bg-sky-100/80">
      <div
        className="h-full rounded-full bg-gradient-to-r from-sky-400 via-sky-500 to-amber-300 transition-all duration-300"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}
