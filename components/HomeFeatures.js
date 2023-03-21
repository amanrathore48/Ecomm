import React from "react";
import { FaBoxOpen, FaShippingFast } from "react-icons/fa";
import { GiTShirt } from "react-icons/gi";
import { TbDiscount2 } from "react-icons/tb";

const HomeFeatures = () => {
  return (
    <div>
      <div class="text-gray-600 body-font">
        <div class="container px-5 py-24 mx-auto">
          <div class="flex flex-col text-center w-full mb-20">
            <h1 class="sm:text-3xl text-2xl font-medium text-black title-font mb-4 font-monster">
              Best Customer Services
            </h1>
            <p class="lg:w-2/3 mx-auto leading-relaxed text-base font-pango">
              We ensure that our customes have best shopping experience
            </p>
          </div>
          <div class="flex flex-wrap justify-around -m-4 text-center">
            <div class="p-4 md:w-1/4 sm:w-1/2 w-full">
              <div class="border-2 border-gray-200 px-4 py-6 rounded-lg hover:scale-110 hover:shadow-lg cursor-pointer transition-all">
                <FaBoxOpen
                  size={50}
                  color={"#D11732"}
                  style={{ margin: "auto" }}
                />
                <p class="leading-relaxed">Premium Products</p>
              </div>
            </div>
            <div class="p-4 md:w-1/4 sm:w-1/2 w-full">
              <div class="border-2 border-gray-200 px-4 py-6 rounded-lg hover:scale-110 hover:shadow-lg cursor-pointer transition-all ">
                <FaShippingFast
                  size={50}
                  color={"#D11732"}
                  style={{ margin: "auto" }}
                />

                <p class="leading-relaxed">Free Shipping</p>
              </div>
            </div>
            <div class="p-4 md:w-1/4 sm:w-1/2 w-full">
              <div class="border-2 border-gray-200 px-4 py-6 rounded-lg hover:scale-110 hover:shadow-lg cursor-pointer transition-all ">
                <TbDiscount2
                  size={50}
                  color={"#D11732"}
                  style={{ margin: "auto" }}
                />

                <p class="leading-relaxed">Exciting Offers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeFeatures;
