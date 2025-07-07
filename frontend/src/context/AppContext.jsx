import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const VITE_BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);

  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shouldFetchUser, setShouldFetchUser] = useState(false);

  const fetchUser = async () => {
    setLoading(true); // ✅ loading start here

    try {
      const studentRes = await axios.get(
        `${VITE_BACKEND_BASE_URL}/api/students/profile`,
        {
          withCredentials: true,
        }
      );
      setUser(studentRes.data);
      setUserType("student");
    } catch {
      try {
        const instituteRes = await axios.get(
          `${VITE_BACKEND_BASE_URL}/api/institutes/profile`,
          {
            withCredentials: true,
          }
        );
        setUser(instituteRes.data);
        setUserType("institute");
      } catch {
        setUser(null);
        setUserType(null);
      }
    } finally {
      setLoading(false); 
    }
  };

  // Initial load on mount
  useEffect(() => {
    fetchUser();
  }, []); 

  // Fetch user again only when shouldFetchUser becomes true (e.g. after login)
  useEffect(() => {
    if (shouldFetchUser) {
      fetchUser();
      setShouldFetchUser(false);
    }
  }, [shouldFetchUser]);

  // Optional: Refetch user after login/signup modals close
  // But only if needed, can be removed if you manage shouldFetchUser correctly
  /*
  useEffect(() => {
    if (!showLogin && !showSignup) {
      fetchUser();
    }
  }, [showLogin, showSignup]);
  */

  const logout = async () => {
    try {
      if (userType === "student") {
        await axios.post(
          `${VITE_BACKEND_BASE_URL}/api/students/logout`,
          {},
          {
            withCredentials: true,
          }
        );
      } else if (userType === "institute") {
        await axios.post(
          `${VITE_BACKEND_BASE_URL}/api/institutes/logout`,
          {},
          {
            withCredentials: true,
          }
        );
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      setUserType(null);
      setShowLogin(false);
      setShowSignup(false);
      setShowEmailVerification(false);
    }
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
    userType,
    setUserType,
    isAuthenticated: !!user && !!userType,
    logout,
    loading,
    shouldFetchUser,
    setShouldFetchUser, // Important: expose this so Login can trigger fetchUser after login
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
