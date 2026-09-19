import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://backend-nine-plum-12.vercel.app",
});

export const sendChat = (user_email, message) =>
  client.post("/chat", { user_email, message }).then((r) => r.data);

export const getPendingApprovals = () =>
  client.get("/approvals/pending").then((r) => r.data);

export const decideApproval = (id, approver_id, approve) =>
  client.post(`/approvals/${id}/decide`, { approver_id, approve }).then((r) => r.data);

export default client;
