import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";

const useInstitutes = () => {
  const {
    VITE_BACKEND_BASE_URL,
    institutes,
    setInstitutes,
    institutesLoaded,
    setInstitutesLoaded,
  } = useContext(AppContext);

  const [loading, setLoading] = useState(!institutesLoaded);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (institutesLoaded) return;

    // === LocalStorage Load & Expiry Check ===
    const localCache = localStorage.getItem("cachedInstitutes");
    if (localCache) {
      try {
        const parsed = JSON.parse(localCache);
        const cacheTime = parsed.timestamp;
        const now = Date.now();
        const sevenDays = 7 * 24 * 60 * 60 * 1000;

        if (now - cacheTime < sevenDays) {
          // Cache is still valid
          setInstitutes(parsed.data);
          setInstitutesLoaded(true);
          setLoading(false);
          return;
        } else {
          // Cache expired
          localStorage.removeItem("cachedInstitutes");
        }
      } catch (err) {
        console.error("Invalid localStorage cache:", err);
        localStorage.removeItem("cachedInstitutes");
      }
    }

    // === Fallback to API if no cache or expired ===
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${VITE_BACKEND_BASE_URL}/api/institutes/all-institutes`,
          { withCredentials: true }
        );

        console.log("insitutes data ", res);
        
        console.log("Institutes API response:", res.data);
        if (res.data.status) {
          setInstitutes(res.data.data);
          setInstitutesLoaded(true);
          localStorage.setItem(
            "cachedInstitutes",
            JSON.stringify({
              data: res.data.data,
              timestamp: Date.now(),
            })
          );
        } else {
          throw new Error(res.data.message || "Data fetch failed");
        }
      } catch (err) {
        console.error("Error fetching institutes:", err);
        setError(
          err.response?.data?.message ||
            "Unable to load institutes. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    institutesLoaded,
    VITE_BACKEND_BASE_URL,
    setInstitutes,
    setInstitutesLoaded,
  ]);

  return { institutes, loading, error, setLoading, setError };
};

export default useInstitutes;
