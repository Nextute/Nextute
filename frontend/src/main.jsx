import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import AppContextProvider from "./context/AppContext.jsx";

const cleanLocalStorage = () => {
  try {
    const userData = localStorage.getItem("user");
    const authToken = localStorage.getItem("authToken");
    if (userData === "undefined" || userData === "null") {
      localStorage.removeItem("user");
    }
    if (authToken === "undefined" || authToken === "null") {
      localStorage.removeItem("authToken");
    }
  } catch (error) {
    console.error("Error cleaning localStorage:", error);
  }
};

cleanLocalStorage();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </BrowserRouter>
  </StrictMode>
);
