import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="w-full flex items-center justify-between bg-[#E6EDE2] -mt-14">
      {/*-----------FOOTER LEFT SECTION-------*/}
      <div className="w-1/4 h-full flex flex-col ml-32 mb-14">
        <div>
          <img src={assets.logo} alt="Nextute-logo" className="size-56" />
        </div>

        <div className="flex flex-col -mt-14 ml-6 font-bold text-[#000]">
          <p>Contact Us</p>
          <p>Office Address:</p>
          <p>Nextute EdTech Pvt. Ltd.,</p>
          <p>patna Bihar</p>
          <p>Email: contact@nextute.com</p>
          <p className="mt-8">Connect With Us</p>
        </div>

        {/*---------SOCAIL ICONS---------*/}
        <div className="flex gap-4 mt-4 ml-6">
          <img src={assets.google} alt="google" className="size-8" />
          <img src={assets.instagram} alt="instagram" className="size-8" />
          <img src={assets.linkedin} alt="linkedin" className="size-8" />
        </div>
      </div>

      {/*-----------FOOTER RIGHT SECTION-------*/}
      <div className="w-3/4 h-full flex items-center justify-between px-24">
        {/*-------QUICK LINKS FOR FOOTER--------*/}
        <div>
          <h3 className="text-3xl font-semibold text-[#000]">Quick Links</h3>
          <ul className="flex flex-col gap-2 underline font-medium text-[#000] mt-5">
            <li>
              <Link>Home</Link>
            </li>
            <li>
              <Link>About Us</Link>
            </li>
            <li>
              <Link>Find Coaching</Link>
            </li>
            <li>
              <Link>For Institutes</Link>
            </li>
            <li>
              <Link>Write A Review</Link>
            </li>
            <li>
              <Link>Blog</Link>
            </li>
          </ul>
        </div>

        {/*---------FOR STUDENTS---------*/}
        <div>
          <h3 className="text-3xl font-semibold text-[#000]">For Students</h3>
          <ul className="flex flex-col gap-2 underline font-medium text-[#000] mt-5">
            <li>
              <Link>Explore Coaching Institutes</Link>
            </li>
            <li>
              <Link>Compare Institutes</Link>
            </li>
            <li>
              <Link>Read Student Reviews</Link>
            </li>
            <li>
              <Link>Write a Review</Link>
            </li>
            <li>
              <Link>Location-Based Search</Link>
            </li>
            <li>
              <Link>FAQ</Link>
            </li>
          </ul>
        </div>

        {/*---------FOR INSTITUTES--------*/}
        <div className="-mt-16">
          <h3 className="text-3xl font-semibold text-[#000]">For Coaching Centers</h3>
          <ul className="flex flex-col gap-2 underline font-medium text-[#000] mt-5">
            <li>
              <Link>List Your Institute</Link>
            </li>
            <li>
              <Link>Digital Profile Management</Link>
            </li>
            <li>
              <Link>Student Feedback Dashboard</Link>
            </li>
            <li>
              <Link>Support</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;
