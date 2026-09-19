import { motion, AnimatePresence } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";

export default function AppLayout() {
  const location = useLocation();
  return (
    <div className="flex min-h-screen bg-base-950">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="mx-auto max-w-6xl px-6 py-8 sm:px-10"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
