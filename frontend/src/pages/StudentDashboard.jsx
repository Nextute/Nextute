import { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

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
  } = useContext(AppContext);

  console.log("User data in StudentDashboard:", user);

  const [error, setError] = useState(null);
  const [hasRenderedOnce, setHasRenderedOnce] = useState(false);

  // Redirect if not authenticated as student
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated || userType !== "student") {
        navigate("/student/login", {
          state: { error: "Please log in as a student" },
        });
      } else {
        setHasRenderedOnce(true);
      }
    }
  }, [authLoading, isAuthenticated, userType, navigate]);

  // Show error toast only once after first render
  useEffect(() => {
    if (hasRenderedOnce && error) {
      toast.error(error);
    }
  }, [error, hasRenderedOnce]);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {authLoading && (
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
          authLoading ? "blur-sm pointer-events-none select-none" : ""
        }`}
      >
        {user ? (
          <div className="w-full flex-grow  bg-white mx-auto">
            <DashboardHeader studentData={user} logout={logout} />
            <main className="w-full px-5 sm:px-14 py-4">
              <ProfileSection studentData={user} />
              <div className="w-full h-full flex flex-col lg:flex-row gap-4 items-stretch">
                <div className="w-full lg:w-[70%]">
                  <MainContent studentData={user} />
                </div>
                <div className="w-full lg:w-[30%]">
                  <ContactInfo studentData={user} />
                </div>
              </div>
            </main>
          </div>
        ) : (
          !authLoading && (
            <div className="text-center mt-10 text-red-600">
              No student data available.
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
