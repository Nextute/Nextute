import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";

import DashboardHeader from "../components/Student/Dashboard/DashboardHeader";
import MainContent from "../components/Student/Dashboard/MainContent";
import ProfileSection from "../components/Student/Dashboard/ProfileSection";
import ContactInfo from "../components/Student/Dashboard/ContactInfo";
import { AppContext } from "../context/AppContext";

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasRenderedOnce, setHasRenderedOnce] = useState(false);
  const navigate = useNavigate();
  const { VITE_BACKEND_BASE_URL, isAuthenticated } = useContext(AppContext);

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        const token = Cookies.get("authToken");

        if (!VITE_BACKEND_BASE_URL || !token) {
          throw new Error("Missing backend URL or auth token");
        }

        const response = await axios.get(
          `${VITE_BACKEND_BASE_URL}/api/students/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        if (!response.data) {
          throw new Error("Profile data not found");
        }

        setStudentData(response.data);
      } catch (err) {
        Cookies.remove("authToken");
        Cookies.remove("user");

        const shouldRedirect =
          err?.response?.status === 401 ||
          err?.response?.status === 403 ||
          err.message?.includes("auth");

        if (shouldRedirect) {
          navigate("/student/login", {
            state: { error: "Please log in again" },
          });
        } else {
          setError("Failed to load student profile");
        }
      } finally {
        setLoading(false);
        setHasRenderedOnce(true);
      }
    };

    if (isAuthenticated) {
      fetchStudentProfile();
    }
  }, [VITE_BACKEND_BASE_URL, isAuthenticated, navigate]);

  const [error, setError] = useState(null);

  // Show error toast only once after render is completed
  useEffect(() => {
    if (!loading && hasRenderedOnce) {
      if (error) {
        toast.error(error);
      } else if (!studentData) {
        toast.error("No student data found.");
      }
    }
  }, [loading, hasRenderedOnce, error, studentData]);

  return (
    <div className="relative min-h-screen">
      {loading && (
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
      )}

      {/* Main Content with blur on loading */}
      <div
        className={`${
          loading ? "blur-sm pointer-events-none select-none" : ""
        }`}
      >
        {studentData && (
          <div className="w-full bg-white mx-auto">
            <DashboardHeader studentData={studentData} />
            <main className="w-full px-5 sm:px-14 py-4">
              <ProfileSection studentData={studentData} />
              <div className="w-full h-full flex flex-col lg:flex-row gap-4 items-stretch">
                <div className="w-full lg:w-[70%]">
                  <MainContent studentData={studentData} />
                </div>
                <div className="w-full lg:w-[30%]">
                  <ContactInfo studentData={studentData} />
                </div>
              </div>
            </main>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
