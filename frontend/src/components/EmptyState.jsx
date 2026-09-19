import { motion } from "framer-motion";

export default function EmptyState({ icon: Icon, title, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card flex flex-col items-center justify-center gap-3 px-6 py-16 text-center"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.05]">
        <Icon size={26} className="text-slate-500" />
      </div>
      <h3 className="text-base font-semibold text-slate-200">{title}</h3>
      {subtitle && <p className="max-w-sm text-sm text-slate-500">{subtitle}</p>}
    </motion.div>
  );
}
