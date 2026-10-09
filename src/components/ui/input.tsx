import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "min-h-11 w-full rounded-md border border-[var(--line)] bg-white px-3 text-sm outline-none transition placeholder:text-[#a1a39d] focus:border-[var(--accent)] focus:ring-2 focus:ring-[#344b3e]/10",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full resize-y rounded-md border border-[var(--line)] bg-white px-3 py-3 text-sm outline-none transition placeholder:text-[#a1a39d] focus:border-[var(--accent)] focus:ring-2 focus:ring-[#344b3e]/10",
        className,
      )}
      {...props}
    />
  );
}
