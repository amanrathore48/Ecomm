import React from "react";

const SideCart = () => {
  return (
    <div
      ref={ref}
      className={`z-50 medium p-6 space-y-4 absolute top-24 right-0 bg-slate-100 transition-transform  duration-1000 rounded-md translate-x-full transform text-black`}
    >
      <h2 className="text-xl font-semibold">Your cart</h2>
      <span className="absolute top-5 right-6 text-[#D11732] cursor-pointer transition-transform text-4xl">
        <AiFillCloseSquare />
      </span>
      <ul className="flex flex-col divide-y divide-gray-700">
        {Object.keys(cart).length == 0 && (
          <div className="my-4 font-semibold text-xl">
            No items in cart{" "}
            <span className="text-red-600 font-bold ">Lets Explore</span>
          </div>
        )}

        {Object.keys(cart).map((k) => {
          return (
            <li
              key={k}
              className="flex flex-col py-6 sm:flex-row sm:justify-between"
            >
              <div className="flex w-full space-x-2 sm:space-x-4">
                <img
                  className="flex-shrink-0 object-cover w-20 h-20 border-transparent rounded outline-none sm:w-32 sm:h-32 bg-gray-500"
                  src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-1.2.1&amp;ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&amp;auto=format&amp;fit=crop&amp;w=1350&amp;q=80"
                  alt="Polaroid camera"
                />
                <div className="flex flex-col justify-between w-full pb-4">
                  <div className="flex justify-between w-full pb-2 space-x-2">
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold leading-snug sm:pr-8">
                        {cart[k].name}
                      </h3>
                      <p className="text-sm text-gray-400">{cart[k].variant}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">{cart[k].price}</p>
                    </div>
                  </div>
                  <div className="flex text-sm divide-x">
                    <button
                      type="button"
                      className="flex items-center px-2 py-1 pl-0 space-x-1"
                    >
                      <AiFillMinusSquare
                        size={24}
                        onClick={() =>
                          removeFromcart(
                            k,
                            1,
                            cart[k].price,
                            cart[k].name,
                            cart[k].size,
                            cart[k].variant
                          )
                        }
                      />

                      <span>{cart[k].qty}</span>
                      <AiFillPlusSquare
                        size={24}
                        onClick={() =>
                          addtocart(
                            k,
                            1,
                            cart[k].price,
                            cars[k].name,
                            cart[k].size,
                            cart[k].variant
                          )
                        }
                      />
                    </button>
                    <button
                      oncl
                      type="button"
                      className="flex items-center px-2 py-1 space-x-1 hover:bg-gray-200"
                    >
                      <VscDebugBreakpointLog size={20} />
                      <span>Remove Item</span>
                    </button>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="space-y-1 text-right">
        <p className="font-bold">
          Total amount: <span className="font-bold">{subTotal}</span>
        </p>
        <p className="text-sm text-gray-400">
          Not including taxes and shipping costs
        </p>
      </div>
      <div className="flex justify-end space-x-4">
        <button
          onClick={clear}
          type="button"
          className="px-6 py-2 border rounded-md border-[#D11732]"
        >
          <span className="text-sm">Clear Cart</span>
        </button>
        <Link href={"/checkout"}>
          <button
            type="button"
            className="px-6 py-2 border rounded-md bg-[#D11732] text-white border-[#D11732]"
          >
            <span className="text-sm">
              {" "}
              <BsCartCheckFill size={18} /> Checkout{" "}
            </span>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default SideCart;
