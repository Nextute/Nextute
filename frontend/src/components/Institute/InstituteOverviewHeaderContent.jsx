import React, { useState } from "react";
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

const InstituteOverviewHeaderContent = () => {
  const [data, setData] = useState({
    name: "Alpha classes",
    verified: true,
    rating: 5,
    address: {
      line1: "12/7 Silverleaf Apartments, Sector 9, Indrapuram",
      city: "New Delhi",
      pincode: "110099",
    },
    phone: "+91 91234 56789",
    whatsapp: true,
    enquiry: true,
    socialLinks: {
      instagram: "#",
      linkedin: "#",
    },
    courses: ["JEE", "XII Boards", "X Boards"],
  });


  return (
    <div className="bg-[#E6EDE2] rounded-2xl border border-black p-6 flex flex-col sm:flex-row justify-between items-center sm:items-start gap-5 max-w-screen mx-2 sm:mx-8">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-4xl font-semibold">{data.name}</h1>
          {data.verified && (
            <FaCheckCircle className="text-green-800 text-2xl relative top-[2px]" />
          )}
        </div>

        <div className="flex items-center mt-2 text-yellow-500">
          {[...Array(data.rating)].map((_, i) => (
            <FaStar key={i} />
          ))}
        </div>

        <div className="flex items-center mt-2 text-sm text-gray-700">
          <FaMapMarkerAlt className="mr-2 text-2xl text-[#2D7B67]" />
          <span>
            {data.address.line1},<br /> {data.address.city} -{" "}
            {data.address.pincode}
          </span>
        </div>

        <div className="flex flex-col items-start gap-3 mt-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <button className="flex items-center gap-1 bg-white border border-gray-600 rounded-full px-3 py-1 text-sm">
              <FaPhone className="text-[#2D7B67]" />
              {data.phone}
            </button>

            {data.whatsapp && (
              <button className="flex items-center gap-1 bg-[#E6EDE2] border border-gray-600 rounded-full px-3 py-1 text-sm">
                <FaWhatsapp className="text-[#2D7B67]" />
                Whatsapp
              </button>
            )}

            {data.enquiry && (
              <button className="flex items-center gap-1 bg-[#E6EDE2] border border-gray-600 rounded-full px-3 py-1 text-sm">
                <BsChatTextFill className=" text-green-900 rounded-full" />
                Enquire
              </button>
            )}
          </div>

          <div className="flex flex-row gap-4">
            {data.socialLinks.instagram && (
              <a
                href={data.socialLinks.instagram}
                className="text-pink-500 text-3xl"
              >
                <FaInstagram />
              </a>
            )}
            {data.socialLinks.linkedin && (
              <a
                href={data.socialLinks.linkedin}
                className="text-blue-600 text-3xl"
              >
                <FaLinkedin />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        {data.courses.map((course) => (
          <button
            key={course}
            className="border border-[#2D7B67] rounded-lg px-4 py-1 text-sm"
          >
            {course}
          </button>
        ))}
      </div>
    </div>
  );
};

export default InstituteOverviewHeaderContent;
