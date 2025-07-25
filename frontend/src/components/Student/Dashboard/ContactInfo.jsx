import { useRef, useState } from "react";
import { assets } from "../../../assets/assets";

const ContactInfo = ({ studentData }) => {
  const [editing, setEditing] = useState({
    phone_number: false,
    guardianPhone: false,
  });
  const [phoneNumber, setPhoneNumber] = useState(
    studentData?.phone_number || ""
  );
  const [guardianPhone, setGuardianPhone] = useState(
    studentData?.guardianPhone || ""
    
  );
  const phoneInputRef = useRef(null);
  const guardianPhoneInputRef = useRef(null);

  const handleEdit = (field) => {
    setEditing((prev) => ({
      ...prev,
      [field]: true,
    }));
    setTimeout(() => {
      if (field === "phone_number") {
        phoneInputRef.current.focus();
      } else if (field === "guardianPhone") {
        guardianPhoneInputRef.current.focus();
      }
    }, 0);
  };

  const handleSave = (field) => {
    setEditing((prev) => ({
      ...prev,
      [field]: false,
    }));
    // Optionally, send updated data to backend here
    // e.g., field === 'phone_number' ? updatePhoneNumber(phoneNumber) : updateGuardianPhone(guardianPhone);
  };

  const contactFields = [
    {
      icon: assets.phone,
      label: "Phone number",
      value: phoneNumber,
      onChange: (e) => setPhoneNumber(e.target.value),
      ref: phoneInputRef,
      fieldKey: "phone_number",
      editable: true,
      placeholder: studentData?.phone_number || "Not provided",
    },
    {
      icon: assets.contact_email,
      label: "Email address",
      value: studentData?.email || "",
      onChange: () => {}, // No-op since email is not editable
      fieldKey: "email",
      editable: false,
      placeholder: studentData?.email || "Not provided",
    },
    {
      icon: assets.phone,
      label: "Guardian phone number",
      value: guardianPhone,
      onChange: (e) => setGuardianPhone(e.target.value),
      ref: guardianPhoneInputRef,
      fieldKey: "guardianPhone",
      editable: true,
      placeholder: studentData?.data?.guardianPhone || "Not provided",
    },
  ];

  return (
    <div className="w-full h-full  bg-white  sm:px-6 py-4">
      <div className="w-full h-[34.5rem] mx-auto bg-[#E6EDE2] border border-[#000] rounded-3xl shadow-sm px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="flex flex-col items-center justify-center gap-2 pb-4 border-b-2 border-dashed border-black">
          <img
            src={assets.dashboard_contact}
            alt="Dashboard Contact Icon"
            className="w-6 h-6"
          />
          <p className="text-xl font-semibold text-black">Contact Info</p>
        </div>

        {/* Contact Fields */}
        {contactFields.map((field, index) => (
          <div className="mt-6" key={index}>
            {/* Label */}
            <div className="flex items-center gap-2 pb-1">
              <img
                src={field.icon}
                alt={`${field.label} Icon`}
                className="w-5 h-5 sm:w-6 sm:h-6"
              />
              <p className="text-base sm:text-lg font-semibold text-black">
                {field.label}
              </p>
            </div>

            {/* Input + Edit/Save Button */}
            <div className="flex items-center justify-between gap-2 py-2 border-b-2 border-dashed border-black">
              <input
                type="text"
                placeholder={field.placeholder}
                value={field.value}
                onChange={field.onChange}
                disabled={!field.editable || !editing[field.fieldKey]}
                ref={field.ref}
                className={`flex-1 px-2 py-1 text-sm sm:text-base text-[#263238] font-medium focus:outline-none ${
                  field.editable && editing[field.fieldKey]
                    ? "bg-white border border-gray-400 rounded-md"
                    : "bg-transparent disabled:cursor-not-allowed"
                }`}
              />
              {field.editable && (
                <button
                  onClick={() =>
                    editing[field.fieldKey]
                      ? handleSave(field.fieldKey)
                      : handleEdit(field.fieldKey)
                  }
                  className="text-[#263238] font-medium text-sm sm:text-base underline"
                >
                  {editing[field.fieldKey] ? "Save" : "Edit"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactInfo;
