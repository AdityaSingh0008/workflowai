import { motion } from "framer-motion";
import AgentBadge from "./AgentBadge.jsx";
import AgentFlow from "./AgentFlow.jsx";
import StatusBadge from "./StatusBadge.jsx";

export function UserBubble({ text }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
      className="flex justify-end"
    >
      <div className="max-w-[75%] rounded-2xl rounded-tr-sm bg-brand-gradient px-4 py-3 text-sm font-medium text-white shadow-glow">
        {text}
      </div>
    </motion.div>
  );
}

export function AgentBubble({ turn }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
      className="flex justify-start"
    >
      <div className="glass-card max-w-[85%] px-4 py-4">
        <div className="mb-3 flex items-center gap-2">
          <AgentBadge agent={turn.agent} />
          <StatusBadge status={turn.status} />
        </div>
        <AgentFlow agent={turn.agent} tool={turn.tool} status={turn.status} />
        <p className="mt-3 text-sm leading-relaxed text-slate-200">{turn.response}</p>
      </div>
    </motion.div>
  );
}

export function TypingBubble() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
      <div className="glass-card flex items-center gap-1.5 px-4 py-3.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-2 w-2 rounded-full bg-accent-violet"
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
          />
        ))}
      </div>
    </motion.div>
  );
}
