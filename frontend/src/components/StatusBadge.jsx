const STYLES = {
  completed: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
  pending_approval: "bg-amber-500/15 text-amber-400 border border-amber-500/20",
  pending: "bg-amber-500/15 text-amber-400 border border-amber-500/20",
  approved: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
  rejected: "bg-rose-500/15 text-rose-400 border border-rose-500/20",
  failed: "bg-rose-500/15 text-rose-400 border border-rose-500/20",
};

const LABELS = {
  pending_approval: "Pending Approval",
};

export default function StatusBadge({ status }) {
  return (
    <span className={`badge ${STYLES[status] || "bg-slate-500/15 text-slate-400 border border-slate-500/20"}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {LABELS[status] || status?.replace(/_/g, " ")}
    </span>
  );
}
