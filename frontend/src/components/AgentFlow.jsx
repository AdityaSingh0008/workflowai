import { motion } from "framer-motion";
import { ArrowRight, Bot, Wrench as ToolIcon, CheckCircle2 } from "lucide-react";
import { AGENT_META } from "./AgentBadge.jsx";

function Node({ icon: Icon, label, sub, delay, active }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.3 }}
      className={`glass-card flex flex-col items-center gap-1.5 px-4 py-3 min-w-[110px] ${
        active ? "shadow-glow" : ""
      }`}
    >
      <Icon size={18} className="text-accent-violet" />
      <span className="text-xs font-semibold text-slate-100 text-center leading-tight">{label}</span>
      {sub && <span className="text-[10px] text-slate-500 text-center leading-tight">{sub}</span>}
    </motion.div>
  );
}

export default function AgentFlow({ agent, tool, status }) {
  const meta = AGENT_META[agent] || AGENT_META.general;

  return (
    <div className="flex flex-wrap items-center gap-2 py-2">
      <Node icon={Bot} label="Supervisor" sub="Classifies intent" delay={0} active />
      <ArrowRight size={16} className="text-slate-600 shrink-0" />
      <Node icon={meta.icon} label={meta.label} sub="Specialist agent" delay={0.1} active />
      {tool && (
        <>
          <ArrowRight size={16} className="text-slate-600 shrink-0" />
          <Node icon={ToolIcon} label={tool} sub="Tool / API action" delay={0.2} active />
        </>
      )}
      <ArrowRight size={16} className="text-slate-600 shrink-0" />
      <Node
        icon={CheckCircle2}
        label={status === "pending_approval" ? "Awaiting approval" : "Result"}
        sub={status === "pending_approval" ? "Human-in-the-loop" : "Delivered"}
        delay={0.3}
        active
      />
    </div>
  );
}
