import React, { useState } from "react";
import Navbar from "../components/Navbar";
import {
  Calendar,
  User,
  Clock,
  ArrowRight,
  Search,
  Tag,
  Eye,
  MessageCircle,
  Share2,
  BookOpen,
  TrendingUp,
  Award,
  Users,
  ChevronRight,
  Filter,
  Grid,
  List,
  Star,
  Download,
  Bell,
  Globe,
} from "lucide-react";
import Footer from "../components/Footer";

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("latest");

  // Enterprise-level blog data
  const blogPosts = [
    {
      id: 1,
      title: "Digital Transformation in Education: A Comprehensive Analysis",
      excerpt:
        "Exploring how technology is reshaping the educational landscape and creating new opportunities for learners worldwide.",
      content: "Complete analysis of digital transformation...",
      author: "Dr. Rajesh Kumar",
      authorRole: "Chief Education Officer",
      authorImage:
        "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150",
      date: "2024-01-15",
      readTime: "12 min read",
      category: "Technology",
      tags: ["EdTech", "Innovation", "Digital Learning"],
      image:
        "https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=800",
      views: 15420,
      comments: 89,
      likes: 234,
      featured: true,
      trending: true,
      difficulty: "Advanced",
    },
    {
      id: 2,
      title: "Strategic Approaches to Competitive Exam Preparation",
      excerpt:
        "Evidence-based methodologies and frameworks for optimizing performance in high-stakes competitive examinations.",
      content: "Strategic preparation methodologies...",
      author: "Dr. Priya Sharma",
      authorRole: "Director of Academic Excellence",
      authorImage:
        "https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=150",
      date: "2024-01-12",
      readTime: "10 min read",
      category: "Strategy",
      tags: ["Exam Prep", "Strategy", "Performance"],
      image:
        "https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg?auto=compress&cs=tinysrgb&w=800",
      views: 12890,
      comments: 67,
      likes: 189,
      featured: true,
      trending: false,
      difficulty: "Intermediate",
    },
    {
      id: 3,
      title: "Cognitive Science Applications in Learning Optimization",
      excerpt:
        "Leveraging neuroscience and cognitive psychology to enhance learning efficiency and retention rates.",
      content: "Cognitive science in education...",
      author: "Prof. Amit Singh",
      authorRole: "Head of Research & Development",
      authorImage:
        "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150",
      date: "2024-01-10",
      readTime: "15 min read",
      category: "Research",
      tags: ["Cognitive Science", "Learning", "Research"],
      image:
        "https://images.pexels.com/photos/6238297/pexels-photo-6238297.jpeg?auto=compress&cs=tinysrgb&w=800",
      views: 8750,
      comments: 45,
      likes: 156,
      featured: false,
      trending: true,
      difficulty: "Advanced",
    },
    {
      id: 4,
      title: "Global Education Trends: Market Analysis & Insights",
      excerpt:
        "Comprehensive market research on emerging trends in global education sector and their implications.",
      content: "Global education market analysis...",
      author: "Dr. Meera Gupta",
      authorRole: "VP of Strategic Planning",
      authorImage:
        "https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=150",
      date: "2024-01-08",
      readTime: "18 min read",
      category: "Market Research",
      tags: ["Market Analysis", "Trends", "Global Education"],
      image:
        "https://images.pexels.com/photos/4145190/pexels-photo-4145190.jpeg?auto=compress&cs=tinysrgb&w=800",
      views: 11650,
      comments: 78,
      likes: 203,
      featured: true,
      trending: false,
      difficulty: "Expert",
    },
    {
      id: 5,
      title: "Data-Driven Personalization in Educational Technology",
      excerpt:
        "Implementing advanced analytics and machine learning for personalized learning experiences at scale.",
      content: "Data-driven personalization strategies...",
      author: "Prof. Suresh Patel",
      authorRole: "Chief Technology Officer",
      authorImage:
        "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150",
      date: "2024-01-05",
      readTime: "14 min read",
      category: "Technology",
      tags: ["AI", "Personalization", "Data Analytics"],
      image:
        "https://images.pexels.com/photos/6238302/pexels-photo-6238302.jpeg?auto=compress&cs=tinysrgb&w=800",
      views: 9800,
      comments: 52,
      likes: 178,
      featured: false,
      trending: true,
      difficulty: "Advanced",
    },
    {
      id: 6,
      title: "Excellence in Educational Leadership: Case Studies",
      excerpt:
        "In-depth analysis of successful educational institutions and the leadership principles driving their success.",
      content: "Educational leadership case studies...",
      author: "Editorial Board",
      authorRole: "Research Team",
      authorImage:
        "https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=150",
      date: "2024-01-03",
      readTime: "20 min read",
      category: "Leadership",
      tags: ["Leadership", "Case Studies", "Excellence"],
      image:
        "https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg?auto=compress&cs=tinysrgb&w=800",
      views: 14100,
      comments: 95,
      likes: 267,
      featured: true,
      trending: false,
      difficulty: "Expert",
    },
  ];

  const categories = [
    { id: "all", name: "All Articles", count: blogPosts.length, icon: Globe },
    {
      id: "Technology",
      name: "Technology",
      count: blogPosts.filter((post) => post.category === "Technology").length,
      icon: BookOpen,
    },
    {
      id: "Strategy",
      name: "Strategy",
      count: blogPosts.filter((post) => post.category === "Strategy").length,
      icon: TrendingUp,
    },
    {
      id: "Research",
      name: "Research",
      count: blogPosts.filter((post) => post.category === "Research").length,
      icon: Award,
    },
    {
      id: "Market Research",
      name: "Market Research",
      count: blogPosts.filter((post) => post.category === "Market Research")
        .length,
      icon: Users,
    },
    {
      id: "Leadership",
      name: "Leadership",
      count: blogPosts.filter((post) => post.category === "Leadership").length,
      icon: Star,
    },
  ];

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesCategory =
      selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.views - a.views;
      case "trending":
        return b.trending - a.trending;
      case "latest":
      default:
        return new Date(b.date) - new Date(a.date);
    }
  });

  const featuredPosts = blogPosts.filter((post) => post.featured);
  const trendingPosts = blogPosts.filter((post) => post.trending);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800";
      case "Intermediate":
        return "bg-blue-100 text-blue-800";
      case "Advanced":
        return "bg-orange-100 text-orange-800";
      case "Expert":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/*  Header */}
      <Navbar />

      {/* Hero Section */}
      <section className="w-full max-w-[93rem] mx-auto bg-gradient-to-r from-gray-900  via-[#1A433A] to-[#2D7A67] rounded-xl py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center text-white">
            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Insights & <span className="text-[#AAD294]">Intelligence</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl md:text-2xl mb-10 text-gray-200 leading-relaxed">
              Expert analysis, research findings, and strategic insights from
              education industry leaders
            </p>

            {/* Search Bar */}
            <div className="relative max-w-3xl mx-auto w-full">
              <div className="bg-white rounded-2xl shadow-2xl px-3 py-2 sm:px-4 sm:py-3">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-2">
                  {/* Search Icon (only on sm and above) */}
                  <div className="hidden sm:flex items-center pl-2 text-gray-400">
                    <Search size={24} />
                  </div>

                  {/* Input */}
                  <input
                    type="text"
                    placeholder="Search insights, research, case studies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-4 py-3 text-base sm:text-lg outline-none bg-transparent text-gray-800 placeholder-gray-500"
                  />

                  {/* Button */}
                  <button className="w-full sm:w-auto bg-[#2D7A67] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#1A433A] transition-colors">
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Advanced Sidebar */}
          <div className="lg:col-span-1 mb-8 lg:mb-0">
            <div className="space-y-6">
              {/* Categories */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Filter className="mr-2 text-[#2D7A67]" size={20} />
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.map((category) => {
                    const IconComponent = category.icon;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                          selectedCategory === category.id
                            ? "bg-[#2D7A67] text-white shadow-md"
                            : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <IconComponent size={16} className="mr-2" />
                            <span className="font-medium">{category.name}</span>
                          </div>
                          <span className="text-sm opacity-75">
                            ({category.count})
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Trending Topics */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="mr-2 text-[#2D7A67]" size={20} />
                  Trending Now
                </h3>
                <div className="space-y-3">
                  {trendingPosts.slice(0, 3).map((post) => (
                    <div
                      key={post.id}
                      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                          {post.title}
                        </h4>
                        <div className="flex items-center text-xs text-gray-500">
                          <Eye size={12} className="mr-1" />
                          {post.views.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div className="bg-gradient-to-br from-[#2D7A67] to-[#1A433A] rounded-xl p-6 text-white">
                <div className="flex items-center mb-3">
                  <Bell className="mr-2" size={20} />
                  <h3 className="text-lg font-bold">Stay Informed</h3>
                </div>
                <p className="text-sm text-white/90 mb-4">
                  Get weekly insights and research updates delivered to your
                  inbox.
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full px-3 py-2 rounded-lg text-gray-900 text-sm"
                  />
                  <button className="w-full bg-white text-[#2D7A67] py-2 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {/* Content Controls */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedCategory === "all"
                      ? "All Insights"
                      : `${selectedCategory} Insights`}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {sortedPosts.length} article
                    {sortedPosts.length !== 1 ? "s" : ""} found
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D7A67] focus:border-transparent"
                  >
                    <option value="latest">Latest</option>
                    <option value="popular">Most Popular</option>
                    <option value="trending">Trending</option>
                  </select>

                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 ${
                        viewMode === "grid"
                          ? "bg-[#2D7A67] text-white"
                          : "text-gray-600"
                      }`}
                    >
                      <Grid size={18} />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 ${
                        viewMode === "list"
                          ? "bg-[#2D7A67] text-white"
                          : "text-gray-600"
                      }`}
                    >
                      <List size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Section */}
            {selectedCategory === "all" && searchTerm === "" && (
              <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <Award className="mr-2 text-[#2D7A67]" size={24} />
                    Featured Insights
                  </h2>
                  <button className="text-[#2D7A67] hover:text-[#1A433A] font-medium flex items-center">
                    View All <ChevronRight size={16} className="ml-1" />
                  </button>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  {featuredPosts.slice(0, 2).map((post) => (
                    <article
                      key={post.id}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group"
                    >
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 left-4 flex gap-2">
                          <span className="bg-[#2D7A67] text-white px-3 py-1 rounded-full text-sm font-medium">
                            Featured
                          </span>
                          {post.trending && (
                            <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                              Trending
                            </span>
                          )}
                        </div>
                        <div className="absolute top-4 right-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                              post.difficulty
                            )}`}
                          >
                            {post.difficulty}
                          </span>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                          <span className="bg-gray-100 px-2 py-1 rounded-full text-[#2D7A67] font-medium">
                            {post.category}
                          </span>
                          <div className="flex items-center">
                            <Calendar size={14} className="mr-1" />
                            {formatDate(post.date)}
                          </div>
                          <div className="flex items-center">
                            <Clock size={14} className="mr-1" />
                            {post.readTime}
                          </div>
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#2D7A67] transition-colors cursor-pointer line-clamp-2">
                          {post.title}
                        </h3>

                        <p className="text-gray-700 mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <img
                              src={post.authorImage}
                              alt={post.author}
                              className="w-8 h-8 rounded-full mr-3"
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {post.author}
                              </div>
                              <div className="text-xs text-gray-600">
                                {post.authorRole}
                              </div>
                            </div>
                          </div>

                          <button className="text-[#2D7A67] hover:text-[#1A433A] font-medium flex items-center transition-colors">
                            Read More <ArrowRight size={16} className="ml-1" />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* Articles Grid/List */}
            <section>
              {sortedPosts.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
                  <BookOpen className="mx-auto mb-4 text-gray-400" size={64} />
                  <h3 className="text-2xl font-bold text-gray-700 mb-2">
                    No articles found
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Try adjusting your search or category filter
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("all");
                    }}
                    className="px-6 py-3 bg-[#2D7A67] text-white rounded-lg font-semibold hover:bg-[#1A433A] transition-colors"
                  >
                    Show All Articles
                  </button>
                </div>
              ) : (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid md:grid-cols-2 gap-6"
                      : "space-y-6"
                  }
                >
                  {sortedPosts.map((post) => (
                    <article
                      key={post.id}
                      className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group ${
                        viewMode === "list" ? "md:flex" : ""
                      }`}
                    >
                      <div
                        className={`relative overflow-hidden ${
                          viewMode === "list"
                            ? "md:w-1/3 h-48 md:h-auto"
                            : "h-48"
                        }`}
                      >
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3 flex gap-2">
                          {post.trending && (
                            <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                              Trending
                            </span>
                          )}
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                              post.difficulty
                            )}`}
                          >
                            {post.difficulty}
                          </span>
                        </div>
                      </div>

                      <div
                        className={`p-6 ${
                          viewMode === "list" ? "md:w-2/3" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                          <span className="bg-gray-100 px-2 py-1 rounded-full text-[#2D7A67] font-medium">
                            {post.category}
                          </span>
                          <div className="flex items-center">
                            <Calendar size={14} className="mr-1" />
                            {formatDate(post.date)}
                          </div>
                          <div className="flex items-center">
                            <Clock size={14} className="mr-1" />
                            {post.readTime}
                          </div>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-[#2D7A67] transition-colors cursor-pointer line-clamp-2">
                          {post.title}
                        </h3>

                        <p className="text-gray-700 mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <img
                              src={post.authorImage}
                              alt={post.author}
                              className="w-8 h-8 rounded-full mr-3"
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {post.author}
                              </div>
                              <div className="text-xs text-gray-600">
                                {post.authorRole}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <Eye size={14} className="mr-1" />
                              {post.views.toLocaleString()}
                            </div>
                            <button className="text-[#2D7A67] hover:text-[#1A433A] font-medium flex items-center transition-colors">
                              Read <ArrowRight size={16} className="ml-1" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      {/*  Footer */}
      <Footer />
    </div>
  );
};

export default BlogPage;
