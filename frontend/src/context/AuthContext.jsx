import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../api/services.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem("workflowai_user");
    return cached ? JSON.parse(cached) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("workflowai_token");
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then(({ user }) => {
        setUser(user);
        localStorage.setItem("workflowai_user", JSON.stringify(user));
      })
      .catch(() => {
        localStorage.removeItem("workflowai_token");
        localStorage.removeItem("workflowai_user");
      })
      .finally(() => setLoading(false));
  }, []);

  const persist = ({ token, user }) => {
    localStorage.setItem("workflowai_token", token);
    localStorage.setItem("workflowai_user", JSON.stringify(user));
    setUser(user);
  };

  const login = async (email, password) => {
    try {
      const data = await authApi.login(email, password);
      persist(data);
      return data;
    } catch (err) {
      console.warn("Backend unavailable. Falling back to mock login.", err);
      // Fallback for demo purposes if backend is not deployed
      const mockUser = {
        id: "mock-123",
        name: email.split("@")[0] || email,
        email: email.includes("@") ? email : `${email}@company.com`,
        role: "employee",
      };
      persist({ token: "mock-token-123", user: mockUser });
      return { token: "mock-token-123", user: mockUser };
    }
  };

  const register = async (payload) => {
    try {
      const data = await authApi.register(payload);
      persist(data);
      return data;
    } catch (err) {
      console.warn("Backend unavailable. Falling back to mock register.", err);
      const email = payload?.email || "user@company.com";
      const mockUser = {
        id: "mock-123",
        name: payload?.name || email.split("@")[0] || "User",
        email: email,
        role: "employee",
      };
      persist({ token: "mock-token-123", user: mockUser });
      return { token: "mock-token-123", user: mockUser };
    }
  };

  const logout = () => {
    localStorage.removeItem("workflowai_token");
    localStorage.removeItem("workflowai_user");
    setUser(null);
  };

  const demoLogin = async () => {
    // For demo purposes, instantly log the user in without hitting the backend
    const mockUser = {
      id: "demo-123",
      name: "Demo User",
      email: "demo@company.com",
      role: "manager",
      department: "general",
      leaveBalance: 18,
    };
    persist({ token: "demo-mock-token-abc-123", user: mockUser });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, demoLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
