import React, { useState } from "react";
import {
  ArrowLeft,
  GraduationCap,
  Building2,
  Trophy,
  Globe,
  Play,
  MessageCircle,
  Check,
  X,
  Sparkles,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import TestimonialCard from "../components/TestimonialCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const InstituteServicesPage = ({ onBack }) => {
  const [billingCycle, setBillingCycle] = useState("monthly");

  const institutePlans = [
    {
      id: "basic",
      name: "Free Plan",
      price: { monthly: 0, annual: 0 },
      originalPrice: null,
      badge: null,
      description:
        "List your institute and be visible to thousands of students across the country.",
      trialDays: 7,
      features: [
        "Public listing on Nextute",
        "Access to your dashboard",
        "Basic profile customization",
      ],
      limitations: [],
      buttonText: "Get Started",
      buttonStyle: "bg-teal-700 hover:bg-teal-800",
      popular: false,
      color: "gray",
    },
    {
      id: "professional",
      name: "Pro Plan",
      price: { monthly: 4999, annual: 49999 },
      originalPrice: { monthly: 6999, annual: 69999 },
      badge: "Most Popular",
      description: "Gain direct access to your potential students.",
      trialDays: 7,
      features: [
        "All Free Features",
        "Access contact details of students",
        "Student interest analytics",
        "Lead management tools",
      ],
      limitations: [],
      buttonText: "Get Started",
      buttonStyle: "bg-teal-700 hover:bg-teal-800",
      popular: true,
      color: "green",
    },
    {
      id: "enterprise",
      name: "Premium Plan",
      price: { monthly: 9999, annual: 99999 },
      originalPrice: { monthly: 14999, annual: 149999 },
      badge: null,
      description: "Elevate your digital offerings with advanced tools.",
      trialDays: 7,
      features: [
        "All Pro Features",
        "Conduct institute-specific tests",
        "AI-assisted question selection",
        "Priority support",
      ],
      limitations: [],
      buttonText: "Get Started",
      buttonStyle: "bg-teal-700 hover:bg-teal-800",
      popular: false,
      color: "green",
    },
  ];

  const stats = [
    { label: "Active Students", value: "50K+", icon: GraduationCap },
    { label: "Partner Institutes", value: "1,200+", icon: Building2 },
    { label: "Success Stories", value: "15K+", icon: Trophy },
    { label: "Cities Covered", value: "100+", icon: Globe },
  ];

  const testimonials = [
    {
      id: "t1",
      text: "Our digital presence improved significantly after partnering with Nextute. Student enrollment increased by 40%!",
      quote: "Nextute's tools helped us connect with the right students.",
      author: "Dr. Rajesh Kumar, Institute Director",
      rating: 5,
    },
    {
      id: "t2",
      text: "Nextute's lead management tools streamlined our admissions process, saving us time and resources.",
      quote: "The analytics dashboard is a game-changer for our institute.",
      author: "Prof. Meena Gupta, Academic Head",
      rating: 4.5,
    },
    {
      id: "t3",
      text: "The AI-assisted question selection feature allowed us to create high-quality tests tailored to our students' needs.",
      quote: "Nextute elevated our institute's offerings significantly.",
      author: "Dr. Anil Sharma, Institute Founder",
      rating: 5,
    },
  ];

  const formatPrice = (price) => {
    if (price === 0) return "₹0";
    return `₹${price}`;
  };

  const getBadgeStyle = (color) => {
    switch (color) {
      case "green":
        return "bg-[#AAD294] text-[#1A433A]";
      case "purple":
        return "bg-purple-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FBF9] to-[#E6EEE3]">
      {/* Header */}
      <Navbar />

      {/* Pricing Hero */}
      <section className="py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A433A]/5 to-[#2D7A67]/5"></div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-[#AAD294]/20 rounded-full animate-pulse"></div>
          <div
            className="absolute top-40 right-20 w-16 h-16 bg-[#2D7A67]/20 rounded-full animate-bounce"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-20 left-1/4 w-12 h-12 bg-[#1A433A]/20 rounded-full animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            <span className="inline-block text-[#1A433A] animate-fade-in-up">
              Choose Your
            </span>
            <span
              className="block gradient-text animate-bounce-in"
              style={{ animationDelay: "0.4s" }}
            >
              Perfect Plan
            </span>
          </h1>
          <p
            className="text-xl text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed animate-fade-in-up"
            style={{ animationDelay: "0.8s" }}
          >
            Tailored pricing for institutes aiming for growth
          </p>
          <div
            className="flex justify-center mb-8 animate-fade-in-up"
            style={{ animationDelay: "1s" }}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-[#E6EEE3]">
              <div className="flex items-center space-x-3 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-[#2D7A67] to-[#1A433A] text-white shadow-lg">
                <Building2 size={20} />
                <span>For Institutes</span>
              </div>
            </div>
          </div>
          <div
            className="flex justify-center mb-8 animate-fade-in-up"
            style={{ animationDelay: "1.2s" }}
          >
            <div className="flex items-center bg-white rounded-xl p-2 shadow-lg border border-gray-200">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  billingCycle === "monthly"
                    ? "bg-[#2D7A67] text-white shadow-md"
                    : "text-gray-600 hover:text-[#2D7A67]"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("annual")}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 relative ${
                  billingCycle === "annual"
                    ? "bg-[#2D7A67] text-white shadow-md"
                    : "text-gray-600 hover:text-[#2D7A67]"
                }`}
              >
                Annual
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="text-center animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-[#2D7A67] to-[#1A433A] rounded-2xl flex items-center justify-center mx-auto mb-4 transform hover:scale-110 transition-transform duration-300">
                    <IconComponent className="text-white" size={24} />
                  </div>
                  <div className="text-3xl font-bold text-[#1A433A] mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Plans for Institutes
            </h2>
            <div className="inline-flex items-center bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
              <Sparkles size={14} className="mr-1" />
              Most Popular!
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {institutePlans.map((plan, index) => (
              <div
                key={plan.id}
                className={`relative bg-white border border-gray-200 rounded-3xl shadow-sm p-8 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="absolute -top-2 right-4 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium z-10">
                  Active
                </div>
                <div className="p-0 text-center space-y-6">
                  <h2 className="text-3xl font-bold text-gray-900">
                    {plan.name}
                  </h2>
                  <div className="space-y-2">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-teal-600">
                        {formatPrice(plan.price[billingCycle])}
                      </span>
                      <span className="text-xl text-gray-600 ml-1">
                        /{billingCycle === "monthly" ? "month" : "annually"}
                      </span>
                    </div>
                    {plan.trialDays > 0 && (
                      <p className="text-sm text-gray-600">
                        Free {plan.trialDays} days trial
                      </p>
                    )}
                    {plan.originalPrice &&
                      plan.originalPrice[billingCycle] >
                        plan.price[billingCycle] && (
                        <div className="text-center mt-1">
                          <span className="text-sm text-gray-400 line-through">
                            {formatPrice(plan.originalPrice[billingCycle])}
                          </span>
                          <span className="text-green-600 text-sm ml-2">
                            (Save ₹
                            {plan.originalPrice[billingCycle] -
                              plan.price[billingCycle]}{" "}
                            {billingCycle === "annual" ? "vs monthly" : ""})
                          </span>
                        </div>
                      )}
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {plan.description}
                  </p>
                  <div className="space-y-4 text-left">
                    {plan.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-center space-x-3"
                      >
                        <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                    {plan.limitations.length > 0 && (
                      <div className="pt-3 border-t border-gray-100">
                        {plan.limitations.map((limitation, limitIndex) => (
                          <div
                            key={limitIndex}
                            className="flex items-center space-x-3 mb-2"
                          >
                            <div className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                              <X className="w-4 h-4 text-gray-500" />
                            </div>
                            <span className="text-gray-500 text-sm">
                              {limitation}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    className={`w-full py-3 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${plan.buttonStyle} text-white shadow-lg hover:shadow-xl`}
                  >
                    {plan.buttonText}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#002639] mb-2">
            Voices of Success
          </h2>
          <p className="text-[#002639] font-medium mb-5 text-2xl">
            Our Institute Stories
          </p>
          <Swiper
            modules={[Pagination, Navigation, Autoplay]}
            spaceBetween={40}
            slidesPerView={1}
            slidesPerGroup={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            breakpoints={{
              768: {
                slidesPerView: 2,
                slidesPerGroup: 2,
              },
              1024: {
                slidesPerView: 3,
                slidesPerGroup: 3,
              },
            }}
            className="max-w-screen-xl mx-auto relative pb-5"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <TestimonialCard
                  text={testimonial.text}
                  quote={testimonial.quote}
                  author={testimonial.author}
                  rating={testimonial.rating}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#1A433A] to-[#2D7A67]">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Let's build the future of learning — together
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Partner with us to digitize your institute and reach more students
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-[#1A433A] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2 transform hover:scale-105 duration-300">
                <Play size={20} />
                <span>Join Now. Empower. Excel.</span>
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-[#1A433A] transition-all duration-300 flex items-center justify-center space-x-2">
                <MessageCircle size={20} />
                <span>Schedule Demo</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default InstituteServicesPage;
