import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutDashboard, MessagesSquare, ListChecks, ShieldCheck, LogOut } from "lucide-react";
import Logo from "./Logo.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/workspace", label: "AI Workspace", icon: MessagesSquare },
  { to: "/requests", label: "Requests", icon: ListChecks },
  { to: "/approvals", label: "Approvals", icon: ShieldCheck },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <motion.aside 
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="hidden md:flex h-screen w-64 flex-col border-r border-white/10 bg-base-900/60 backdrop-blur-xl px-4 py-6"
    >
      <div className="px-2 mb-8">
        <Logo />
      </div>

      <nav className="flex-1 space-y-1.5">
        {NAV_ITEMS.map(({ to, label, icon: Icon }, index) => (
          <motion.div
            key={to}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <NavLink to={to} className="relative block">
              {({ isActive }) => (
                <motion.div
                  whileHover={{ x: 4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                    isActive ? "text-white" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-nav"
                      className="absolute inset-0 rounded-xl bg-white/[0.06] border border-white/10"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <Icon className="relative h-4.5 w-4.5 z-10" size={18} />
                  <span className="relative z-10">{label}</span>
                </motion.div>
              )}
            </NavLink>
          </motion.div>
        ))}
      </nav>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-auto border-t border-white/10 pt-4"
      >
        <div className="flex items-center gap-3 rounded-xl px-2 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-gradient text-sm font-bold text-white">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-100">{user?.name}</p>
            <p className="truncate text-xs text-slate-500 capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-2 flex w-full items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-white/[0.05] hover:text-rose-400"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </motion.div>
    </motion.aside>
  );
}
