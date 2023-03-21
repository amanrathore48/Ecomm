import SwiperCore, {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
} from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.min.css";

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y, Autoplay]);

export { Swiper, SwiperSlide };
