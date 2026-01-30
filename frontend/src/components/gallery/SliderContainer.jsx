import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '@styles/SliderContainer.css';

import { Navigation } from 'swiper/modules';
import { CDN_URL } from '@/constants/cdn';

const SliderContainer = () => {
  const items = [
    { src: `${CDN_URL}/wedding/gallery01.png` },
    { src: `${CDN_URL}/wedding/gallery02.png` },
  ];
  return (
    <>
      <Swiper
        effect={'fade'}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        navigation
        pagination={{
          clickable: true,
        }}
        modules={[Navigation]}
        className="mySwiper"
        loop={true}
      >
        {items.map((item, idx) => (
          <SwiperSlide
            key={idx}
            style={{ backgroundImage: `url(${item.src})` }}
            className="swiper-slide-bg"
          ></SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default SliderContainer;
