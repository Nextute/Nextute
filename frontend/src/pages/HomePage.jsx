import React from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import StudyPath from "../components/StudyPath";
import Ad from "../components/Ad";
import Testimonial from "../components/Testimonial";
import Test from "../components/Test";
import SearchTest from "../components/SearchTest";
import Footer from "../components/Footer";

const HomePage = () => {
  return (
   <div className="w-full overflow-x-hidden bg-white">
      <Navbar />
      <Header />
      <StudyPath />
      <Ad />
      <Testimonial />
      <Test />
      <SearchTest />
      <Footer />
    </div>
  );
};

export default HomePage;
