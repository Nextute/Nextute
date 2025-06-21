import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <nav className="bg-[#2D7B67] py-4 mb-4">
      <ul className="flex flex-wrap gap-4 list-none m-0 p-0 justify-center">
        <li>
          <Link
            to="/basicinfo"
            className="text-white font-bold hover:underline"
          >
            Basic Info
          </Link>
        </li>
        <li>
          <Link to="/contact" className="text-white font-bold hover:underline">
            Contact
          </Link>
        </li>
        <li>
          <Link
            to="/courseoffered"
            className="text-white font-bold hover:underline"
          >
            Course Offered
          </Link>
        </li>
        <li>
          <Link
            to="/facultiesdetails"
            className="text-white font-bold hover:underline"
          >
            Faculties Details
          </Link>
        </li>
        <li>
          <Link
            to="/achievements"
            className="text-white font-bold hover:underline"
          >
            Achievements
          </Link>
        </li>
        <li>
          <Link
            to="/facilities"
            className="text-white font-bold hover:underline"
          >
            Facilities
          </Link>
        </li>
        <li>
          <Link
            to="/mediagallery"
            className="text-white font-bold hover:underline"
          >
            Media & Gallery
          </Link>
        </li>
        <li>
          <Link
            to="/social-media"
            className="text-white font-bold hover:underline"
          >
            Social Media
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Header;
