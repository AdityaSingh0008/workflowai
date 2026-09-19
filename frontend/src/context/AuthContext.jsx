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

  const login = async (email, password) => persist(await authApi.login(email, password));
  const register = async (payload) => persist(await authApi.register(payload));
  const logout = () => {
    localStorage.removeItem("workflowai_token");
    localStorage.removeItem("workflowai_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
