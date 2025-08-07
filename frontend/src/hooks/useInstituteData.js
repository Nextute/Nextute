import { useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import Cookies from "js-cookie";
import { AppContext } from "../context/AppContext";

const LOCAL_STORAGE_KEY = "instituteDashboardData";

export const useInstituteData = () => {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    VITE_BACKEND_BASE_URL,
    user,
    userType,
    logout,
    loading: authLoading,
  } = useContext(AppContext);

  const [instituteDashboardData, setInstituteDashboardData] = useState(() => {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    return cached ? JSON.parse(cached) : [];
  });

  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasRenderedOnce, setHasRenderedOnce] = useState(() => {
    return !!localStorage.getItem(LOCAL_STORAGE_KEY);
  });

  const fetchInstituteData = useCallback(
    async (abortController) => {
      setDataLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${VITE_BACKEND_BASE_URL}/api/institutes/profile`,
          {
            withCredentials: true,
            signal: abortController?.signal,
          }
        );

        if (!response.data) {
          throw new Error("No institute data received.");
        }

        const data = response.data.data;
        setInstituteDashboardData(data);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
      } catch (err) {
        if (err.name === "CanceledError") return;

        const status = err.response?.status;

        if (status === 401 || status === 403) {
          toast.error("Session expired. Please log in again.");
          Cookies.remove("authToken");
          Cookies.remove("user");
          logout();
          navigate("/institute/login", {
            state: { error: "Please log in again" },
          });
        } else {
          const msg = err.message || "Failed to load institute data.";
          setError(msg);
          toast.error(msg);
        }
      } finally {
        setDataLoading(false);
        setHasRenderedOnce(true);
      }
    },
    [VITE_BACKEND_BASE_URL, logout, navigate]
  );

  useEffect(() => {
    const abortController = new AbortController();

    if (!authLoading) {
      if (isAuthenticated && userType === "institute" && user) {
        fetchInstituteData(abortController);
      } else {
        navigate("/institute/login", {
          state: { error: "Please log in as an institute" },
        });
      }
    }

    return () => abortController.abort();
  }, [
    authLoading,
    isAuthenticated,
    user,
    userType,
    fetchInstituteData,
    navigate,
  ]);

  return { instituteDashboardData, dataLoading, error, hasRenderedOnce };
};
