import { useEffect, useContext, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios"; // Switched to axios for consistency
import DashboardHeader from "../components/Student/Dashboard/DashboardHeader";
import MainContent from "../components/Student/Dashboard/MainContent";
import ProfileSection from "../components/Student/Dashboard/ProfileSection";
import ContactInfo from "../components/Student/Dashboard/ContactInfo";
import { AppContext } from "../context/AppContext";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const {
    user,
    userType,
    isAuthenticated,
    loading: authLoading,
    logout,
    VITE_BACKEND_BASE_URL,
  } = useContext(AppContext);

  const [dashboardData, setDashboardData] = useState(null);
  const [studentProfile, setStudentProfile] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState(null);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const fetchDashboardData = useCallback(
    async (abortController) => {
      setDataLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${VITE_BACKEND_BASE_URL}/api/students/profile`,
          {
            withCredentials: true,
            signal: abortController?.signal,
          }
        );
        if (!response.data) {
          throw new Error("No dashboard data received.");
        }
        // Set both dashboard data and student profile from the API response
        setDashboardData(response.data);
        setStudentProfile(response.data.data); // Extract the student data from the response
        console.log("Student profile data:", response.data.data); // Debug log
      } catch (err) {
        if (err.name === "CanceledError") return;
        if (err.response?.status === 401) {
          toast.error("Session expired. Please log in again.");
          logout();
          navigate("/student/login");
        } else {
          setError(err.message || "Failed to load dashboard data.");
          toast.error(err.message || "Failed to load dashboard data.");
        }
      } finally {
        setDataLoading(false);
      }
    },
    [logout, navigate]
  );

  const handleLogout = async () => {
    if (logoutLoading) return;
    setLogoutLoading(true);
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/student/login");
    } catch (err) {
      toast.error("Failed to log out");
    } finally {
      setLogoutLoading(false);
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    if (!authLoading) {
      if (isAuthenticated && userType === "student" && user) {
        fetchDashboardData(abortController);
      } else {
        navigate("/student/login", {
          state: { error: "Please log in as a student" },
        });
      }
    }
    return () => abortController.abort();
  }, [
    authLoading,
    isAuthenticated,
    userType,
    user,
    fetchDashboardData,
    navigate,
    VITE_BACKEND_BASE_URL,
  ]);

  if (authLoading || dataLoading) {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/60">
        <div className="relative w-36 h-36">
          <div className="w-full h-full border-8 border-[#256357] border-dashed rounded-full animate-spin border-t-transparent"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-[#256357] font-semibold text-sm sm:text-2xl">
              Loading...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-600">{error}</p>
        <button
          className="mt-4 px-4 py-2 bg-[#256357] text-white rounded hover:bg-[#1F4C56] transition"
          onClick={() => fetchDashboardData()}
          disabled={dataLoading}
        >
          {dataLoading ? "Retrying..." : "Retry"}
        </button>
      </div>
    );
  }

  if (!user || !studentProfile) {
    return (
      <div className="text-center mt-10 text-red-600">
        No student data available. Please log in again.
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div
        className={`${
          authLoading || dataLoading
            ? "blur-sm pointer-events-none select-none"
            : ""
        }`}
      >
        <div className="w-full flex-grow bg-white mx-auto">
          <DashboardHeader
            studentData={studentProfile}
            logout={handleLogout}
            logoutLoading={logoutLoading}
          />
          <main className="w-full px-5 sm:px-14 py-4">
            <ProfileSection studentData={studentProfile} />
            <div className="w-full h-full flex flex-col lg:flex-row gap-4 items-stretch">
              <div className="w-full lg:w-[70%]">
                <MainContent studentData={studentProfile} dashboardData={dashboardData} />
              </div>
              <div className="w-full lg:w-[30%]">
                <ContactInfo studentData={studentProfile} />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
