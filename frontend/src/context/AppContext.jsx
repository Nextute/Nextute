import { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const VITE_BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);

  // Restore auth state from cookies on app load
  useEffect(() => {
    try {
      const token = Cookies.get("authToken");
      const userData = Cookies.get("user");

      if (token) setAuthToken(token);
      if (userData) setUser(JSON.parse(userData));
    } catch (error) {
      console.error("Error loading auth data from cookies:", error);
      // Clear invalid cookies
      Cookies.remove("authToken");
      Cookies.remove("user");
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout function to clear cookies and reset state
  const logout = () => {
    Cookies.remove("authToken");
    Cookies.remove("user");
    setAuthToken(null);
    setUser(null);
    setShowLogin(false);
    setShowSignup(false);
    setShowEmailVerification(false);
  };

  const value = {
    VITE_BACKEND_BASE_URL,
    showLogin,
    setShowLogin,
    showSignup,
    setShowSignup,
    showEmailVerification,
    setShowEmailVerification,
    user,
    setUser,
    authToken,
    setAuthToken,
    isAuthenticated: !!authToken && !!user,
    logout,
    loading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
