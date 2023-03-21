import ProdCard from "./ProdCard";
import Card from "./Card";
import "swiper/swiper-bundle.min.css";
import { Swiper, SwiperSlide } from "../config/swiperConfig";

const TopCat = ({ products }) => {
  const categoriesNames = [...new Set(products.map((p) => p.category))];
  return (
    <div className="mx-4 lg:mx-20">
      <h1 className=" text-left font-semibold mt-6 py-2 text-3xl font-ubuntu text-zinc-800 uppercase">
        Top Categories
      </h1>
      <div>
        {categoriesNames.map((categoryName) => (
          <div className="mx-2 sm:mx-4 md:mx-2" key={categoryName}>
            {products.find((p) => p.category === categoryName) && (
              <div>
                <div className="h-10 w-40 flex items-center">
                  <h2 className="text-xl font-pango capitalize">
                    {" "}
                    {categoryName}
                  </h2>
                </div>

                <div className="swiper-container">
                  <Swiper
                    // pagination={{ clickable: true }}
                    scrollbar={{ draggable: true }}
                    className="mySwiper"
                    breakpoints={{
                      // when window width is >= 640px
                      420: {
                        slidesPerView: 1,
                        spaceBetween: 10,
                      },
                      // when window width is >= 768px
                      640: {
                        slidesPerView: 2,
                        spaceBetween: 15,
                      },
                      // when window width is >= 1024px
                      1024: {
                        slidesPerView: 3,
                        spaceBetween: 20,
                      },
                      1240: {
                        slidesPerView: 4,
                        spaceBetween: 20,
                      },
                    }}
                  >
                    {products
                      .filter((p) => p.category === categoryName)
                      .map((productInfo) => (
                        <SwiperSlide
                          key={productInfo._id}
                          className="w-full md:w-1/3 lg:w-1/4 px-2 py-10 "
                        >
                          <Card
                            image="https://m.media-amazon.com/images/I/61-lXIEMabL._AC_UL480_FMwebp_QL65_.jpg"
                            type={"Exclusive"}
                            width={"w-full"}
                            productInfo={productInfo}
                          />
                        </SwiperSlide>
                      ))}
                    <div className="swiper-button-prev"></div>
                    <div className="swiper-button-next"></div>
                  </Swiper>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopCat;
