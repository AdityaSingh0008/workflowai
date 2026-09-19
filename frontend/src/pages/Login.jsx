import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import Logo from "../components/Logo.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      await demoLogin();
      toast.success("Logged in with Demo Account!");
      navigate("/dashboard");
    } catch (err) {
      toast.error("Demo login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-base-950 px-4">
      <div className="pointer-events-none absolute inset-0 bg-grid-glow" />
      <motion.div
        animate={{ y: [0, -18, 0] }}
        transition={{ repeat: Infinity, duration: 8 }}
        className="pointer-events-none absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-accent-violet/20 blur-[100px]"
      />
      <motion.div
        animate={{ y: [0, 18, 0] }}
        transition={{ repeat: Infinity, duration: 9 }}
        className="pointer-events-none absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-accent-cyan/20 blur-[100px]"
      />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="glass-card relative z-10 w-full max-w-md px-8 py-10"
      >
        <div className="mb-8 flex justify-center">
          <Logo size="lg" />
        </div>
        <h1 className="text-center text-xl font-bold text-white">Welcome back</h1>
        <p className="mt-1 text-center text-sm text-slate-400">
          Sign in to your agentic operations workspace
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={17} />
            <input
              type="text"
              required
              placeholder="Username or Gmail ID"
              className="input-field !pl-10"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={17} />
            <input
              type="password"
              required
              placeholder="Password"
              className="input-field !pl-10"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Signing in…" : "Sign in"}
            {!loading && <ArrowRight size={16} />}
          </button>
          
          <div className="relative my-4 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700/50"></div>
            </div>
            <div className="relative bg-base-950 px-4 text-xs uppercase text-slate-500">Or</div>
          </div>

          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full rounded-xl border border-accent-violet/30 bg-accent-violet/10 px-4 py-3 text-sm font-semibold text-accent-violet transition-colors hover:bg-accent-violet/20"
          >
            {loading ? "Please wait…" : "Login with Demo Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold text-accent-violet hover:text-accent-blue">
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
