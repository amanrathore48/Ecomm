import Filter from "@/components/Accordions/Filter";
import { allProducts } from "@/data";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";

const products = () => {
  const router = useRouter();
  return (
    <section className=" bg-gray-100 flex">
      <div className="hidden lg:flex flex-col p-4 w-[18%] ml-1 bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
        <h1 className="text-zinc-800 font-md font-semibold text-2xl text-center font-pango">
          Filter By
        </h1>
        <Filter />
      </div>
      <div className="w-[80%] my-10 mx-auto grid max-w-6xl  grid-cols-1 gap-6 p-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {allProducts.map((product, index) => (
          <article className="rounded-xl bg-white p-3 shadow-lg hover:shadow-xl hover:transform hover:scale-105 duration-300 h-[280px] flex flex-col">
            <Link href={`/products/${product._id}`}>
              <div className="relative h-[150px] flex items-end overflow-hidden rounded-xl">
                <img
                  className="object-contain w-full h-full"
                  src={product.img}
                  alt="Hotel Photo"
                />
              </div>
            </Link>
            <div className="mt-1 p-2">
              <h2 className="text-slate-700">{product.name}</h2>
              <p className="mt-1 text-sm text-slate-400">{product.brand}</p>
            </div>
            <div className="flex items-end justify-between">
              <p className="text-lg font-bold text-blue-500">
                &#8377; {product.price}
              </p>

              <div className="flex items-center space-x-1.5 rounded-lg bg-blue-500 px-4 py-1.5 text-white duration-100 hover:bg-blue-600">
                <AiOutlineShoppingCart />
                <button
                  onClick={() => {
                    router.push(`/cart`);
                  }}
                  className="text-sm"
                >
                  Add to cart
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default products;
