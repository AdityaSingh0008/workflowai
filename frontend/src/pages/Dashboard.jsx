import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, CheckCircle2, ShieldAlert, CalendarDays, MessagesSquare, Activity } from "lucide-react";
import toast from "react-hot-toast";
import Topbar from "../components/Topbar.jsx";
import StatCard from "../components/StatCard.jsx";
import AgentBadge from "../components/AgentBadge.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { dashboardApi } from "../api/services.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi
      .get()
      .then(setData)
      .catch(() => toast.error("Couldn't load dashboard data"))
      .finally(() => setLoading(false));
  }, []);

  const quickActions = [
    { label: "Check leave balance", message: "What's my remaining leave balance?" },
    { label: "Report an IT issue", message: "My laptop screen keeps going black, please help." },
    { label: "Submit an expense", message: "I spent ₹1500 on a client lunch, please reimburse me." },
  ];

  return (
    <div>
      <Topbar
        title={`Welcome back, ${user?.name?.split(" ")[0] || "there"} 👋`}
        subtitle="Here's what's happening across your agentic workflows."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Zap} label="Agent Executions" value={data?.totalExecutions ?? 0} tone="violet" loading={loading} delay={0} />
        <StatCard icon={CheckCircle2} label="Completed Workflows" value={data?.completedWorkflows ?? 0} tone="cyan" loading={loading} delay={0.05} />
        <StatCard icon={ShieldAlert} label="Pending Approvals" value={data?.pendingApprovals ?? 0} tone="pink" loading={loading} delay={0.1} />
        <StatCard icon={CalendarDays} label="Leave Balance (days)" value={data?.leaveBalance ?? user?.leaveBalance ?? 0} tone="blue" loading={loading} delay={0.15} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 lg:col-span-2"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-base font-semibold text-white">
              <Activity size={17} className="text-accent-violet" /> Recent Activity
            </h2>
            <button onClick={() => navigate("/requests")} className="text-xs font-medium text-accent-violet hover:text-accent-blue">
              View all
            </button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton h-14 w-full" />
              ))}
            </div>
          ) : data?.recentActivity?.length ? (
            <div className="space-y-2.5">
              {data.recentActivity.map((item) => (
                <div key={item._id} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-slate-200">{item.message}</p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <AgentBadge agent={item.agent} size="sm" />
                      <StatusBadge status={item.status} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={MessagesSquare} title="No activity yet" subtitle="Start a conversation in the AI Workspace to see it here." />
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass-card p-6"
        >
          <h2 className="mb-4 text-base font-semibold text-white">Quick Actions</h2>
          <div className="space-y-2.5">
            {quickActions.map((qa) => (
              <button
                key={qa.label}
                onClick={() => navigate("/workspace", { state: { prefill: qa.message } })}
                className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-left text-sm text-slate-300 transition-colors hover:border-accent-violet/40 hover:bg-white/[0.05]"
              >
                {qa.label}
              </button>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Agent Status</p>
            <div className="space-y-2">
              {["HR", "IT", "Finance"].map((a) => (
                <div key={a} className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">{a} Agent</span>
                  <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-slow" /> Online
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
