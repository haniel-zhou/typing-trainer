import React from "react";
import clsx from "clsx";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea(props, ref) {
  return (
    <textarea
      ref={ref}
      {...props}
      className={clsx(
        "w-full rounded-[28px] border border-sky-100 bg-white/90 px-4 py-3 text-base text-sky-950 placeholder:text-sky-400",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100",
        props.className
      )}
    />
  );
});
