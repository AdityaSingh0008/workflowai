import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Send, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import Topbar from "../components/Topbar.jsx";
import { UserBubble, AgentBubble, TypingBubble } from "../components/ChatBubble.jsx";
import { agentApi } from "../api/services.js";

const SUGGESTIONS = [
  "What's my remaining leave balance?",
  "My laptop screen keeps going black.",
  "I spent ₹5000 on a client dinner, please reimburse me.",
  "I want to request 4 days of leave next week.",
];

export default function Workspace() {
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState(location.state?.prefill || "");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const send = async (text) => {
    const message = (text ?? input).trim();
    if (!message || sending) return;

    setMessages((m) => [...m, { role: "user", text: message }]);
    setInput("");
    setSending(true);

    try {
      const result = await agentApi.execute(message);
      setMessages((m) => [
        ...m,
        {
          role: "agent",
          agent: result.agent,
          tool: result.tool,
          status: result.status,
          response: result.response,
        },
      ]);
    } catch (err) {
      toast.error(err.response?.data?.message || "The agent failed to respond");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <Topbar title="AI Workspace" subtitle="Talk to the Supervisor Agent — it routes your request to HR, IT or Finance." />

      <div className="glass-card flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gradient shadow-glow">
                <Sparkles className="text-white" size={24} />
              </div>
              <h3 className="text-base font-semibold text-slate-200">Ask the Supervisor Agent anything</h3>
              <p className="mt-1 max-w-sm text-sm text-slate-500">
                It will classify your request and delegate it to the right specialist agent automatically.
              </p>
              <div className="mt-6 grid w-full max-w-lg grid-cols-1 gap-2 sm:grid-cols-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-left text-xs text-slate-300 transition-colors hover:border-accent-violet/40 hover:bg-white/[0.05]"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((turn, i) =>
            turn.role === "user" ? <UserBubble key={i} text={turn.text} /> : <AgentBubble key={i} turn={turn} />
          )}
          {sending && <TypingBubble />}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Describe your request…"
              className="input-field"
            />
            <button onClick={() => send()} disabled={sending || !input.trim()} className="btn-primary shrink-0 px-4">
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
