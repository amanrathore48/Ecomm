import React from "react";
import { BsCheck2 } from "react-icons/bs";

const TrackOrder = () => {
  return (
    <section className=" flex items-center justify-center">
      <div className="relative my-10 flex h-full flex-col overflow-hidden rounded-2xl bg-white text-gray-600 shadow-lg ring-1 ring-gray-200">
        <div className="border-b p-6">
          <h6 className="mb-2 text-base font-semibold">
            Dont worry we will deliver your product asap!
          </h6>
          <p className="mb-4 text-sm font-light">
            <i
              className="inline-block font-black not-italic text-green-600"
              aria-hidden="true"
            ></i>
            Out of Delivery
          </p>
        </div>
        <div className="flex-auto p-6">
          <div className="relative flex flex-col justify-center">
            <div className="absolute left-4 h-full border-r-2"></div>
            <div className="relative mb-4">
              <span className="absolute inline-flex h-8 w-8 items-center justify-center rounded-full p-1 text-center text-base font-semibold shadow bg-blue-500">
                <BsCheck2 className="text-white" />
              </span>
              <div className="ml-12 w-auto pt-1">
                <h6 className="text-sm font-semibold text-blue-900">
                  Dispatched
                </h6>
                <p className="mt-1 text-xs text-gray-500">22 DEC 7:20 PM</p>
              </div>
            </div>
            <div className="relative mb-4">
              <span className="absolute inline-flex h-8 w-8 items-center justify-center rounded-full p-1 text-center text-base font-semibold shadow bg-blue-500">
                <BsCheck2 className="text-white" />
              </span>
              <div className="ml-12 w-auto pt-1">
                <h6 className="text-sm font-semibold text-blue-900">Shipped</h6>
                <p className="mt-1 text-xs text-gray-500">24 DEC 11 PM</p>
              </div>
            </div>
            <div className="relative mb-4">
              <span className="absolute inline-flex h-8 w-8 items-center justify-center rounded-full p-1 text-center text-base font-semibold shadow bg-blue-500">
                <BsCheck2 className="text-white" />
              </span>
              <div className="ml-12 w-auto pt-1">
                <h6 className="text-sm font-semibold text-blue-900">
                  Out of Delivery
                </h6>
                <p className="mt-1 text-xs text-gray-500">26 DEC 9:34 PM</p>
              </div>
            </div>
            <div className="relative mb-4">
              <span className="absolute inline-flex h-6 w-6 items-center justify-center text-center text-base font-semibold">
                <span className="text-xl text-orange-600"></span>
              </span>
              <div className="ml-12 w-auto pt-1">
                <h6 className="text-sm font-semibold text-blue-900">
                  New Delhi
                </h6>
                <p className="mt-1 text-xs text-gray-500">27 DEC 2:20 AM</p>
              </div>
            </div>
            <div className="relative mb-4">
              <span className="absolute inline-flex h-6 w-6 items-center justify-center text-center text-base font-semibold">
                <span className="text-xl text-red-600"></span>
              </span>
              <div className="ml-12 w-auto pt-1">
                <h6 className="text-sm font-semibold text-blue-900">
                  A block, Shalimar Bagh
                </h6>
                <p className="mt-1 text-xs text-gray-500">27 DEC 4:54 AM</p>
              </div>
            </div>
            <div className="relative">
              <span className="absolute inline-flex h-6 w-6 items-center justify-center text-center text-base font-semibold">
                <span className="text-xl text-blue-900"></span>
              </span>
              <div className="ml-12 w-auto pt-1">
                <h6 className="text-sm font-semibold text-blue-900">
                  Delivered
                </h6>
                <p className="mt-1 text-xs text-gray-500">Expected By 28 DEC</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrackOrder;
