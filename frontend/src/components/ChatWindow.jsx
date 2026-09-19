import { useState, useRef, useEffect } from "react";
import { sendChat, getPendingApprovals } from "../api/client";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatWindow() {
  const [email, setEmail] = useState("employee@company.com");
  const [message, setMessage] = useState("");
  const [thread, setThread] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [thread, loading]);

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

  const handleCheckPending = async () => {
    try {
      setLoading(true);
      const data = await getPendingApprovals();
      setThread((t) => [
        ...t,
        {
          role: "agent",
          text: `You have ${data.length} pending approvals waiting in the Action Center.`,
          department: "SYSTEM"
        }
      ]);
    } catch (err) {
      setThread((t) => [...t, { role: "agent", text: `Error fetching approvals: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="chat-window"
    >
      <div className="chat-header">
        <span>Session As:</span>
        <input 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="user@company.com"
        />
      </div>

      <div className="chat-thread" ref={scrollRef}>
        <AnimatePresence initial={false}>
          {thread.length === 0 && !loading && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="empty-state"
              style={{ height: '100%', border: 'none', background: 'transparent' }}
            >
              <div style={{ marginBottom: '16px' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <p>How can I help you today?</p>
              <p style={{ fontSize: '12px', opacity: 0.5 }}>Ask HR, IT, or Finance for assistance.</p>
            </motion.div>
          )}

          {thread.map((turn, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={`bubble ${turn.role}`}
            >
              {turn.department && (
                <div className="tag">
                  {turn.department === 'SYSTEM' ? '⚙️' : '🤖'} {turn.department}
                </div>
              )}
              
              <div style={{ whiteSpace: 'pre-wrap' }}>{turn.text}</div>
              
              {turn.proposedTool && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ delay: 0.2 }}
                  className="tool-note"
                >
                  Running action: <code>{turn.proposedTool}</code>
                  <div style={{ marginTop: '4px', opacity: 0.7, fontSize: '10px' }}>
                    {turn.requiresApproval ? "⏸️ Waiting for human approval in Action Center..." : "✅ Executed successfully"}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}

          {loading && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              className="bubble agent"
            >
              <div className="typing-dots">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="chat-input-wrapper">
        <div className="chat-input-container">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Message WorkFlowAI..."
            autoFocus
          />
          <button className="btn-secondary" onClick={handleCheckPending} title="Check Pending Approvals">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </button>
          <button className="btn-primary" onClick={handleSend} disabled={!message.trim()}>
            Send
          </button>
        </div>
      </div>
    </motion.div>
  );
}
