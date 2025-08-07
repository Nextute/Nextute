import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../index.css";
import TestimonialCard from "./TestimonialCard";

const Testimonial = () => {
  // Array of testimonial data
  const testimonials = [
    {
      id: "t1",
      text: "The coaching at Excel Academy transformed my approach to learning. The teachers were incredibly supportive, and the study materials were top-notch. Thanks to their guidance, I scored 95% in my board exams and secured a seat in my dream engineering college!",
      quote:
        "Their personalized mentoring and rigorous mock tests made all the difference.",
      author: "Priya Sharma, JEE Aspirant",
      rating: 5,
    },
    {
      id: "t2",
      text: "Excel Academy's doubt-clearing sessions were a game-changer. The faculty's dedication and clear explanations helped me master complex topics in Physics and Chemistry.",
      quote: "The interactive classes boosted my confidence for NEET.",
      author: "Rahul Verma, NEET Aspirant",
      rating: 4.5,
    },
    {
      id: "t3",
      text: "The structured curriculum at Excel Academy made preparing for JEE a breeze. Their regular assessments kept me on track, and I improved significantly over time.",
      quote: "The mock tests were incredibly close to the actual exam pattern!",
      author: "Ananya Gupta, JEE Aspirant",
      rating: 4,
    },
    {
      id: "t4",
      text: "I was struggling with Mathematics until I joined Excel Academy. The teachers broke down concepts into simple steps, making it easier to understand.",
      quote: "Their focus on fundamentals helped me excel in my exams.",
      author: "Vikram Singh, Class 12 Student",
      rating: 5,
    },
    {
      id: "t5",
      text: "Excel Academy provided me with the perfect study environment. The small batch sizes ensured personalized attention, which made a huge difference in my preparation.",
      quote: "I owe my success in NEET to their amazing faculty.",
      author: "Sneha Patel, NEET Aspirant",
      rating: 4.5,
    },
    {
      id: "t6",
      text: "The online classes at Excel Academy were as effective as their offline sessions. The recorded lectures allowed me to revise at my own pace.",
      quote: "Flexibility and quality teaching made learning enjoyable.",
      author: "Arjun Mehra, JEE Aspirant",
      rating: 4,
    },
    {
      id: "t7",
      text: "Joining Excel Academy was the best decision for my board exam preparation. Their study materials were concise yet comprehensive, covering every topic thoroughly.",
      quote: "The teachers' encouragement kept me motivated throughout.",
      author: "Kavya Reddy, Class 12 Student",
      rating: 5,
    },
    {
      id: "t8",
      text: "The mentorship at Excel Academy helped me stay focused during my JEE preparation. Their tips and tricks for time management were invaluable during the exam.",
      quote: "I couldn't have asked for better guidance!",
      author: "Rohan Desai, JEE Aspirant",
      rating: 4.5,
    },
    {
      id: "t9",
      text: "Excel Academy's faculty went above and beyond to ensure I understood every concept. Their regular feedback helped me improve my weak areas quickly.",
      quote: "The supportive environment made all the difference.",
      author: "Meera Joshi, NEET Aspirant",
      rating: 5,
    },
  ];

  return (
    <div className="px-0 md:px-8 py-16 pb-10 my-20 text-center relative overflow-visible">
      <h1 className="text-4xl sm:text-5xl font-bold text-[#002639] mb-2">
        “Voices of Success”
      </h1>
      <p className="text-[#002639] font-medium mb-5 text-2xl sm:text-3xl">
        Our Student Stories
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
  );
};

export default Testimonial;
