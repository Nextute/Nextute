import React from "react";
import { FiUpload } from "react-icons/fi";
import Header from "./Header";

const BasicInfo = () => {
  const [formData, setFormData] = React.useState({
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    contactNumber: "",
    email: "",
    subject: "",
    experience: "",
    qualification: "",
    salary: "",
    photo: null,
    declaration: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (
      file &&
      (file.type === "image/png" || file.type === "application/pdf")
    ) {
      setFormData((prev) => ({ ...prev, photo: file }));
    } else {
      alert("Please upload a PNG or PDF file");
    }
  };

  const handleSubmit = () => {
    if (!formData.declaration) {
      alert("Please agree to the declaration");
      return;
    }
    if (!formData.firstName || !formData.lastName || !formData.email) {
      alert("Please fill in all required fields");
      return;
    }
    console.log("Form submitted:", formData);
    alert("Faculty details submitted successfully!");
    setFormData({
      firstName: "",
      middleName: "",
      lastName: "",
      gender: "",
      contactNumber: "",
      email: "",
      subject: "",
      experience: "",
      qualification: "",
      salary: "",
      photo: null,
      declaration: false,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6">
        <div className="flex items-center mb-4">
          <h1 className="text-2xl font-bold text-green-600">NEXTUTE</h1>
        </div>
        <h2 className="text-xl font-semibold mb-4">Faculties Details</h2>

        <div className="flex border-b border-gray-300 mb-6">
          {[
            "Basic Information",
            "Contact Details",
            "Course Offered",
            "Faculties Details",
            "Achievements",
            "Faculties",
            "Media & Gallery",
            "Social Media",
          ].map((tab, index) => (
            <button
              key={index}
              className={`px-4 py-2 text-sm font-medium ${
                tab === "Faculties Details"
                  ? "border-b-2 border-green-500 text-green-500"
                  : "text-gray-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Middle Name
            </label>
            <input
              type="text"
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contact Number
            </label>
            <input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              E-mail
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Subject Teaches
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Year of Experience
            </label>
            <input
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Upload Photo
            </label>
            <div className="mt-1 flex items-center justify-center border border-gray-300 rounded-md h-24">
              <input
                type="file"
                accept=".png,.pdf"
                onChange={handleFileChange}
                className="hidden"
                id="photo-upload"
              />
              <label htmlFor="photo-upload" className="cursor-pointer">
                {formData.photo ? (
                  <span>{formData.photo.name}</span>
                ) : (
                  <span className="text-gray-500">png/pdf</span>
                )}
                <span className="ml-2 text-2xl">+</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Highest Qualification
            </label>
            <input
              type="text"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Current Salary (Optional)
            </label>
            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center">
          <input
            type="checkbox"
            name="declaration"
            checked={formData.declaration}
            onChange={handleChange}
            className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
          />
          <label className="ml-2 text-sm text-gray-700">
            I declare all information provided is correct
          </label>
        </div>

        <button
          onClick={handleSubmit}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          ADD
        </button>
      </div>
    </div>
  );
};

export default BasicInfo;
