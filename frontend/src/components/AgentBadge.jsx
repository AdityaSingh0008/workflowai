import { Users, Wrench, Wallet, Bot } from "lucide-react";

export const AGENT_META = {
  hr: { label: "HR Agent", icon: Users, color: "text-accent-violet", bg: "bg-accent-violet/15 border-accent-violet/20" },
  it: { label: "IT Agent", icon: Wrench, color: "text-accent-blue", bg: "bg-accent-blue/15 border-accent-blue/20" },
  finance: { label: "Finance Agent", icon: Wallet, color: "text-accent-cyan", bg: "bg-accent-cyan/15 border-accent-cyan/20" },
  general: { label: "Supervisor", icon: Bot, color: "text-slate-300", bg: "bg-slate-500/15 border-slate-500/20" },
};

export default function AgentBadge({ agent, size = "md" }) {
  const meta = AGENT_META[agent] || AGENT_META.general;
  const Icon = meta.icon;
  const pad = size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs";

  return (
    <span className={`badge border ${meta.bg} ${meta.color} ${pad}`}>
      <Icon size={12} />
      {meta.label}
    </span>
  );
}
