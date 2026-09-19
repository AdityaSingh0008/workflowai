import { motion } from "framer-motion";

export default function StatCard({ icon: Icon, label, value, tone = "violet", loading, delay = 0 }) {
  const tones = {
    violet: "from-accent-violet/20 to-transparent text-accent-violet",
    blue: "from-accent-blue/20 to-transparent text-accent-blue",
    cyan: "from-accent-cyan/20 to-transparent text-accent-cyan",
    pink: "from-accent-pink/20 to-transparent text-accent-pink",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -3 }}
      className="glass-card p-5"
    >
      <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${tones[tone]}`}>
        <Icon size={20} />
      </div>
      {loading ? (
        <div className="skeleton h-7 w-16 mb-1" />
      ) : (
        <p className="text-2xl font-bold text-white">{value}</p>
      )}
      <p className="mt-1 text-sm text-slate-400">{label}</p>
    </motion.div>
  );
}
