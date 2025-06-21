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
import BasicInfo from "./components/Institute/Dashboard/BasicInfo";
import Contact from "./components/Institute/Dashboard/Contact";
import CourseOffered from "./components/Institute/Dashboard/CourseOffered";
import FacultiesDetails from "./components/Institute/Dashboard/FacultiesDetails";
import Facilities from "./components/Institute/Dashboard/Facilities";
import MediaGallery from "./components/Institute/Dashboard/MediaGallery";

import LoginPopup from "./pages/LoginPopup";
import SignupPopup from "./pages/SignupPopup";
import EmailVerificationPage from "./pages/EmailVerificationPage";

import { AppContext } from "./context/AppContext";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const { setShowSignup, setShowLogin, isAuthenticated } =
    useContext(AppContext);

  return (
    <div className="h-screen">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/student/signup" element={<StudentSignup />} />
        <Route path="/student/dashboard/" element={<StudentDashboard />} />

        <Route
          path="/institutes-on-location"
          element={<InstitutesOnLocation />}
        />
        <Route path="/institute/login" element={<InstituteLogin />} />
        <Route path="/institute/signup" element={<InstituteSignup />} />
        <Route path="/basicinfo" element={<BasicInfo />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/courseoffered" element={<CourseOffered />} />
        <Route path="/facultiesdetails" element={<FacultiesDetails />} />
        <Route path="/facilities" element={<Facilities />} />
        <Route path="/mediagallery" element={<MediaGallery />} />
        <Route path="/verify" element={<EmailVerificationPage />} />
      </Routes>

      {setShowLogin && <LoginPopup />}
      {setShowSignup && <SignupPopup />}

      <Toaster />
    </div>
  );
};

export default App;
