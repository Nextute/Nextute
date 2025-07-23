
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import '../index.css';

import Polygon from "./Testimonials/Polygon";

const Testimonial = () => {
  return (
    <div className="px-0 md:px-8 py-16 pb-10 md:pb-32 my-20 text-center relative overflow-visible">

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
        <SwiperSlide><Polygon /></SwiperSlide>
        <SwiperSlide><Polygon /></SwiperSlide>
        <SwiperSlide><Polygon /></SwiperSlide>
        <SwiperSlide><Polygon /></SwiperSlide>
        <SwiperSlide><Polygon /></SwiperSlide>
        <SwiperSlide><Polygon /></SwiperSlide>
        <SwiperSlide><Polygon /></SwiperSlide>
        <SwiperSlide><Polygon /></SwiperSlide>
        <SwiperSlide><Polygon /></SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Testimonial;
