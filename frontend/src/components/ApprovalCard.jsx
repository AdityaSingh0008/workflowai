import { useEffect, useState } from "react";
import { getPendingApprovals, decideApproval } from "../api/client";

export default function ApprovalCard() {
  const [approvals, setApprovals] = useState([]);

  const refresh = () => getPendingApprovals().then(setApprovals);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 5000);
    return () => clearInterval(id);
  }, []);

  const handleDecision = async (id, approve) => {
    await decideApproval(id, "manager@company.com", approve);
    refresh();
  };

  if (approvals.length === 0) return <div className="approvals-empty">No pending approvals.</div>;

  return (
    <div className="approvals">
      <h3>Pending Approvals</h3>
      {approvals.map((a) => (
        <div key={a.id} className="approval-item">
          <div>
            <strong>{a.action_type}</strong>
          </div>
          <pre>{JSON.stringify(a.action_payload, null, 2)}</pre>
          <div className="approval-actions">
            <button onClick={() => handleDecision(a.id, true)}>Approve</button>
            <button onClick={() => handleDecision(a.id, false)}>Reject</button>
          </div>
        </div>
      ))}
    </div>
  );
}
