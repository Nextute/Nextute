import React, { useEffect, useContext } from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import Ad from "../components/Ad";
import Testimonial from "../components/Testimonial";
import Test from "../components/Test";
import SearchTest from "../components/SearchTest";
import Footer from "../components/Footer";
import { AppContext } from "../context/AppContext";

const HomePage = () => {
  const { setUserLocation } = useContext(AppContext);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.warn("Geolocation error or denied", error);
          setUserLocation(null); // fallback to default
        }
      );
    } else {
      console.warn("Geolocation not supported");
      setUserLocation(null);
    }
  }, []);

  return (
    <div className="w-full overflow-x-hidden bg-white">
      <Navbar />
      <Header />
      <Ad />
      <Testimonial />
      <Test />
      <SearchTest />
      <Footer />
    </div>
  );
};

export default HomePage;