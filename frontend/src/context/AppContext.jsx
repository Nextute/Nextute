import { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const VITE_BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

  // Initialize state from localStorage
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [userType, setUserType] = useState(() => {
    return localStorage.getItem("userType");
  });

  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shouldFetchUser, setShouldFetchUser] = useState(true);
  const [institutes, setInstitutes] = useState([]);
  const [institutesLoaded, setInstitutesLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  // Helper to get token from cookies
  const getToken = () => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("authToken="))
      ?.split("=")[1];
    return token?.trim() || null;
  };

  // Helper to delete cookies (supports http & https)
  const deleteCookie = (name) => {
    document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Strict; ${
      window.location.protocol === "https:" ? "Secure" : ""
    }`;
  };

  // Fetch user based on token
  const fetchUser = useCallback(
    async (abortController) => {
      if (!shouldFetchUser) return;
      setLoading(true);

      try {
        const token = getToken();
        if (!token) {
          console.log("No token found, skipping fetchUser");
          setUser(null);
          setUserType(null);
          setLoading(false);
          setShouldFetchUser(false);
          localStorage.removeItem("authToken");
          return;
        }

        let response;

        try {
          response = await axios.get(
            `${VITE_BACKEND_BASE_URL}/api/students/profile`,
            {
              withCredentials: true,
              signal: abortController?.signal,
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setUser(response.data.data);
          setUserType("student");
          localStorage.setItem("userType", "student");
        } catch (studentError) {
          if (studentError.name === "CanceledError") return;
          response = await axios.get(
            `${VITE_BACKEND_BASE_URL}/api/institutes/profile`,
            {
              withCredentials: true,
              signal: abortController?.signal,
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setUser(response.data.data);
          setUserType("institute");
          localStorage.setItem("userType", "institute");
        }

        localStorage.setItem("user", JSON.stringify(response.data.data));
        localStorage.setItem("authToken", token);
      } catch (error) {
        if (error.name !== "CanceledError") {
          console.error("Fetch user error:", error.message);
          setUser(null);
          setUserType(null);
          localStorage.removeItem("user");
          localStorage.removeItem("userType");
          localStorage.removeItem("authToken");
        }
      } finally {
        setLoading(false);
        setShouldFetchUser(false);
      }
    },
    [shouldFetchUser, VITE_BACKEND_BASE_URL]
  );

  // Fetch user on mount or when shouldFetchUser changes
  // useEffect(() => {
  //   const abortController = new AbortController();
  //   fetchUser(abortController);
  //   return () => abortController.abort();
  // }, [fetchUser]);

  useEffect(() => {
    const abortController = new AbortController();

    const token = getToken();

    if (!token) {
      console.log("Token not set yet");
      return;
    }

    // Fetch user after a short delay
    const timer = setTimeout(() => {
      fetchUser(abortController);
    }, 100);

    return () => {
      clearTimeout(timer);
      abortController.abort();
    };
  }, [fetchUser]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      const endpoint =
        userType === "student"
          ? "/api/students/logout"
          : "/api/institutes/logout";

      await axios.post(
        `${VITE_BACKEND_BASE_URL}${endpoint}`,
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Logout error:", err.message);
    } finally {
      setUser(null);
      setUserType(null);
      setShowLogin(false);
      setShowSignup(false);
      setShowEmailVerification(false);
      setShouldFetchUser(true);

      // Clear storage
      localStorage.removeItem("user");
      localStorage.removeItem("userType");
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("verify_email");
      sessionStorage.removeItem("verify_user_type");

      // Clear cookies
      deleteCookie("authToken");
      deleteCookie("user");
    }
  }, [userType, VITE_BACKEND_BASE_URL]);

  // Axios interceptor for handling 401 errors
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (
          error.response?.status === 401 &&
          !error.config.url.includes("/verify") &&
          !error.config.url.includes("/resend-verification")
        ) {
          logout();
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, [logout]);

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
    institutes,
    setInstitutes,
    institutesLoaded,
    setInstitutesLoaded,
    userLocation,
    setUserLocation,
    showForgotPassword,
    setShowForgotPassword,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
