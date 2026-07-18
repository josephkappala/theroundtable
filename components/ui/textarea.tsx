import * as React from "react";

import { cn } from "@/utils/cn";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      className={cn(
        "flex min-h-28 w-full resize-none rounded-2xl border border-white/10 bg-[#090d16]/80 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-violet-400/60 focus:ring-4 focus:ring-violet-500/10 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";

export { Textarea };
