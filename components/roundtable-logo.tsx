import { cn } from "@/utils/cn";

type RoundtableLogoProps = {
  className?: string;
  markClassName?: string;
  labelClassName?: string;
};

export function RoundtableLogo({ className, markClassName, labelClassName }: RoundtableLogoProps) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span className={cn("relative grid h-8 w-8 place-items-center overflow-hidden rounded-[10px] bg-gradient-to-br from-violet-400 to-indigo-600 shadow-[0_0_24px_rgba(124,92,255,0.38)]", markClassName)}>
        <span className="absolute h-3 w-3 rounded-full border-2 border-white/95" />
        <span className="absolute h-3 w-3 translate-x-2 rounded-full border-2 border-white/60" />
      </span>
      <span className={cn("text-[15px] font-semibold tracking-[-0.04em] text-white", labelClassName)}>The Roundtable</span>
    </span>
  );
}
