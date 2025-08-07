import { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { Toaster } from "react-hot-toast";

import StudentSignup from "./components/Student/StudentSignup";
import StudentLogin from "./components/Student/StudentLogin";
import StudentDashboard from "./pages/StudentDashboard";

import InstitutesOnLocation from "./pages/InstitutesOnLocation";
import InstituteLogin from "./components/Institute/InstituteLogin";
import InstituteSignup from "./components/Institute/InstituteSignup";

import LoginPopup from "./pages/LoginPopup";
import SignupPopup from "./pages/SignupPopup";
import EmailVerificationPage from "./pages/EmailVerificationPage";

import { AppContext } from "./context/AppContext";
import BasicInfoPage from "./pages/InstituteRegistration/BasicInfoPage";
import ContactPage from "./pages/InstituteRegistration/ContactPage";
import CoursesPage from "./pages/InstituteRegistration/CoursesPage";
import FacilitiesPage from "./pages/InstituteRegistration/FacilitiesPage";
import FacultiesPage from "./pages/InstituteRegistration/FacultiesPage";
import StudentAchievementsPage from "./pages/InstituteRegistration/StudentAchievementsPage";
import InstituteAchievementsPage from "./pages/InstituteRegistration/InstituteAchievementsPage";
import MediaGalleryPage from "./pages/InstituteRegistration/MediaGalleryPage";
import SocialMediaPage from "./pages/InstituteRegistration/SocialMediaPage";
import AboutUsPage from "./pages/AboutUsPage";
import ScrollToTop from "./components/ScrollToTop";
import ReviewPage from "./pages/ReviewPage";
import FAQPage from "./pages/FAQPage";
import BlogPage from "./pages/BlogPage";
import InstituteOverviewPage from "./pages/InstituteRegistration/InstituteOverviewPage";
import ServicesPage from "./pages/ServicesPage";

import InstitutesList from "./components/InstitutesList "; // Fixed import

import ErrorBoundary from "./components/ErrorBoundary"; // Add this file
import SearchPage from "./pages/SearchPage";

import ForgotPasswordPopup from "./pages/ForgotPasswordPopup";
import ResetPassword from "./pages/ResetPassword";

const App = () => {
  // Use correct state names, not setters
  const { showSignup, showLogin, showForgotPassword } = useContext(AppContext);

  return (
    <div className="min-h-screen">
      <ScrollToTop />
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/student/login" element={<StudentLogin />} />
          <Route path="/student/signup" element={<StudentSignup />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/institutes-data" element={<InstitutesList />} />
          <Route
            path="/institutes-on-location"
            element={<InstitutesOnLocation />}
          />
          <Route path="/institute/login" element={<InstituteLogin />} />
          <Route path="/institute/signup" element={<InstituteSignup />} />
          <Route path="/institute/basic-info" element={<BasicInfoPage />} />
          <Route path="/institute/contact" element={<ContactPage />} />
          <Route path="/institute/courses" element={<CoursesPage />} />
          <Route path="/institute/faculties" element={<FacultiesPage />} />
          <Route
            path="/institute/student-achievements"
            element={<StudentAchievementsPage />}
          />
          <Route
            path="/institute/institute-achievements"
            element={<InstituteAchievementsPage />}
          />
          <Route path="/institute/facilities" element={<FacilitiesPage />} />
          <Route path="/institute/media" element={<MediaGalleryPage />} />
          <Route path="/institute/social" element={<SocialMediaPage />} />
          <Route
            path="/institute/overview/:id"
            element={<InstituteOverviewPage />}
          />
          <Route
            path="/institute/overview"
            element={<InstituteOverviewPage />}
          />
          <Route path="/verify" element={<EmailVerificationPage />} />

          <Route path="/search" element={<SearchPage />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
        {showLogin && <LoginPopup />}
        {showSignup && <SignupPopup />}
        {showForgotPassword && <ForgotPasswordPopup />}
        <Toaster />
      </ErrorBoundary>
    </div>
  );
};

export default App;
