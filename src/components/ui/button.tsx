import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "default" | "small";
};

const variants = {
  primary: "bg-[var(--accent)] text-white hover:bg-[#283a30]",
  secondary: "border border-[var(--line)] bg-white text-[var(--foreground)] hover:bg-[#f4f2ed]",
  ghost: "text-[var(--foreground)] hover:bg-[#f1f0eb]",
  danger: "bg-red-700 text-white hover:bg-red-800",
};

export function Button({ className, variant = "primary", size = "default", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        size === "small" ? "min-h-9 px-3 text-sm" : "min-h-11 px-5 text-sm",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
