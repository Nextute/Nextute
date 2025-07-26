import React, { useEffect, useState } from "react";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaWhatsapp,
  FaInstagram,
  FaLinkedin,
  FaStar,
  FaCheckCircle,
} from "react-icons/fa";
import { BsChatTextFill } from "react-icons/bs";
import axios from "axios";

const InstituteOverviewHeaderContent = ({ id }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchInstituteData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/institutes/${id}`);
        if (res.data?.status) {
          console.log("Insitute data", res.data.data);
          setData(res.data.data);
        } else {
          setError("Invalid institute data.");
        }
      } catch (err) {
        setError("Failed to load institute details.");
      }
    };

    fetchInstituteData();
  }, [id]);

  if (!id) {
    return (
      <div className="text-red-500 text-center p-4">
        Error: Institute ID is missing.
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center text-gray-700 p-4">Loading header...</div>
    );
  }

  return (
    <div className="bg-[#E6EDE2] rounded-2xl border border-black p-6 flex flex-col sm:flex-row justify-between items-center sm:items-start gap-5 max-w-screen mx-2 sm:mx-8">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-4xl font-semibold">
            {data.basic_info?.institute_name || data.institute_name || "Institute Name"}
          </h1>
          {data.is_verified && (
            <FaCheckCircle className="text-green-800 text-2xl relative top-[2px]" />
          )}
        </div>

        <div className="flex items-center mt-2 text-yellow-500">
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} />
          ))}
        </div>

        <div className="flex items-center mt-2 text-sm text-gray-700">
          <FaMapMarkerAlt className="mr-2 text-2xl text-[#2D7B67]" />
          <span>
            {data.contact_details?.headOffice?.address ||
              "Address not available"}
          </span>
        </div>

        <div className="flex flex-col items-start gap-3 mt-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <button className="flex items-center gap-1 bg-white border border-gray-600 rounded-full px-3 py-1 text-sm">
              <FaPhone className="text-[#2D7B67]" />
              {data.contact || "Phone N/A"}
            </button>

            {/* Assuming support is present, adjust these booleans if backend adds flags */}
            <button className="flex items-center gap-1 bg-[#E6EDE2] border border-gray-600 rounded-full px-3 py-1 text-sm">
              <FaWhatsapp className="text-[#2D7B67]" />
              Whatsapp
            </button>

            <button className="flex items-center gap-1 bg-[#E6EDE2] border border-gray-600 rounded-full px-3 py-1 text-sm">
              <BsChatTextFill className=" text-green-900 rounded-full" />
              Enquire
            </button>
          </div>

          <div className="flex flex-row gap-4">
            {data.social_media?.instagram && (
              <a
                href={data.social_media.instagram}
                className="text-pink-500 text-3xl"
              >
                <FaInstagram />
              </a>
            )}
            {data.social_media?.linkedin && (
              <a
                href={data.social_media.linkedin}
                className="text-blue-600 text-3xl"
              >
                <FaLinkedin />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {data.courses?.courses?.map((course, index) => (
          <button
            key={index}
            className="border border-[#2D7B67] rounded-lg px-4 py-1 text-sm"
          >
            {course.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default InstituteOverviewHeaderContent;