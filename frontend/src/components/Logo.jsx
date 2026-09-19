import { Sparkles } from "lucide-react";

export default function Logo({ size = "md" }) {
  const sizes = { sm: "h-7 w-7", md: "h-9 w-9", lg: "h-14 w-14" };
  const textSizes = { sm: "text-base", md: "text-lg", lg: "text-3xl" };

  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`flex ${sizes[size]} items-center justify-center rounded-xl bg-brand-gradient shadow-glow`}
      >
        <Sparkles className="h-1/2 w-1/2 text-white" strokeWidth={2.5} />
      </div>
      <span className={`font-extrabold tracking-tight text-white ${textSizes[size]}`}>
        WorkFlow<span className="bg-brand-gradient bg-clip-text text-transparent">AI</span>
      </span>
    </div>
  );
}
