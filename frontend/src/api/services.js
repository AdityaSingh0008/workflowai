import api from "./axios.js";

export const authApi = {
  login: (email, password) => api.post("/auth/login", { email, password }).then((r) => r.data),
  register: (payload) => api.post("/auth/register", payload).then((r) => r.data),
  me: () => api.get("/auth/me").then((r) => r.data),
};

export const agentApi = {
  execute: (message) => api.post("/agents/execute", { message }).then((r) => r.data),
};

export const requestApi = {
  list: () => api.get("/requests").then((r) => r.data),
};

export const approvalApi = {
  list: (status) => api.get("/approvals", { params: status ? { status } : {} }).then((r) => r.data),
  decide: (id, approve) => api.post(`/approvals/${id}/decide`, { approve }).then((r) => r.data),
};

export const dashboardApi = {
  get: () => api.get("/dashboard").then((r) => r.data),
};
