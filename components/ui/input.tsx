import React from "react";
import clsx from "clsx";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={clsx(
        "w-full rounded-[24px] border border-sky-100 bg-white/90 px-4 py-3 text-sm text-sky-950 placeholder:text-sky-400",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100",
        props.className
      )}
    />
  );
}
