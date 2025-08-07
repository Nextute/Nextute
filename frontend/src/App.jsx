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
import InstituteDashboard from "./pages/InstituteDashBoard";

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
import InstituteOverviewPage from "./pages/InstituteOverviewPage";
import ServicesPage from "./pages/ServicesPage";

import InstitutesList from "./components/InstitutesList "; // Fixed import

import ErrorBoundary from "./components/ErrorBoundary"; // Add this file

import BlogPostPage from "./pages/BlogPostPage";
import InstituteComparePage from "./pages/InstituteComparePage";
import CompareResultPage from "./pages/CompareResultPage";

// test imports

import InstituteTeacher from "./components/Institute/Dashboard/InstituteTeacher";
import EditTeacher from "./components/Institute/Dashboard/EditTeacher";
import AddTeacher from "./components/Institute/Dashboard/AddTeacher";
import InstituteBatch from "./components/Institute/Dashboard/InstituteBatch";
import AddBatch from "./components/Institute/Dashboard/AddBatch";
import EditBatch from "./components/Institute/Dashboard/EditBatch";
import AddMedia from "./components/Institute/Dashboard/AddMedia";
import EditMedia from "./components/Institute/Dashboard/EditMedia";
import InstituteMedia from "./components/Institute/Dashboard/InstituteMedia";
import EditFacilities from "./components/Institute/Dashboard/EditFacilities";
import EditAchievements from "./components/Institute/Dashboard/EditAchievements";
import StudentFeedbackDashboard from "./pages/StudentFeedbackDashboard";
import SupportPage from "./pages/SupportPage";
import ViewTeacher from "./components/Institute/Dashboard/ViewTeacher";
import ViewBatch from "./components/Institute/Dashboard/ViewBatch";

import ForgotPasswordPopup from "./pages/ForgotPasswordPopup";
import ResetPassword from "./pages/ResetPassword";

const App = () => {
  // Use correct state names, not setters
  const { showSignup, showLogin, isAuthenticated, showForgotPassword } = useContext(AppContext);

  return (
    <div className="min-h-screen">
      <ScrollToTop />
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<HomePage />} />
           <Route path="/reset-password" element={<ResetPassword />} />
           <Route path="/forgot-password" element={<ForgotPasswordPopup />} />
          <Route path="/student/login" element={<StudentLogin />} />
          <Route path="/student/signup" element={<StudentSignup />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/edit-profile" element={<StudentDashboard />} />
          <Route
            path="/student/recommendations"
            element={<StudentDashboard />}
          />
          <Route
            path="/student/saved-institutes"
            element={<StudentDashboard />}
          />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogPostPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/institutes-data" element={<InstitutesList />} />
          <Route path="/institute-compare" element={<InstituteComparePage />} />
          <Route path="/compare-result" element={<CompareResultPage />} />
          <Route
            path="/student-feedback-dashboard"
            element={<StudentFeedbackDashboard />}
          />
          <Route path="/support" element={<SupportPage />} />
          <Route
            path="/institutes-on-location"
            element={<InstitutesOnLocation />}
          />
          <Route path="/institute/login" element={<InstituteLogin />} />
          <Route path="/institute/signup" element={<InstituteSignup />} />
          <Route path="/institute/dashboard" element={<InstituteDashboard />} />
          
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
          // test Routes
          
          <Route path="/institute/teachers" element={<InstituteTeacher />} />
          <Route path="/institute/edit-teacher/:id" element={<EditTeacher />} />
          <Route path="/institute/view-teacher/:id" element={<ViewTeacher />} />
          <Route path="/institute/facultiesdetails" element={<AddTeacher />} />
          <Route path="/institute/batches" element={<InstituteBatch />} />
          <Route path="/institute/add-batch" element={<AddBatch />} />
          <Route path="/institute/edit-batch/:id" element={<EditBatch />} />
          <Route path="/institute/view-batch/:id" element={<ViewBatch />} />
          <Route
            path="/institute/photos-and-videos"
            element={<InstituteMedia />}
          />
          <Route path="/institute/add-media" element={<AddMedia />} />
          <Route
            path="/institute/edit-media/:type/:id"
            element={<EditMedia />}
          />
          <Route
            path="/institute/edit-facilities"
            element={<EditFacilities />}
          />
          <Route
            path="/institute/edit-achievements/:type"
            element={<EditAchievements />}
          />
        </Routes>
        {showLogin && <LoginPopup />}
        {showSignup && <SignupPopup />}
       
        <Toaster />
      </ErrorBoundary>
    </div>
  );
};

export default App;
