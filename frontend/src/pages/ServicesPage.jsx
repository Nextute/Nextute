import StudentServicesPage from "./StudentServicesPage";
import InstituteServicesPage from "./InstituteServicesPage";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const onBack = () => {
  window.history.back();
};

const ServicesPage = () => {
  const { userType } = useContext(AppContext);

  return userType === "institute" ? (
    <InstituteServicesPage onBack={onBack} />
  ) : (
    <StudentServicesPage onBack={onBack} />
  );
};

export default ServicesPage;
