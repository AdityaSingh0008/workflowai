import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ListChecks } from "lucide-react";
import toast from "react-hot-toast";
import Topbar from "../components/Topbar.jsx";
import AgentBadge from "../components/AgentBadge.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { requestApi } from "../api/services.js";

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    requestApi
      .list()
      .then((data) => setRequests(data.requests))
      .catch(() => toast.error("Couldn't load requests"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Topbar title="Requests" subtitle="Complete history of every request the agents have handled for you." />

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton h-16 w-full" />
          ))}
        </div>
      ) : requests.length === 0 ? (
        <EmptyState icon={ListChecks} title="No requests yet" subtitle="Head to the AI Workspace to submit your first request." />
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="hidden grid-cols-12 gap-4 border-b border-white/10 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:grid">
            <div className="col-span-4">Request</div>
            <div className="col-span-2">Agent</div>
            <div className="col-span-2">Action</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">When</div>
          </div>
          <div className="divide-y divide-white/5">
            {requests.map((r, i) => (
              <motion.div
                key={r._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: Math.min(i * 0.03, 0.3) }}
                className="grid grid-cols-1 gap-2 px-6 py-4 sm:grid-cols-12 sm:items-center sm:gap-4"
              >
                <div className="col-span-4 truncate text-sm text-slate-200" title={r.message}>
                  {r.message}
                </div>
                <div className="col-span-2">
                  <AgentBadge agent={r.agent} size="sm" />
                </div>
                <div className="col-span-2 text-sm text-slate-400">{r.tool || "—"}</div>
                <div className="col-span-2">
                  <StatusBadge status={r.status} />
                </div>
                <div className="col-span-2 text-xs text-slate-500">
                  {new Date(r.createdAt).toLocaleString()}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
