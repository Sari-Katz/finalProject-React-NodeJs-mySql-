import React, { createContext, useState, useEffect } from "react";
import ApiUtils from "../utils/ApiUtils";

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // רק id + role
  const [isReady, setIsReady] = useState(false);
  const apiUtils = new ApiUtils();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.id && parsedUser.role) {
          setUser(parsedUser);
        }
      }
    } catch (error) {
      console.error("Failed to load user from localStorage:", error);
    } finally {
      setIsReady(true);
    }
  }, []);

  const role = user?.role || "guest";

  const login = (userData) => {
    // userData מכיל id, role ויתכן עוד שדות
    const { id, role } = userData;
    const minimalUser = { id, role };
    setUser(minimalUser);
    localStorage.setItem("user", JSON.stringify(minimalUser));
  };

  const logout = async () => {
    try {
      // 1) בקשה לשרת שימחק את ה‑JWT Cookie
      await apiUtils.post("http://localhost:3000/users/logout");
    } catch (err) {
      console.error("Failed to clear cookie on server:", err);
      // גם אם נכשל, נמשיך לנקות מקומית
    }

    setUser(null);
    localStorage.removeItem("user");
  };

  if (!isReady) return null; // או ספינר

  return (
    <AuthContext.Provider value={{ user, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
