import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import '../index.css';

import Polygon1 from "./Testimonials/Polygon1";
import Polygon2 from "./Testimonials/Polygon2";
import Polygon3 from "./Testimonials/Polygon3";
import Polygon4 from "./Testimonials/Polygon4";
import Polygon5 from "./Testimonials/Polygon5";
import Polygon6 from "./Testimonials/Polygon6";

const Testimonial = () => {
  return (
    <div className="min-h-screen px-0 md:px-4 py-16 pb-10 md:pb-32 text-center relative overflow-visible">

      <h1 className="text-4xl sm:text-5xl font-bold text-[#002639] mb-2">
        “Voices of Success”
      </h1>
      <p className="text-[#002639] font-medium mb-20 text-2xl sm:text-3xl">
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
            slidesPerView: 3,
            slidesPerGroup: 3,
          },
          1024: {
            slidesPerView: 3,
            slidesPerGroup: 3,
          },
        }}
        className="max-w-full mx-auto relative pb-20"
      >
        <SwiperSlide><Polygon1 /></SwiperSlide>
        <SwiperSlide><Polygon2 /></SwiperSlide>
        <SwiperSlide><Polygon3 /></SwiperSlide>
        <SwiperSlide><Polygon4 /></SwiperSlide>
        <SwiperSlide><Polygon5 /></SwiperSlide>
        <SwiperSlide><Polygon6 /></SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Testimonial;
