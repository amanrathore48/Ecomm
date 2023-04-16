import Link from "next/link";
import React from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";

const ProdCard1 = ({ product }) => {
  return (
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
        <h2 className="text-slate-700">{product.title}</h2>
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
  );
};

export default ProdCard1;
