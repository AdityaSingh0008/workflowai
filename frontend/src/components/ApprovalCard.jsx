import { useEffect, useState } from "react";
import { getPendingApprovals, decideApproval } from "../api/client";
import { motion, AnimatePresence } from "framer-motion";

export default function ApprovalCard() {
  const [approvals, setApprovals] = useState([]);

  const refresh = () => getPendingApprovals().then(setApprovals);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 5000);
    return () => clearInterval(id);
  }, []);

  const handleDecision = async (id, approve) => {
    // Optimistically remove from UI
    setApprovals(prev => prev.filter(a => a.id !== id));
    try {
      await decideApproval(id, "manager@company.com", approve);
    } catch (e) {
      // Revert on error
      refresh();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, overflowY: 'auto', paddingRight: '8px' }}>
      <AnimatePresence mode="popLayout">
        {approvals.length === 0 ? (
          <motion.div 
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="empty-state"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '12px', opacity: 0.5 }}>
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            No pending approvals
          </motion.div>
        ) : (
          approvals.map((a) => (
            <motion.div 
              key={a.id} 
              layout
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="approval-card"
            >
              <div className="approval-title">
                <span>{a.action_type.replace('_', ' ').toUpperCase()}</span>
                <span className="approval-badge">REQUIRES REVIEW</span>
              </div>
              
              <div className="approval-payload">
                {JSON.stringify(a.action_payload, null, 2)}
              </div>
              
              <div className="approval-actions">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-approve"
                  onClick={() => handleDecision(a.id, true)}
                >
                  Approve
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-reject"
                  onClick={() => handleDecision(a.id, false)}
                >
                  Reject
                </motion.button>
              </div>
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </div>
  );
}
