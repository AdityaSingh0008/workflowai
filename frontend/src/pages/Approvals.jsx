import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Check, X } from "lucide-react";
import toast from "react-hot-toast";
import Topbar from "../components/Topbar.jsx";
import AgentBadge from "../components/AgentBadge.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { approvalApi } from "../api/services.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Approvals() {
  const { user } = useAuth();
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [decidingId, setDecidingId] = useState(null);

  const load = () => approvalApi.list().then((data) => setApprovals(data.approvals));

  useEffect(() => {
    load()
      .catch(() => toast.error("Couldn't load approvals"))
      .finally(() => setLoading(false));
  }, []);

  const decide = async (id, approve) => {
    setDecidingId(id);
    try {
      await approvalApi.decide(id, approve);
      toast.success(approve ? "Approved" : "Rejected");
      await load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      setDecidingId(null);
    }
  };

  const pending = approvals.filter((a) => a.status === "pending");
  const decided = approvals.filter((a) => a.status !== "pending");

  return (
    <div>
      <Topbar
        title="Approvals"
        subtitle={
          user?.role === "manager"
            ? "Review and decide on sensitive actions flagged by the agents."
            : "Track the approval status of your sensitive requests."
        }
      />

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="skeleton h-28 w-full" />
          ))}
        </div>
      ) : approvals.length === 0 ? (
        <EmptyState icon={ShieldCheck} title="No approvals to show" subtitle="Sensitive actions like large expenses or long leave requests will appear here." />
      ) : (
        <div className="space-y-8">
          {pending.length > 0 && (
            <div>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                Pending ({pending.length})
              </h2>
              <div className="space-y-3">
                <AnimatePresence>
                  {pending.map((a) => (
                    <motion.div
                      key={a._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="glass-card p-5"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="mb-2 flex items-center gap-2">
                            <AgentBadge agent={a.agent} size="sm" />
                            <StatusBadge status={a.status} />
                          </div>
                          <p className="text-sm font-medium text-slate-100">{a.agentRequest?.message}</p>
                          <p className="mt-1 text-xs text-slate-500">{a.reason}</p>
                          <p className="mt-1 text-xs text-slate-600">
                            Requested by {a.requestedBy?.name} · {new Date(a.createdAt).toLocaleString()}
                          </p>
                        </div>

                        {user?.role === "manager" ? (
                          <div className="flex shrink-0 gap-2">
                            <button
                              onClick={() => decide(a._id, true)}
                              disabled={decidingId === a._id}
                              className="flex items-center gap-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 px-3.5 py-2 text-sm font-medium text-emerald-400 transition-colors hover:bg-emerald-500/25 disabled:opacity-50"
                            >
                              <Check size={15} /> Approve
                            </button>
                            <button
                              onClick={() => decide(a._id, false)}
                              disabled={decidingId === a._id}
                              className="flex items-center gap-1.5 rounded-xl bg-rose-500/15 border border-rose-500/30 px-3.5 py-2 text-sm font-medium text-rose-400 transition-colors hover:bg-rose-500/25 disabled:opacity-50"
                            >
                              <X size={15} /> Reject
                            </button>
                          </div>
                        ) : (
                          <span className="shrink-0 text-xs text-slate-500">Awaiting a manager</span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {decided.length > 0 && (
            <div>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">History</h2>
              <div className="space-y-2.5">
                {decided.map((a) => (
                  <div key={a._id} className="glass-card flex items-center justify-between gap-3 p-4">
                    <div className="min-w-0 flex-1">
                      <div className="mb-1.5 flex items-center gap-2">
                        <AgentBadge agent={a.agent} size="sm" />
                        <StatusBadge status={a.status} />
                      </div>
                      <p className="truncate text-sm text-slate-300">{a.agentRequest?.message}</p>
                    </div>
                    <span className="shrink-0 text-xs text-slate-500">
                      {new Date(a.decidedAt || a.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
