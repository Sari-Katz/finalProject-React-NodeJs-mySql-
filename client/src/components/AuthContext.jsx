// // import React, { createContext, useState, useEffect } from "react";
// // import ApiUtils from "../utils/ApiUtils";

// // export const AuthContext = createContext();

// // function AuthProvider({ children }) {
// //   const [user, setUser] = useState(null); // רק id + role
// //   const [isReady, setIsReady] = useState(false);
// //   const apiUtils = new ApiUtils();

// //   useEffect(() => {
// //     try {
// //       const storedUser = localStorage.getItem("user");
// //       if (storedUser) {
// //         const parsedUser = JSON.parse(storedUser);
// //         if (parsedUser && parsedUser.id && parsedUser.role) {
// //           setUser(parsedUser);
// //         }
// //       }
// //     } catch (error) {
// //       console.error("Failed to load user from localStorage:", error);
// //     } finally {
// //       setIsReady(true);
// //     }
// //   }, []);

// //   const role = user?.role || "guest";

// //   const login = (userData) => {
    
// //     // userData מכיל id, role ויתכן עוד שדות
// //     const { id, role,full_name,email } = userData;
// //     const minimalUser = { id, role,full_name,email};
// //     setUser();
// //     localStorage.setItem("user", JSON.stringify(minimalUser));
// //   };

// //   const logout = async () => {
// //     try {
// //       // 1) בקשה לשרת שימחק את ה‑JWT Cookie
// //       await apiUtils.post("http://localhost:3000/users/logout");
// //     } catch (err) {
// //       console.error("Failed to clear cookie on server:", err);
// //       // גם אם נכשל, נמשיך לנקות מקומית
// //     }
// //     setUser(null);
// //     localStorage.removeItem("user");
// //   };

// //   if (!isReady) return null; // או ספינר

// //   return (
// //     <AuthContext.Provider value={{ user, role, login, logout }}>
// //       {children}
// //     </AuthContext.Provider>
// //   );
// // }

// // export default AuthProvider;
// import { createContext, useState, useEffect ,useMemo } from "react";
// import ApiUtils from "../utils/ApiUtils";

// export const AuthContext = createContext();

// function AuthProvider({ children }) {
//   const [user, setUser] = useState(null); // {id, role}
//   const [isReady, setIsReady] = useState(false);
//     const logout = async () => {
//     try {
//       await apiUtils.post("http://localhost:3000/users/logout");
//     } catch (err) {
//       console.error("Failed to clear cookie on server:", err);
//     }

//     setUser(null);
//   };
//   const apiUtils =useMemo(() => new ApiUtils({ onUnauthorized: logout }), [logout]);

//   useEffect(() => {
//     const checkSession = async () => {
//       try {
//         const response = await apiUtils.get("http://localhost:3000/users/check-session");
//         if (response && response.id) {
//           setUser(response);
//         }
//       } catch (error) {
//         console.warn("Session check failed:", error);
//       } finally {
//         setIsReady(true);
//       }
//     };

//     checkSession();
//   }, []);

//   const login = (userData) => {
//     setUser(userData);
//   };
//   const role = user?.role || "guest";

//   if (!isReady) return null;

//   return (
//     <AuthContext.Provider value={{ user, role, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export default AuthProvider;

// import React, { createContext, useState, useEffect } from "react";
// import ApiUtils from "../utils/ApiUtils";

// export const AuthContext = createContext();

// function AuthProvider({ children }) {
//   const [user, setUser] = useState(null); // רק id + role
//   const [isReady, setIsReady] = useState(false);
//   const apiUtils = new ApiUtils();

//   useEffect(() => {
//     try {
//       const storedUser = localStorage.getItem("user");
//       if (storedUser) {
//         const parsedUser = JSON.parse(storedUser);
//         if (parsedUser && parsedUser.id && parsedUser.role) {
//           setUser(parsedUser);
//         }
//       }
//     } catch (error) {
//       console.error("Failed to load user from localStorage:", error);
//     } finally {
//       setIsReady(true);
//     }
//   }, []);

//   const role = user?.role || "guest";

//   const login = (userData) => {
    
//     // userData מכיל id, role ויתכן עוד שדות
//     const { id, role,full_name,email } = userData;
//     const minimalUser = { id, role,full_name,email};
//     setUser();
//     localStorage.setItem("user", JSON.stringify(minimalUser));
//   };

//   const logout = async () => {
//     try {
//       // 1) בקשה לשרת שימחק את ה‑JWT Cookie
//       await apiUtils.post("http://localhost:3000/users/logout");
//     } catch (err) {
//       console.error("Failed to clear cookie on server:", err);
//       // גם אם נכשל, נמשיך לנקות מקומית
//     }
//     setUser(null);
//     localStorage.removeItem("user");
//   };

//   if (!isReady) return null; // או ספינר

//   return (
//     <AuthContext.Provider value={{ user, role, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export default AuthProvider;
import { createContext, useState, useEffect ,useMemo } from "react";
import ApiUtils from "../utils/ApiUtils";

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // {id, role}
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
    <AuthContext.Provider value={{ user, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
