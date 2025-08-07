import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { FaStar, FaPen, FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";

const Reviews = ({ instituteId, reviews, setReviews }) => {
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: "",
    email: "",
    details: "",
  });
  const reviewFormRef = useRef(null);

  useEffect(() => {
    if (isWritingReview || editingReview) {
      reviewFormRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isWritingReview, editingReview]);

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (rating) => {
    setNewReview((prev) => ({ ...prev, rating }));
  };

  const validateReview = () => {
    const errors = {};
    if (!newReview.rating) errors.rating = "Rating is required";
    if (!newReview.email.trim()) errors.email = "Email is required";
    if (!newReview.comment.trim()) errors.comment = "Review title is required";
    if (!newReview.details.trim())
      errors.details = "Review details are required";
    return errors;
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    const errors = validateReview();
    if (Object.keys(errors).length > 0) {
      toast.error("Please fill all required fields.", {
        position: "top-right",
        duration: 3000,
        style: { background: "#E6EDE2", color: "#144E53" },
      });
      return;
    }

    try {
      const reviewData = {
        rating: newReview.rating,
        comment: newReview.comment,
        email: newReview.email,
        details: newReview.details,
      };

      if (editingReview) {
        const res = await axios.patch(
          `${
            import.meta.env.VITE_BACKEND_BASE_URL
          }/api/institutes/${instituteId}/reviews/${editingReview.reviewId}`,
          reviewData,
          { withCredentials: true }
        );
        if (res.data?.status) {
          setReviews((prev) =>
            prev.map((review) =>
              review.reviewId === editingReview.reviewId
                ? { ...review, ...reviewData }
                : review
            )
          );
          toast.success("Review updated successfully!", {
            position: "top-right",
            duration: 3000,
            style: { background: "#E6EDE2", color: "#144E53" },
          });
        }
      } else {
        const res = await axios.post(
          `${
            import.meta.env.VITE_BACKEND_BASE_URL
          }/api/institutes/${instituteId}/reviews`,
          reviewData,
          { withCredentials: true }
        );
        if (res.data?.status) {
          setReviews((prev) => [...prev, res.data.data]);
          toast.success("Review added successfully!", {
            position: "top-right",
            duration: 3000,
            style: { background: "#E6EDE2", color: "#144E53" },
          });
        }
      }

      setNewReview({ rating: 0, email: "", comment: "", details: "" });
      setIsWritingReview(false);
      setEditingReview(null);
    } catch (err) {
      console.error("Error submitting review:", err);
      toast.error("Failed to submit review.", {
        position: "top-right",
        duration: 3000,
        style: { background: "#E6EDE2", color: "#144E53" },
      });
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setNewReview({
      rating: review.rating,
      comment: review.comment,
      email: review.email,
      details: review.details,
    });
    setIsWritingReview(true);
  };

  const handleDeleteReview = (reviewId) => {
    toast(
      <div className="flex flex-col gap-2">
        <p>Are you sure you want to delete this review?</p>
        <div className="flex gap-2">
          <button
            className="px-4 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
            onClick={async () => {
              try {
                const res = await axios.delete(
                  `${
                    import.meta.env.VITE_BACKEND_BASE_URL
                  }/api/institutes/${instituteId}/reviews/${reviewId}`,
                  { withCredentials: true }
                );
                if (res.data?.status) {
                  setReviews((prev) =>
                    prev.filter((review) => review.reviewId !== reviewId)
                  );
                  toast.success("Review deleted successfully!", {
                    position: "top-right",
                    duration: 3000,
                    style: { background: "#E6EDE2", color: "#144E53" },
                  });
                }
              } catch (err) {
                console.error("Error deleting review:", err);
                toast.error("Failed to delete review.", {
                  position: "top-right",
                  duration: 3000,
                  style: { background: "#E6EDE2", color: "#144E53" },
                });
              }
              toast.dismiss();
            }}
          >
            Confirm
          </button>
          <button
            className="px-4 py-1 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
            onClick={() => toast.dismiss()}
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        style: { background: "#fff", color: "#144E53", padding: "16px" },
      }
    );
  };

  return (
    <div className="space-y-6">
      {!isWritingReview && !editingReview ? (
        <>
          <div className="space-y-4">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <motion.div
                  key={review.reviewId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: reviews.indexOf(review) * 0.1,
                  }}
                  className="bg-white rounded-xl p-4 shadow-md border border-teal-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={
                            i < review.rating
                              ? "text-teal-600"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEditReview(review)}
                        className="text-teal-600 hover:text-teal-800"
                      >
                        <FaPen />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteReview(review.reviewId)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <FaTrash />
                      </motion.button>
                    </div>
                  </div>
                  <p className="text-lg font-semibold text-gray-800 mt-2">
                    "{review.comment}"
                  </p>
                  <p className="text-gray-600">{review.details}</p>
                  <p className="text-sm text-gray-500 italic text-end">
                    – {review.email}
                  </p>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-600 text-center text-lg">
                No reviews available. Be the first to write one!
              </p>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setIsWritingReview(true);
              setEditingReview(null);
              setNewReview({ rating: 0, email: "", comment: "", details: "" });
            }}
            className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-all flex items-center gap-2 mx-auto"
          >
            <FaPen />
            Write a Review
          </motion.button>
        </>
      ) : (
        <motion.div
          ref={reviewFormRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-md border border-teal-200"
        >
          <h3 className="text-2xl font-semibold text-teal-800 mb-4 text-center">
            {editingReview ? "Edit Review" : "Write a Review"}
          </h3>
          <form onSubmit={handleSubmitReview} className="space-y-6">
            <div className="flex items-center gap-6">
              <label className="text-lg font-medium text-teal-800 whitespace-nowrap">
                Rating <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleRatingChange(star)}
                    className="focus:outline-none"
                  >
                    <FaStar
                      className={`text-2xl ${
                        star <= newReview.rating
                          ? "text-teal-600"
                          : "text-gray-300"
                      }`}
                    />
                  </motion.button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-6">
              <label className="text-lg font-medium text-teal-800 whitespace-nowrap">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={newReview.email}
                onChange={handleReviewChange}
                className="w-full p-2 border border-teal-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300 bg-white"
                required
              />
            </div>
            <div className="flex items-center gap-6">
              <label className="text-lg font-medium text-teal-800 whitespace-nowrap">
                Review Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="comment"
                value={newReview.comment}
                onChange={handleReviewChange}
                className="w-full p-2 border border-teal-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300 bg-white"
                required
              />
            </div>
            <div className="flex items-center gap-6">
              <label className="text-lg font-medium text-teal-800 whitespace-nowrap">
                Review Details <span className="text-red-500">*</span>
              </label>
              <textarea
                name="details"
                value={newReview.details}
                onChange={handleReviewChange}
                className="w-full p-2 border border-teal-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300 bg-white"
                rows="4"
                required
              />
            </div>
            <div className="flex justify-end gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-all"
              >
                {editingReview ? "Update Review" : "Submit Review"}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => {
                  setIsWritingReview(false);
                  setEditingReview(null);
                  setNewReview({
                    rating: 0,
                    email: "",
                    comment: "",
                    details: "",
                  });
                }}
                className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition-all"
              >
                Cancel
              </motion.button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
};

export default Reviews;
