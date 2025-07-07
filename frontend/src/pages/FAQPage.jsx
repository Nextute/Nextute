import { useState } from "react";
import Navbar from "../components/Navbar";
import { assets } from "../assets/assets";
import { RectangleIcon } from "../components/RectangleIcon";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import Footer from "../components/Footer";

const faqData = [
  {
    question: "How does this platform help students?",
    answer:
      "This platform offers resources, mentorship, and tools to guide students in academics, career development, and real-world skills.",
  },
  {
    question: "Is this platform free to use?",
    answer:
      "Yes, most of the content and features are available for free. However, some advanced features might require a subscription.",
  },
  {
    question: "Can I access this platform on mobile?",
    answer:
      "Absolutely! The platform is fully responsive and works seamlessly across all devices, including smartphones and tablets.",
  },
  {
    question: "How do I get in touch with support?",
    answer:
      "You can reach our support team via the Contact Us page or email us directly at support@example.com.",
  },
];

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null); // Track open question index

  const handleToggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="w-full bg-white min-h-screen">
      <Navbar />
      <div className="flex flex-col-reverse md:flex-row items-start justify-between px-4 sm:px-6 lg:px-20 py-10 gap-10">
        {/* Left Section */}
        <div className="w-full md:w-1/2">
          <h2 className="text-black font-montserrat text-4xl sm:text-5xl font-semibold leading-normal mb-6">
            What can we help you find?
          </h2>

          {/* Search Bar */}
          <div className="flex flex-col h-12 sm:h-14 sm:flex-row items-center justify-between mt-6 w-full max-w-xs sm:max-w-md md:max-w-lg shadow-custom border border-[#000000] rounded-full overflow-hidden">
            <div className="flex items-center gap-2 px-6 py-2 w-full">
              <input
                type="text"
                placeholder="Search..."
                className="outline-none bg-[#FFFFFF] w-full text-gray-700 text-lg sm:text-xl placeholder-[#000] placeholder-opacity-90 placeholder:text-lg md:placeholder:text-xl"
              />
            </div>
            <div className="relative h-full w-full flex items-center justify-center px-6 py-2">
              <div className="relative flex items-center justify-center">
                <RectangleIcon
                  height={190}
                  width={75}
                  color="#204B55"
                  className="absolute transform rotate-[48deg] left-14 z-10 mix-blend-multiply hidden md:block"
                />
                <RectangleIcon
                  height={160}
                  width={50}
                  color="#AAD294"
                  className="absolute transform -rotate-[53deg] left-20 z-10 mix-blend-multiply hidden md:block"
                />
                <Search className="absolute left-28 max-sm:bottom-2.5 sm:left-20 size-8 text-white font-semibold z-10 max-sm:text-[#204B55] cursor-pointer" />
              </div>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#2D7B67] mt-6 mb-4 font-montserrat">
            Frequently Asked Questions
          </h2>

          {/* FAQ Section */}
          <div className="w-full">
            {faqData.map((faq, index) => (
              <section
                key={index}
                className="w-full px-4 py-4 border-b border-gray-200 transition-all duration-300"
              >
                <div
                  className="flex items-center justify-between gap-4 cursor-pointer"
                  onClick={() => handleToggle(index)}
                >
                  <p className="text-[#002639] font-montserrat text-xl md:text-2xl font-medium leading-normal">
                    {faq.question}
                  </p>
                  {openIndex === index ? (
                    <ChevronUp className="w-7 h-7 text-[#2D7B67]" />
                  ) : (
                    <ChevronDown className="w-7 h-7 text-[#2D7B67]" />
                  )}
                </div>

                {openIndex === index && (
                  <div className="mt-3 text-black/60 text-lg md:text-xl leading-relaxed transition-all duration-300">
                    {faq.answer}
                  </div>
                )}
              </section>
            ))}
          </div>
        </div>

        {/* Right Section: Banner */}
        <div className="w-full md:w-1/2 flex justify-center self-start lg:mt-20">
          <img
            src={assets.FAQBanner}
            alt="FAQ Banner"
            className="w-full max-w-md object-contain"
          />
        </div>
      </div>

      {/*  ------FOOTER------  */}
      <Footer />
    </div>
  );
};

export default FAQPage;
