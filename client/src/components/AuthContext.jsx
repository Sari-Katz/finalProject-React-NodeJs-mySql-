import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // user כולל גם role
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const fetchUserData = () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser && parsedUser.role) {
            setUser(parsedUser);
          }
        }
      } catch (error) {
        console.error("Failed to load user from localStorage:", error);
      } finally {
        setIsReady(true);
      }
    };

    fetchUserData();
  }, []);

  // מאחזר תפקיד נוכחי בצורה נוחה
  const role = user?.role || "guest";
  const activeSubscription = user?.activeSubscription || false;

  const login = (userData) => {
    const { token, ...user} = userData;
  setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
     if (token) {
    localStorage.setItem("token", token);
  }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  if (!isReady) {
    return null; // או Spinner
  }

  return (
    <AuthContext.Provider value={{ user, role, login, logout,activeSubscription }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
