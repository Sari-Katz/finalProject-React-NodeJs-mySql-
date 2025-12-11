import { createContext, useState, useEffect  } from "react";
import ApiUtils from "../utils/ApiUtils";

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null); 
  const [isReady, setIsReady] = useState(false);

    const logout = async () => {
    try {
      await ApiUtils.post("http://localhost:3000/users/logout");
    } catch (err) {
      console.error("Failed to clear cookie on server:", err);
    }
    setUser(null);
  };
useEffect(() => {
  ApiUtils.setUnauthorizedHandler(logout);
}, [logout]);
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await ApiUtils.get("http://localhost:3000/users/check-session");
        if (response && response.id) {
          setUser(response);
        }
      } catch (error) {
        console.warn("Session check failed:", error);
      } finally {
        setIsReady(true);
      }
    };

    checkSession();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };
  const role = user?.role || "guest";
  if (!isReady) return null;
  
  return (
    <AuthContext.Provider value={{ user, role,registAI: 1,login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
