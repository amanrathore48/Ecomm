import React from "react";
import { Swiper, SwiperSlide } from "../../config/swiperConfig";
import { todaysDeals } from "@/data";

const TodaysDeals = () => {
  return (
    <div className="py-4 px-4 lg:px-20">
      <div className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-4">
        <h1 className="font-semibold font-pango text-2xl">Todays Deals</h1>
        <Swiper
          // pagination={{ clickable: true }}
          scrollbar={{ draggable: true }}
          className="mySwiper"
          breakpoints={{
            // when window width is >= 640px
            420: {
              slidesPerView: 1,
              spaceBetween: 8,
            },
            // when window width is >= 768px
            640: {
              slidesPerView: 2,
              spaceBetween: 10,
            },
            // when window width is >= 1024px
            1024: {
              slidesPerView: 3,
              spaceBetween: 15,
            },
            1240: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
          }}
        >
          {todaysDeals.map((prod, index) => (
            <SwiperSlide key={index} className=" md:w-1/4 lg:w-1/5 px-2 py-10 ">
              <div className="flex flex-col gap-2 justify-center">
                <div className="h-[150px] flex items-center justify-center bg-[#f7f8f8]">
                  <img
                    className="w-full h-full object-contain"
                    src={prod.img}
                  />
                </div>
                <div className="flex gap-1 justify-between mt-1">
                  <div className="bg-[#cc0c39] py-1 px-2 text-white rounded-sm w-max">
                    {prod.discount}
                  </div>
                  <p className="text-red-500 text-sm ">Deal of the day</p>
                </div>
                <div>
                  <p className="text-zinc-800 text-sm">{prod.des}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
          <div className="swiper-button-prev"></div>
          <div className="swiper-button-next"></div>
        </Swiper>
      </div>
    </div>
  );
};

export default TodaysDeals;
