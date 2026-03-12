import React from "react";
import clsx from "clsx";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline";
};

export function buttonStyles({
  className,
  variant = "default"
}: {
  className?: string;
  variant?: "default" | "outline";
}) {
  return clsx(
    "inline-flex items-center justify-center whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition duration-200",
    "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-200",
    variant === "default" &&
      "bg-sky-500 text-white shadow-[0_12px_30px_rgba(14,165,233,0.28)] hover:-translate-y-0.5 hover:bg-sky-600",
    variant === "outline" &&
      "border border-sky-200/80 bg-white/80 text-sky-900 hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50",
    className
  );
}

export function Button({ className, variant = "default", ...props }: ButtonProps) {
  return <button className={buttonStyles({ className, variant })} {...props} />;
}
