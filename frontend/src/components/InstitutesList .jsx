import React from "react";
import HorizontalCard from "./HorizontalCard";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import useInstitutes from "../hooks/useInstitutes";

const InstitutesList = () => {
  const { VITE_BACKEND_BASE_URL } = useContext(AppContext);
  const { institutes, loading, error } = useInstitutes(VITE_BACKEND_BASE_URL);

  if (loading) return <div className="text-center py-4">Loading institutes...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <div className="px-4 sm:px-8 py-4">
      {institutes.map((institute) => (
        <HorizontalCard
          key={institute.id}
          name={institute.basic_info?.name || institute.institute_name}
          address={
            institute.contact_details?.headOffice?.address || "Not Available"
          }
          contact={institute.contact}
          tags={institute.courses?.courses?.map((course) => course.name) || []}
          image= {institute.basic_info?.logoURL}
        />
      ))}
    </div>
  );
};

export default InstitutesList;