// components/ProtectedRoute.jsx
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Cookies from "js-cookie";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AppContext);
  const token = Cookies.get("authToken");

  
  if (!isAuthenticated || !token) {
    // Redirect to login if not authenticated
    return <Navigate to="/student/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
