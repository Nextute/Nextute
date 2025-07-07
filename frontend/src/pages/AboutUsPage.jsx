import { Rocket, Award, Lightbulb } from "lucide-react"; // Added icons for services and timeline
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { assets } from "../assets/assets";

const AboutUsPage = () => {
  return (
    <div className="w-full min-h-screen flex flex-col bg-[#F9FBF9] font-inter text-[#212121] overflow-hidden">
      {/* NAVBAR Section */}
      <Navbar />
      <main className="flex-grow mx-auto px-4 sm:px-10">
        {/* About Section  */}
        <section className="w-full mx-auto flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-0 px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="w-full lg:w-[58%] flex flex-col justify-center space-y-6 md:space-y-8">
            <p className="text-gray-600/60 text-xl sm:text-2xl md:text-[30px] font-medium tracking-[3.6px] font-poppins uppercase">
              About Us
            </p>
            <h1 className="text-[#263238] text-3xl sm:text-4xl  font-medium tracking-[1.6px] font-poppins leading-tight">
              At{" "}
              <span className="text-[#2D7B67] text-4xl sm:text-5xl  font-semibold tracking-[1.8px]">
                NEXTUTE
              </span>
              , <br className="hidden sm:block" />
              We don't just teach.
            </h1>
            <h2 className="text-[#263238] text-3xl sm:text-4xl  font-medium tracking-[1.6px] font-poppins">
              We prepare you for what's next.
            </h2>

            <div className="w-full sm:w-10/12 lg:w-9/12">
              <p className="text-[#37474F] text-justify text-sm sm:text-xl font-normal leading-[140%] font-poppins mb-4">
                As a dynamic EdTech platform, we are dedicated to equipping
                learners with the skills, tools, and confidence needed to thrive
                in a rapidly evolving world.
              </p>
              <p className="text-[#37474F] text-justify text-sm sm:text-xl font-normal leading-[140%] font-poppins">
                Founded with the belief that education should be accessible,
                engaging, and future-focused, Nextute bridges the gap between
                traditional learning and modern career demands. Whether you're a
                student, professional, or lifelong learner — we’re here to
                support your journey with curated content, expert guidance, and
                real-world application.
              </p>
            </div>
          </div>

          <div className="w-full lg:w-[42%] flex justify-center items-center mt-2 sm:mt-28">
            <img
              src={assets.aboutus}
              alt=""
              className=" w-full h-auto object-contain rounded-3xl hover:scale-105 transition-all duration-300"
            />
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-8 md:py-12 lg:py-16 mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col lg:flex-row items-center gap-6 md:gap-8 lg:gap-12 bg-white rounded-3xl shadow-lg p-6 sm:p-8 lg:p-12 relative z-10">
            <div className="w-full lg:w-1/2 order-2 lg:order-1">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#1A433A] mb-4 md:mb-6 tracking-tight font-poppins">
                Our Mission: Revolutionizing Education
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-[#37474F] leading-relaxed mb-4 font-poppins">
                To revolutionize education through technology-enabled learning
                solutions that make quality education accessible and engaging
                for every student, anywhere in the world.
              </p>
              <p className="text-base sm:text-lg lg:text-xl text-[#37474F] leading-relaxed font-poppins">
                We are committed to building personalized learning paths,
                creating interactive and cutting-edge content, and continuously
                innovating to bridge educational gaps and unlock student
                potential.
              </p>
            </div>
            <div className="w-full lg:w-1/2 order-1 lg:order-2 flex justify-center">
              <div className="relative group max-w-[500px] w-full">
                <img
                  src={assets.Revolution}
                  alt="Students engaged in innovative learning"
                  className="relative z-10 rounded-2xl shadow-lg w-full h-auto max-h-[400px] object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
          {/* Decorative background shapes */}
          <div className="absolute -bottom-10 -left-10 w-32 h-32 md:w-40 md:h-40 bg-[#AAD294] opacity-20 rounded-full z-0"></div>
          <div className="absolute -top-10 -right-10 w-40 h-40 md:w-48 md:h-48 bg-[#2D7A67] opacity-15 rounded-full z-0"></div>
        </section>

        {/* Our Story (History) Section*/}
        <section className=" py-8 md:py-12 lg:py-16  mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-center text-[#1A433A] mb-8 md:mb-12 tracking-tight font-poppins">
            Our Story: A Journey of Growth
          </h2>

          {/* Timeline container */}
          <div className="relative flex flex-col items-center">
            {/* Vertical line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1.5 h-full bg-[#AAD294]/50 z-0"></div>

            {[
              {
                year: 2023,
                title: "Founding & Vision",
                description:
                  "NextTute was founded with a clear vision: to democratize quality education. We started as a small team, driven by the belief that technology could break down traditional barriers to learning.",
                icon: Rocket,
                align: "left",
              },
              {
                year: 2024,
                title: "Early Milestones & Expansion",
                description:
                  "We launched our first set of online courses, focusing on competitive exam preparation. The rapid adoption and positive feedback from students fueled our expansion into new subjects and partnerships with educational institutions.",
                icon: Award,
                align: "right",
              },
              {
                year: 2025,
                title: "Innovation & Impact",
                description:
                  "This year, we introduced AI-powered personalized learning paths and expanded our mentorship programs. Our growing community of successful students stands as a testament to our impact.",
                icon: Lightbulb,
                align: "left",
              },
            ].map((item, index) => (
              <div
                key={item.year}
                className={`flex flex-col ${
                  item.align === "left" ? "md:flex-row" : "md:flex-row-reverse"
                } items-center w-full mb-10 md:mb-12 relative z-10 group`}
              >
                <div className="w-full md:w-1/2 text-center md:text-right md:pr-8 lg:pr-12">
                  <h3 className="text-xl sm:text-2xl font-semibold text-[#212121] mb-2 font-poppins">
                    {item.title}
                  </h3>
                  <p className="text-base sm:text-lg text-[#37474F] leading-relaxed font-poppins max-w-md mx-auto md:mx-0">
                    {item.description}
                  </p>
                </div>
                <div className="relative w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 bg-[#2D7A67] rounded-full flex items-center justify-center text-white shadow-lg border-4 border-white transform md:-translate-x-1/2 my-4 md:my-0 transition-transform duration-300 group-hover:scale-110">
                  <item.icon size={24} sm={32} />
                  <span className="absolute -bottom-6 sm:-bottom-8 text-xs sm:text-sm font-semibold text-[#1A433A] font-poppins">
                    {item.year}
                  </span>
                </div>
                <div className="w-full md:w-1/2 text-center md:text-left md:pl-8 lg:pl-12"></div>
              </div>
            ))}
          </div>
        </section>

        {/* Values Section */}
        <section className="py-8 md:py-12 lg:py-16  mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-center text-[#1A433A] mb-8 md:mb-12 tracking-tight font-poppins">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                title: "Innovation",
                description:
                  "Continuously seeking new and better ways to deliver education.",
                icon: "M13 10V3L4 14h7v7l9-11h-7z",
              },
              {
                title: "Accessibility",
                description:
                  "Making quality education available to everyone, everywhere.",
                icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
              },
              {
                title: "Excellence",
                description:
                  "Striving for the highest standards in content and delivery.",
                icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
              },
            ].map((value, index) => (
              <div
                key={index}
                className="group flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100/50 hover:border-[#2D7A67]/50"
              >
                <div className="relative bg-[#C8E6C9] p-4 rounded-full mb-4 shadow-inner group-hover:scale-110 transition-transform duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 sm:h-10 sm:w-10 text-[#2D7A67] group-hover:text-[#1A433A]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d={value.icon}
                    />
                  </svg>
                  <div className="absolute inset-0 bg-[#2D7A67]/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-[#212121] mb-2 font-poppins">
                  {value.title}
                </h3>
                <p className="text-base sm:text-lg text-[#37474F] leading-relaxed font-poppins max-w-xs">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Team Section 
        <section className="mb-12 py-8 md:py-12 lg:py-16  mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-center text-[#1A433A] mb-8 md:mb-12 tracking-tight font-poppins">
            Meet Our Dedicated Team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                name: "Jane Doe",
                role: "CEO & Co-Founder",
                img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
              },
              {
                name: "John Smith",
                role: "CTO & Co-Founder",
                img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
              },
              {
                name: "Emily White",
                role: "Head of Content",
                img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
              },
            ].map((member, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100/50 hover:border-[#2D7A67]/50 p-6 sm:p-8 flex flex-col items-center text-center transition-all duration-300 transform hover:-translate-y-2"
                style={{
                  animation: `fadeInUp 0.5s ease-out ${index * 0.2}s both`,
                }}
              >
                <div className="relative mb-6">
                  <img
                    src={member.img}
                    alt={`${member.name}, ${member.role}`}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-[#2D7A67] shadow-md transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 rounded-full bg-[#2D7A67]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-[#212121] mb-2 font-poppins">
                  {member.name}
                </h3>
                <p className="text-[#2D7A67] text-base sm:text-lg font-medium font-poppins">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </section> */}
        
      </main>
      {/*-------- FOOTER --------*/}
      <Footer />
    </div>
  );
};

export default AboutUsPage;
