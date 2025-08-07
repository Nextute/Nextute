import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Calendar,
  User,
  Clock,
  Tag,
  Eye,
  MessageCircle,
  Heart,
  Share2,
  ChevronLeft,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const BlogPostPage = () => {
  const { id } = useParams(); // Get the post ID from the URL

  // Blog data (same as in BlogPage)
  const blogPosts = [
    {
      id: 1,
      title: "Digital Transformation in Education: A Comprehensive Analysis",
      excerpt:
        "Exploring how technology is reshaping the educational landscape and creating new opportunities for learners worldwide.",
      content:
        "Digital transformation in education is revolutionizing how knowledge is delivered and consumed. The integration of artificial intelligence, virtual reality, and data analytics has enabled personalized learning experiences that cater to individual student needs. For instance, AI-driven platforms can adapt content in real-time, ensuring students receive tailored resources to bridge knowledge gaps. Virtual classrooms have expanded access to education, allowing students from remote areas to participate in high-quality courses. Moreover, data analytics provides educators with insights into student performance, enabling targeted interventions. This article explores case studies of institutions that have successfully implemented digital tools, the challenges of adopting these technologies, and future trends in EdTech innovation.",
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
      content:
        "Preparing for competitive exams requires a disciplined and strategic approach. Evidence-based techniques such as spaced repetition, active recall, and interleaved practice have proven effective in enhancing retention and performance. Spaced repetition involves reviewing material at increasing intervals to reinforce memory, while active recall encourages retrieving information without cues, strengthening neural pathways. This article outlines a framework for creating a personalized study plan, including time management strategies, practice with past papers, and mental conditioning to handle exam stress. Case studies of top performers reveal how these methods lead to success in high-stakes environments like medical or engineering entrance exams.",
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
      content:
        "Cognitive science provides valuable insights into how the brain processes and retains information. Techniques such as chunking, where information is broken into manageable units, and metacognition, which involves thinking about one’s own learning process, can significantly improve educational outcomes. Interleaving, or mixing different topics during study sessions, enhances long-term retention by fostering connections between concepts. This article discusses how these principles can be applied in classroom settings and online learning platforms, with examples from recent studies showing improved student performance. It also explores the role of neurofeedback in optimizing learning environments.",
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
      content:
        "The global education sector is undergoing rapid transformation, driven by technological advancements and changing learner expectations. Online learning platforms have seen exponential growth, with a surge in demand for micro-credentials and lifelong learning programs. This article provides a detailed market analysis, highlighting trends such as gamification, hybrid learning models, and the rise of AI-driven tutoring systems. It also examines the economic implications of these trends, including increased investment in EdTech startups and the challenges of ensuring equitable access to digital education. Data from recent industry reports underscores the potential for growth in emerging markets.",
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
      content:
        "Data-driven personalization is transforming educational technology by tailoring content to individual learner profiles. Machine learning algorithms analyze student data—such as performance metrics, learning pace, and preferences—to deliver customized lessons and assessments. This article explores how platforms like adaptive learning systems use predictive models to enhance engagement and outcomes. It also discusses challenges, including data privacy concerns and the need for robust infrastructure to support large-scale personalization. Real-world examples demonstrate how schools and universities are implementing these technologies to improve student success rates.",
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
      content:
        "Effective leadership is critical to the success of educational institutions. This article presents case studies of top-performing schools and universities, highlighting leadership principles such as visionary planning, stakeholder collaboration, and data-driven decision-making. For example, one case study examines how a university transformed its curriculum by involving faculty, students, and industry partners in the planning process. Another explores how a school district used data analytics to improve graduation rates. The article also discusses challenges leaders face, such as resistance to change, and offers strategies for overcoming them.",
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

  // Find the post by ID
  const post = blogPosts.find((p) => p.id === parseInt(id));

  // State for likes and comments
  const [likes, setLikes] = useState(post?.likes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState(post?.comments || 0);
  const [commentText, setCommentText] = useState("");
  const [commentList, setCommentList] = useState([
    // Sample comments for demonstration
    {
      id: 1,
      author: "John Doe",
      text: "Great insights on digital transformation! Very informative.",
      date: "2024-01-16",
    },
    {
      id: 2,
      author: "Jane Smith",
      text: "This really helped me understand the topic better. Thanks!",
      date: "2024-01-17",
    },
  ]);

  // Handle like button click
  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  // Handle comment submission
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      setCommentList([
        ...commentList,
        {
          id: commentList.length + 1,
          author: "Anonymous User", // Replace with actual user data in a real app
          text: commentText,
          date: new Date().toISOString().split("T")[0],
        },
      ]);
      setComments(comments + 1);
      setCommentText("");
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get difficulty color
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

  // If no post is found, show a fallback
  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Post Not Found</h2>
          <p className="text-gray-600 mt-2">
            The requested blog post could not be found.
          </p>
          <Link
            to="/blog"
            className="mt-4 inline-flex items-center text-[#2D7A67] hover:text-[#1A433A] font-medium"
          >
            <ChevronLeft size={16} className="mr-1" />
            Back to Blog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Back Button */}
        <Link
          to="/blog"
          className="inline-flex items-center text-[#2D7A67] hover:text-[#1A433A] font-medium mb-6"
        >
          <ChevronLeft size={16} className="mr-1" />
          Back to Blog
        </Link>

        {/* Blog Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-gray-100 px-2 py-1 rounded-full text-[#2D7A67] text-sm font-medium">
              {post.category}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                post.difficulty
              )}`}
            >
              {post.difficulty}
            </span>
            {post.featured && (
              <span className="bg-[#2D7A67] text-white px-2 py-1 rounded-full text-sm font-medium">
                Featured
              </span>
            )}
            {post.trending && (
              <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-sm font-medium">
                Trending
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
            <div className="flex items-center">
              <Calendar size={16} className="mr-1" />
              {formatDate(post.date)}
            </div>
            <div className="flex items-center">
              <Clock size={16} className="mr-1" />
              {post.readTime}
            </div>
            <div className="flex items-center">
              <Eye size={16} className="mr-1" />
              {post.views.toLocaleString()} views
            </div>
            <div className="flex items-center">
              <MessageCircle size={16} className="mr-1" />
              {comments} comments
            </div>
            <div className="flex items-center">
              <Heart size={16} className="mr-1" />
              {likes} likes
            </div>
          </div>
        </header>

        {/* Blog Image */}
        <div className="mb-8">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-96 object-cover rounded-xl shadow-sm"
          />
        </div>

        {/* Blog Content */}
        <article className="prose prose-lg max-w-none text-gray-800 mb-12">
          <p className="text-lg font-medium text-gray-700">{post.excerpt}</p>
          <div className="mt-4">{post.content}</div>
          <h2 className="mt-8">Key Takeaways</h2>
          <ul>
            <li>Insightful point about the topic derived from the analysis.</li>
            <li>Critical aspects to consider for practical implementation.</li>
            <li>
              Future implications and potential developments in the field.
            </li>
          </ul>
          <p>
            The insights provided in this article highlight the transformative
            potential of the discussed approaches. By adopting these strategies,
            stakeholders in education can drive meaningful change, ensuring
            better outcomes for learners and institutions alike.
          </p>
        </article>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Interaction Buttons */}
        <div className="flex items-center gap-4 mb-12">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              isLiked
                ? "bg-[#2D7A67] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            } transition-colors`}
          >
            <Heart size={20} className={isLiked ? "fill-current" : ""} />
            Like ({likes})
          </button>
          <button
            onClick={() =>
              document.getElementById("comments-section").scrollIntoView({
                behavior: "smooth",
              })
            }
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <MessageCircle size={20} />
            Comment ({comments})
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Share2 size={20} />
            Share
          </button>
        </div>

        {/* Comments Section */}
        <section id="comments-section" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Comments ({comments})
          </h2>

          {/* Comment Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Leave a Comment
            </h3>
            <form onSubmit={handleCommentSubmit}>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write your comment here..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D7A67] focus:border-transparent resize-y min-h-[120px]"
              />
              <button
                type="submit"
                className="mt-3 px-6 py-2 bg-[#2D7A67] text-white rounded-lg font-semibold hover:bg-[#1A433A] transition-colors"
              >
                Post Comment
              </button>
            </form>
          </div>

          {/* Comment List */}
          <div className="space-y-6">
            {commentList.map((comment) => (
              <div
                key={comment.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <User size={20} className="text-gray-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {comment.author}
                    </div>
                    <div className="text-xs text-gray-600">
                      {formatDate(comment.date)}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700">{comment.text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default BlogPostPage;
