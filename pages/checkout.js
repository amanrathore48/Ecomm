import { CartContext } from "@/stores/useCart";
import { shipAt } from "@/data/address";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useContext, useState, useEffect } from "react";
import { IoMdAddCircle } from "react-icons/io";
import { createOrder } from "@/helpers/useOrder";

const Checkout = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { cart, totalAmount } = useContext(CartContext);

  const [shipAdd, setShipAdd] = useState();

  const [order, setOrder] = useState();

  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.replace("/login");
    },
  });

  if (status === "loading") {
    return "Loading or not authenticated...";
  }

  const handleShipAdd = async () => {
    console.log("add new address");
  };
  const handleOrder = async () => {
    if (shipAdd) {
      console.log("order", cart, session.user.id);

      const data = {
        buyerId: session.user.id,
        cartItems: cart,
        shippingAddress: shipAdd,
        orderTotal: totalAmount,
      };
      await createOrder(data);
    }

    router.replace("/myorders");
  };

  return (
    <>
      <div className="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32">
        <div className="flex flex-col gap-4 px-4 pt-8">
          <div>
            <div className="flex justify-between px-1">
              <div>
                <p className="text-lg font-medium">Shipping Address</p>
              </div>
              <div>
                <IoMdAddCircle
                  onClick={handleShipAdd}
                  className="text-4xl cursor-pointer"
                />
              </div>
            </div>

            <form className="mt-5 grid gap-6">
              {shipAt.map((add, index) => (
                <div key={add.id} className="relative">
                  <input
                    className="peer hidden"
                    id={add.id}
                    type="radio"
                    name="radio"
                    checked={
                      (!shipAdd && add.id === 1) ||
                      (shipAdd && shipAdd?.id === add.id)
                    }
                  />
                  <span className="peer-checked:border-gray-700 absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white"></span>
                  <label
                    className="peer-checked:border-2 peer-checked:border-gray-700 peer-checked:bg-gray-50 flex cursor-pointer select-none rounded-lg border border-gray-300 p-4"
                    for={add.id}
                    onClick={() => {
                      setShipAdd(add);
                    }}
                  >
                    <div className="ml-5">
                      <span className="mt-2 font-semibold">{add.name}</span>
                      <p className="text-slate-500 text-sm leading-6">
                        {add.houseNo}, {add.street}, {add.city}, {add.state},{" "}
                        {add.country}
                      </p>
                    </div>
                  </label>
                </div>
              ))}
            </form>
          </div>
          <div className="mb-4">
            <p className="text-xl font-medium">Order Summary</p>
            <p className="text-gray-400">
              Check your items. And select a suitable shipping method.
            </p>
            <div className="mt-8 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-6">
              {cart.map((prod, index) => (
                <div className="flex flex-col rounded-lg bg-white sm:flex-row">
                  <img
                    className="m-2 h-24 w-28 rounded-md border object-cover object-center"
                    src={prod.img}
                    alt=""
                  />
                  <div className="flex w-full flex-col px-4 py-4">
                    <span className="font-semibold text-zinc-800">
                      {prod.title}
                    </span>
                    <span className="float-right text-gray-400">
                      {prod.brand}
                    </span>
                    <p className="text-lg font-bold">&#8377;{prod.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className=" flex  flex-col gap-4 mt-2 bg-gray-50 px-4 pt-8 lg:mt-0">
          <div>
            <p className="text-xl font-medium">Payment Details</p>
            <p className="text-gray-400">
              Complete your order by providing your payment details.
            </p>
            <div className="">
              <label
                for="card-holder"
                className="mt-4 mb-2 block text-sm font-medium"
              >
                Card Holder
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="card-holder"
                  name="card-holder"
                  className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm uppercase shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Your full name here"
                />
                <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"
                    />
                  </svg>
                </div>
              </div>
              <label
                for="card-no"
                className="mt-4 mb-2 block text-sm font-medium"
              >
                Card Details
              </label>
              <div className="flex">
                <div className="relative w-7/12 flex-shrink-0">
                  <input
                    type="text"
                    id="card-no"
                    name="card-no"
                    className="w-full rounded-md border border-gray-200 px-2 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="xxxx-xxxx-xxxx-xxxx"
                  />
                  <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                    <svg
                      className="h-4 w-4 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M11 5.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1z" />
                      <path d="M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2zm13 2v5H1V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1zm-1 9H2a1 1 0 0 1-1-1v-1h14v1a1 1 0 0 1-1 1z" />
                    </svg>
                  </div>
                </div>
                <input
                  type="text"
                  name="credit-expiry"
                  className="w-full rounded-md border border-gray-200 px-2 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="MM/YY"
                />
                <input
                  type="text"
                  name="credit-cvc"
                  className="w-1/6 flex-shrink-0 rounded-md border border-gray-200 px-2 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="CVC"
                />
              </div>
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">Total</p>
                <p className="text-2xl font-semibold text-gray-900">
                  &#8377;{totalAmount}
                </p>
              </div>
            </div>
            <button
              onClick={handleOrder}
              className="mt-4 mb-8 w-full rounded-md bg-gray-900 px-6 py-3 font-medium text-white"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
