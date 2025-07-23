import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";

const useInstitutes = (baseURL) => {
  const { institutes, setInstitutes, institutesLoaded, setInstitutesLoaded } =
    useContext(AppContext);
  const [loading, setLoading] = useState(!institutesLoaded);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (institutesLoaded) return;

    const fetchData = async () => {
      setLoading(true);
      try {

        const res = await axios.get(
          `${baseURL}/api/institutes/all-institutes`,
          { withCredentials: true }
        );
        console.log("Institutes API response:", res.data);
        if (res.data.status) {
          setInstitutes(res.data.data);
          setInstitutesLoaded(true);
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

  }, [institutesLoaded, baseURL, setInstitutes, setInstitutesLoaded]);

  return { institutes, loading, error };
};

export default useInstitutes;
