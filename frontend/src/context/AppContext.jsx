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
  const [shouldFetchUser, setShouldFetchUser] = useState(true);

  const fetchUser = async (abortController) => {
    if (!shouldFetchUser) return;
    setLoading(true);

    try {
      const studentRes = await axios.get(
        `${VITE_BACKEND_BASE_URL}/api/students/profile`,
        {
          withCredentials: true,
          signal: abortController?.signal,
        }
      );
      setUser(studentRes.data);
      setUserType("student");
    } catch (error) {
      if (error.name === "CanceledError") return;
      try {
        const instituteRes = await axios.get(
          `${VITE_BACKEND_BASE_URL}/api/institutes/profile`,
          {
            withCredentials: true,
            signal: abortController?.signal,
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
      setShouldFetchUser(false);
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    fetchUser(abortController);
    return () => abortController.abort();
  }, []);

  useEffect(() => {
    if (shouldFetchUser) {
      const abortController = new AbortController();
      fetchUser(abortController);
      return () => abortController.abort();
    }
  }, [shouldFetchUser]);

  const logout = async () => {
    try {
      if (userType === "student") {
        await axios.post(
          `${VITE_BACKEND_BASE_URL}/api/students/logout`,
          {},
          { withCredentials: true }
        );
      } else if (userType === "institute") {
        await axios.post(
          `${VITE_BACKEND_BASE_URL}/api/institutes/logout`,
          {},
          { withCredentials: true }
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
      setShouldFetchUser(false);
    }
  };

  // Axios interceptor for handling 401 errors
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

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
    setShouldFetchUser,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
