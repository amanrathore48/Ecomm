import React, { useState } from "react";
import { useRouter } from "next/router";
import { BsFillCartFill } from "react-icons/bs";
import { BiPurchaseTagAlt } from "react-icons/bi";
import Head from "next/head";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { allProducts } from "@/data";
import { useContext } from "react";
import { CartContext } from "@/Hooks/useCart";

const Product = ({ prod }) => {
  const { cart, addToCart, removeFromCart } = useContext(CartContext);
  const router = useRouter();
  const [pin, setpin] = useState();
  const [service, setservice] = useState();
  const [currSize, setCurrSize] = useState(prod.sizes[0]);
  const [currColor, setCurrColor] = useState(prod.colors[0]);

  const checkservice = async (pin) => {
    let pins = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
    let data = await pins.json();

    console.log("pin", data);
    if (data[0].Status === "Success") {
      setservice(true);
    } else {
      setservice(false);
    }
  };
  const handleAddToCart = async () => {
    const product = {
      id: prod._id,
      name: prod.name,
      img: prod.img,
      brand: prod.brand,
      discount: prod.discount,
      price: prod.price,
      quantity: 1,
      size: currSize,
      color: currColor,
    };
    await addToCart({ ...product });

    toast.success("Product Added!", {
      position: "bottom-left",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  return (
    <>
      <ToastContainer />
      <Head>
        <title>Ecomm. | {prod.name}</title>
      </Head>
      <div>
        <section className="text-gray-600 body-font overflow-hidden">
          <div className="container px-5 py-24 mx-auto">
            <div className="lg:w-4/5 mx-auto flex flex-wrap">
              <img
                alt="ecommerce"
                className="lg:w-1/2 w-full lg:h-auto px-24 object-contain object-center rounded"
                src={prod.img}
              />
              <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
                <h2 className="text-sm title-font text-gray-500 tracking-widest">
                  {prod.brand}
                </h2>
                <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
                  {prod.name}
                </h1>
                <div className="flex mb-4">
                  <span className="flex items-center">
                    <svg
                      fill="currentColor"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="w-4 h-4 text-[#D11732]"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                    </svg>
                    <svg
                      fill="currentColor"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="w-4 h-4 text-[#D11732]"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                    </svg>
                    <svg
                      fill="currentColor"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="w-4 h-4 text-[#D11732]"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                    </svg>
                    <svg
                      fill="currentColor"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="w-4 h-4 text-[#D11732]"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                    </svg>
                    <svg
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="w-4 h-4 text-[#D11732]"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                    </svg>
                    <span className="text-gray-600 ml-3">4 Reviews</span>
                  </span>
                  <span className="flex ml-3 pl-3 py-2 border-l-2 border-gray-200 space-x-2s">
                    <a className="text-gray-500">
                      <svg
                        fill="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                      >
                        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                      </svg>
                    </a>
                    <a className="text-gray-500">
                      <svg
                        fill="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                      >
                        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                      </svg>
                    </a>
                    <a className="text-gray-500">
                      <svg
                        fill="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                      >
                        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                      </svg>
                    </a>
                  </span>
                </div>
                <p className="leading-relaxed">{prod.des}</p>
                <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-100 mb-5">
                  <div className="flex gap-1">
                    <span className="mr-3">Color</span>
                    {prod.colors.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setCurrColor(color);
                        }}
                        style={{ backgroundColor: color }}
                        className="border-2 border-gray-300 rounded-full w-6 h-6 focus:outline-none"
                      ></button>
                    ))}
                  </div>
                  <div className="flex ml-6 items-center">
                    <span className="mr-3">Size</span>
                    <div className="relative">
                      <select
                        className="rounded border appearance-none border-gray-300 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-[#D11732] text-base pl-3 pr-10"
                        onChange={(event) => {
                          const selectedSize = event.target.value;
                          setCurrSize(selectedSize);
                        }}
                      >
                        {prod.sizes.map((size, index) => (
                          <option key={index}>{size}</option>
                        ))}
                      </select>
                      <span className="absolute right-0 top-0 h-full w-10 text-center text-gray-600 pointer-events-none flex items-center justify-center">
                        <svg
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                        >
                          <path d="M6 9l6 6 6-6"></path>
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex">
                  <span className="title-font font-medium text-2xl text-gray-900">
                    &#8377; {prod.price}
                  </span>
                  <button
                    onClick={() => {
                      router.push("/checkout");
                    }}
                    className="flex ml-14 text-white bg-[#D11732] border-0 py-2 px-6 focus:outline-none hover:bg-red-500 rounded"
                  >
                    Buy Now
                    <span className="ml-1 mt-1">
                      <BiPurchaseTagAlt size={19} />
                    </span>
                  </button>
                  <button
                    onClick={handleAddToCart}
                    className="flex ml-5 text-white bg-[#D11732] border-0 py-2 px-6 focus:outline-none md:text-sm hover:bg-red-500 rounded"
                  >
                    Add to Cart{" "}
                    <span className="ml-1 mt-1">
                      {" "}
                      <BsFillCartFill />{" "}
                    </span>
                  </button>
                  <button className="rounded-full w-10 h-10 bg-gray-200 p-0 border-0 inline-flex items-center justify-center text-gray-500 ml-4 hover:bg-pink-300 hover:text-pink-600">
                    <svg
                      fill="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
                    </svg>
                  </button>
                </div>
                <div className="flex justify-center items-center mt-7 h-15">
                  <input
                    type={"number"}
                    className="border-2 focus:outline-none rounded-md border-[#D11732] p-2 mt-3 text-black font-bold"
                    placeholder="Pincode"
                    onChange={(e) => setpin(e.target.value)}
                  />
                  <button
                    className="ml-2 text-white bg-[#D11732] border-0 py-2 px-6 focus:outline-none hover:bg-red-500 mt-3 rounded"
                    onClick={checkservice}
                  >
                    Check{" "}
                  </button>
                </div>
                {service && service != null && (
                  <div className="text-green-700 flex justify-center items-center font-bold text-sm mt-3">
                    Yay! , This pincode is serviceable
                  </div>
                )}
                {!service && service != null && (
                  <div className="text-red-700 flex justify-center items-center font-bold text-sm mt-3">
                    Sorry! , We do not deliver to this pincode yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Product;

export async function getServerSideProps({ params }) {
  const { prodId } = params;
  console.log(prodId);
  const prod = allProducts.find((obj) => obj._id === prodId);
  return {
    props: { prod },
  };
}
