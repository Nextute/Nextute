import React, { useState } from 'react';
import { 
  ArrowLeft, 
  GraduationCap, 
  Building2, 
  Search, 
  BarChart3, 
  Users, 
  Trophy, 
  Globe, 
  Brain, 
  TrendingUp, 
  Calendar, 
  CheckCircle, 
  Star, 
  Target, 
  Zap, 
  Award, 
  BookOpen, 
  MessageCircle, 
  ChevronRight,
  Play,
  ArrowRight,
  Shield,
  Clock,
  Lightbulb,
  PieChart,
  Settings,
  Database,
  Smartphone,
  Video,
  FileText,
  UserCheck,
  Megaphone,
  BarChart,
  Calendar as CalendarIcon, // Renamed to avoid conflict with Calendar from lucide-react
  Clipboard,
  Check, // Using Check from lucide-react directly
  Crown,
  Sparkles,
  Gift,
  X,
  Heart,
  Rocket,
  Diamond
} from 'lucide-react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const ServicesPage = ({ onBack }) => {
  const [hoveredCard, setHoveredCard] = useState(null);
  
  // Simulate user authentication - in real app, this would come from auth context
  const [userType, setUserType] = useState('institute'); // 'student' or 'institute' - this would be from login
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' or 'annual'

  // Pricing Plans
  const studentPlans = [
    {
      id: 'free',
      name: 'Free Plan',
      price: { monthly: 0, annual: 0 },
      originalPrice: null,
      badge: null,
      description: 'Perfect for getting started',
      trialDays: 7,
      features: [
        'Public listing on Nextute',
        'Access to your dashboard',
        'Basic profile customization',
        'Search coaching institutes',
        'Read verified reviews',
        'Basic filters and sorting'
      ],
      limitations: [
        'Limited to 5 institute contacts per month',
        'Basic search filters only',
        'No priority support'
      ],
      buttonText: 'Get Started',
      buttonStyle: 'bg-teal-700 hover:bg-teal-800', // Updated button style
      popular: false,
      color: 'gray'
    },
    {
      id: 'pro',
      name: 'Pro Plan',
      price: { monthly: 99, annual: 999 },
      originalPrice: { monthly: 149, annual: 1499 },
      badge: null, 
      description: 'Best for serious aspirants',
      trialDays: 7,
      features: [
        'All Free Features',
        'Unlimited institute contacts',
        'Advanced search & filters',
        'Personalized recommendations',
        'Priority customer support',
        'Test performance analytics',
        'Expert mentorship sessions',
        'Study material access'
      ],
      limitations: [],
      buttonText: 'Get Started',
      buttonStyle: 'bg-teal-700 hover:bg-teal-800', // Updated button style
      popular: true,
      color: 'green'
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      price: { monthly: 199, annual: 1999 },
      originalPrice: { monthly: 299, annual: 2999 },
      badge: null, 
      description: 'Complete learning ecosystem',
      trialDays: 14,
      features: [
        'All Pro Features',
        'AI-powered study planner',
        'Mock test series access',
        'One-on-one mentoring',
        'Career guidance sessions',
        'Scholarship opportunities',
        'Premium study resources',
        'Progress tracking & insights',
        'Parent dashboard access'
      ],
      limitations: [],
      buttonText: 'Get Started',
      buttonStyle: 'bg-teal-700 hover:bg-teal-800', // Updated button style
      popular: false,
      color: 'purple'
    }
  ];

  const institutePlans = [
    {
      id: 'basic',
      name: 'Free Plan',
      price: { monthly: 0, annual: 0 },
      originalPrice: null,
      badge: null,
      description: 'List your institute and be visible to thousands of students across the country.',
      trialDays: 7,
      features: [
        'Public listing on Nextute',
        'Access to your dashboard',
        'Basic profile customization',
      ],
      limitations: [],
      buttonText: 'Pay now',
      buttonStyle: 'bg-teal-700 hover:bg-teal-800', // Updated button style
      popular: false,
      color: 'gray'
    },
    {
      id: 'professional',
      name: 'Pro Plan',
      price: { monthly: 4999, annual: 49999 },
      originalPrice: { monthly: 6999, annual: 69999 },
      badge: 'Most Popular', 
      description: 'Gain direct access to your potential students.',
      trialDays: 7,
      features: [
        'All Free Features',
        'Access contact details of students',
        'Student interest analytics',
        'Lead management tools',
      ],
      limitations: [],
      buttonText: 'Pay now',
      buttonStyle: 'bg-teal-700 hover:bg-teal-800', // Updated button style
      popular: true,
      color: 'green'
    },
    {
      id: 'enterprise',
      name: 'Premium Plan',
      price: { monthly: 9999, annual: 99999 },
      originalPrice: { monthly: 14999, annual: 149999 },
      badge: null, 
      description: 'Elevate your digital offerings with advanced tools.',
      trialDays: 7, 
      features: [
        'All Pro Features',
        'Conduct institute-specific tests',
        'AI-assisted question selection',
        'Priority support',
      ],
      limitations: [],
      buttonText: 'Pay now',
      buttonStyle: 'bg-teal-700 hover:bg-teal-800', // Updated button style
      popular: false,
      color: 'green'
    }
  ];

  const stats = [
    { label: "Active Students", value: "50K+", icon: GraduationCap },
    { label: "Partner Institutes", value: "1,200+", icon: Building2 },
    { label: "Success Stories", value: "15K+", icon: Trophy },
    { label: "Cities Covered", value: "100+", icon: Globe }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "JEE Aspirant",
      image: "https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=150",
      content: "Nextute helped me find the perfect coaching institute. The comparison feature and student reviews were incredibly helpful!",
      rating: 5
    },
    {
      name: "Dr. Rajesh Kumar",
      role: "Institute Director",
      image: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150",
      content: "Our digital presence improved significantly after partnering with Nextute. Student enrollment increased by 40%!",
      rating: 5
    },
    {
      name: "Anita Patel",
      role: "NEET Aspirant",
      image: "https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=150",
      content: "The personalized test analytics feature helped me identify my weak areas and improve my performance dramatically.",
      rating: 5
    }
  ];

  const currentPlans = userType === 'student' ? studentPlans : institutePlans;

  const formatPrice = (price) => {
    if (price === 0) return '₹0';
    return `₹${price}`;
  };

  const getBadgeStyle = (color) => {
    switch (color) {
      case 'green':
        return 'bg-[#AAD294] text-[#1A433A]'; 
      case 'purple':
        return 'bg-purple-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FBF9] to-[#E6EEE3]">
      {/* Header */}
      <Navbar />

      {/* Pricing Hero */}
      <section className="py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A433A]/5 to-[#2D7A67]/5"></div>
        
        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-[#AAD294]/20 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-[#2D7A67]/20 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-[#1A433A]/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            <span className="inline-block text-[#1A433A] animate-fade-in-up">
              Choose Your
            </span>
            <span className="block gradient-text animate-bounce-in" style={{ animationDelay: '0.4s' }}>
              Perfect Plan
            </span>
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
            Tailored pricing for {userType === 'student' ? 'students seeking academic excellence' : 'institutes aiming for growth'}
          </p>
          
          {/* User Type Display */}
          <div className="flex justify-center mb-8 animate-fade-in-up" style={{ animationDelay: '1s' }}>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-[#E6EEE3]">
              <div className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-[#2D7A67] to-[#1A433A] text-white shadow-lg`}>
                {userType === 'student' ? <GraduationCap size={20} /> : <Building2 size={20} />}
                <span>For {userType === 'student' ? 'Students' : 'Institutes'}</span>
              </div>
            </div>
          </div>
          
          {/* Billing Cycle Toggle */}
          <div className="flex justify-center mb-8 animate-fade-in-up" style={{ animationDelay: '1.2s' }}>
            <div className="flex items-center bg-white rounded-xl p-2 shadow-lg border border-gray-200">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  billingCycle === 'monthly'
                    ? 'bg-[#2D7A67] text-white shadow-md'
                    : 'text-gray-600 hover:text-[#2D7A67]'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 relative ${
                  billingCycle === 'annual'
                    ? 'bg-[#2D7A67] text-white shadow-md'
                    : 'text-gray-600 hover:text-[#2D7A67]'
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
                  <div className="text-3xl font-bold text-[#1A433A] mb-2">{stat.value}</div>
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
              Plans for {userType === 'student' ? 'Students' : 'Institutes'}
            </h2>
            {userType === 'institute' && ( // Only show "Most Popular!" for institute plans
              <div className="inline-flex items-center bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                <Sparkles size={14} className="mr-1" />
                Most Popular!
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {currentPlans.map((plan, index) => (
              <div
                key={plan.id}
                className={`relative bg-white border border-gray-200 rounded-3xl shadow-sm p-8
                            transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Active Badge */}
                <div className="absolute -top-2 right-4 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium z-10">
                  Active
                </div>
                
                <div className="p-0 text-center space-y-6">
                  {/* Plan Title */}
                  <h2 className="text-3xl font-bold text-gray-900">{plan.name}</h2>
                  
                  {/* Price */}
                  <div className="space-y-2">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-teal-600">{formatPrice(plan.price[billingCycle])}</span>
                      <span className="text-xl text-gray-600 ml-1">/{billingCycle === 'monthly' ? 'month' : 'annually'}</span>
                    </div>
                    {plan.trialDays > 0 && (
                      <p className="text-sm text-gray-600">Free {plan.trialDays} days trial</p>
                    )}
                    {plan.originalPrice && plan.originalPrice[billingCycle] > plan.price[billingCycle] && (
                      <div className="text-center mt-1">
                        <span className="text-sm text-gray-400 line-through">
                          {formatPrice(plan.originalPrice[billingCycle])}
                        </span>
                        <span className="text-green-600 text-sm ml-2">
                          (Save ₹{plan.originalPrice[billingCycle] - plan.price[billingCycle]} {billingCycle === 'annual' ? 'vs monthly' : ''})
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed">
                    {plan.description}
                  </p>
                  
                  {/* Features */}
                  <div className="space-y-4 text-left">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                    {plan.limitations.length > 0 && (
                        <div className="pt-3 border-t border-gray-100">
                          {plan.limitations.map((limitation, limitIndex) => (
                            <div key={limitIndex} className="flex items-center space-x-3 mb-2">
                              <div className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                                <X className="w-4 h-4 text-gray-500" />
                              </div>
                              <span className="text-gray-500 text-sm">{limitation}</span>
                            </div>
                          ))}
                        </div>
                    )}
                  </div>
                  
                  {/* CTA Button */}
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
      

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#1A433A] to-[#2D7A67]">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Let's build the future of learning — together {userType === 'student' ? 'Learning' : 'Institute'}?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              {userType === 'student' 
                ? 'Join thousands of successful students who achieved their dreams with Nextute'
                : 'Partner with us to digitize your institute and reach more students'
              }
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

export default ServicesPage;
