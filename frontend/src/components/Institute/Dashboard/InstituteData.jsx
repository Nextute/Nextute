import Cookies from "js-cookie";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../../context/AppContext";
import axios from "axios";

export const useFetchInstituteData = () => {
  const [instituteData, setInstituteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasRenderedOnce, setHasRenderedOnce] = useState(false);
  const { VITE_BACKEND_BASE_URL, isAuthenticated } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInstituteData = async () => {
      try {
        const token = Cookies.get("authToken");
        if (!VITE_BACKEND_BASE_URL || !token) {
          throw new Error("Missing backend URL or auth token");
        }

        const response = await axios.get(
          `${VITE_BACKEND_BASE_URL}/api/institutes/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        if (!response.data) {
          throw new Error("Institute data not found");
        }

        setInstituteData(response.data);
      } catch (err) {
        Cookies.remove("authToken");
        Cookies.remove("user");

        const shouldRedirect =
          err?.response?.status === 401 ||
          err?.response?.status === 403 ||
          err.message?.includes("auth");

        if (shouldRedirect) {
          navigate("/institute/login", {
            state: { error: "Please log in again" },
          });
        } else {
          setError("Failed to load institute profile");
        }
      } finally {
        setLoading(false);
        setHasRenderedOnce(true);
      }
    };

    if (isAuthenticated) {
      fetchInstituteData();
    }
  }, [VITE_BACKEND_BASE_URL, isAuthenticated, navigate]);

  return { instituteData, loading, error, hasRenderedOnce };
};
