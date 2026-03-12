import React from "react";
import clsx from "clsx";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border border-white/60 bg-white/75 px-3 py-1 text-xs font-semibold text-sky-700 shadow-sm",
        className
      )}
      {...props}
    />
  );
}
