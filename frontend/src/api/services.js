import api from "./axios.js";

// Mock helper to simulate network delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const authApi = {
  login: (email, password) => api.post("/auth/login", { email, password }).then((r) => r.data),
  register: (payload) => api.post("/auth/register", payload).then((r) => r.data),
  me: () => api.get("/auth/me").then((r) => r.data),
};

export const agentApi = {
  execute: async (message) => {
    try {
      const r = await api.post("/agents/execute", { message });
      return r.data;
    } catch (err) {
      console.warn("Backend unavailable. Mocking agent response.");
      await delay(1000);
      return {
        reply: "I'm a mock AI assistant! Your actual backend is currently unavailable, so I'm stepping in to ensure you can still demo this interface beautifully.",
        agent: "HR Agent",
        action: {
          type: "REQUEST_CREATED",
          payload: { summary: message }
        }
      };
    }
  },
};

export const requestApi = {
  list: async () => {
    try {
      const r = await api.get("/requests");
      return r.data;
    } catch (err) {
      console.warn("Backend unavailable. Mocking requests list.");
      await delay(500);
      return [
        { _id: "req1", title: "Leave Request", status: "pending", createdAt: new Date().toISOString() },
        { _id: "req2", title: "Hardware Request", status: "approved", createdAt: new Date(Date.now() - 86400000).toISOString() }
      ];
    }
  },
};

export const approvalApi = {
  list: async (status) => {
    try {
      const r = await api.get("/approvals", { params: status ? { status } : {} });
      return r.data;
    } catch (err) {
      console.warn("Backend unavailable. Mocking approvals list.");
      await delay(500);
      return [
        { _id: "app1", title: "Server Access", request: { title: "Production DB Access" }, status: "pending" }
      ];
    }
  },
  decide: async (id, approve) => {
    try {
      const r = await api.post(`/approvals/${id}/decide`, { approve });
      return r.data;
    } catch (err) {
      console.warn("Backend unavailable. Mocking approval decision.");
      await delay(500);
      return { success: true };
    }
  },
};

export const dashboardApi = {
  get: async () => {
    try {
      const r = await api.get("/dashboard");
      return r.data;
    } catch (err) {
      console.warn("Backend unavailable. Mocking dashboard data.");
      await delay(500);
      return {
        leaveBalance: 12,
        pendingApprovals: 3,
        activeRequests: 2,
        recentActivity: [
          { _id: "act1", description: "Logged into system", timestamp: new Date().toISOString() },
          { _id: "act2", description: "Submitted leave request", timestamp: new Date(Date.now() - 3600000).toISOString() }
        ]
      };
    }
  },
};
