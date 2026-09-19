import { useState } from "react";
import { sendChat, getPendingApprovals } from "../api/client";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatWindow() {
  const [email, setEmail] = useState("employee@company.com");
  const [message, setMessage] = useState("");
  const [thread, setThread] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;
    const userTurn = { role: "user", text: message };
    setThread((t) => [...t, userTurn]);
    setLoading(true);
    setMessage("");

    try {
      const data = await sendChat(email, userTurn.text);
      setThread((t) => [
        ...t,
        {
          role: "agent",
          text: data.response,
          department: data.department,
          proposedTool: data.proposed_tool,
          requiresApproval: data.requires_approval,
          toolResult: data.tool_result,
          chunks: data.retrieved_chunks,
        },
      ]);
    } catch (err) {
      setThread((t) => [...t, { role: "agent", text: `Error: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="chat-window"
    >
      <div className="chat-header">
        <label>
          Acting as:
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
      </div>

      <div className="chat-thread">
        <AnimatePresence>
          {thread.map((turn, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`bubble ${turn.role}`}
            >
              {turn.department && <div className="tag">{turn.department}</div>}
              <div>{turn.text}</div>
              {turn.proposedTool && (
                <div className="tool-note">
                  Tool: <code>{turn.proposedTool}</code>{" "}
                  {turn.requiresApproval ? "(pending human approval)" : "(executed)"}
                </div>
              )}
            </motion.div>
          ))}
          {loading && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bubble agent"
            >
              Thinking…
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="chat-input">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask HR, IT or Finance anything…"
        />
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSend}
        >
          Send
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={async () => {
            try {
              setLoading(true);
              const data = await getPendingApprovals();
              setThread((t) => [
                ...t,
                {
                  role: "agent",
                  text: `You have ${data.length} pending approvals.`,
                  department: "SYSTEM"
                }
              ]);
            } catch (err) {
              setThread((t) => [...t, { role: "agent", text: `Error fetching approvals: ${err.message}` }]);
            } finally {
              setLoading(false);
            }
          }}
          className="ml-2 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded text-sm font-medium text-white transition-colors shadow-glow"
        >
          Check Pending
        </motion.button>
      </div>
    </motion.div>
  );
}
