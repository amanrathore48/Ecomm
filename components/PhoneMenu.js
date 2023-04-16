import { CartContext } from "@/stores/useCart";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import {
  AiOutlineBars,
  AiOutlineHeart,
  AiOutlineHome,
  AiOutlineRead,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { BsGrid, BsShop } from "react-icons/bs";
import { FaBookReader, FaBoxOpen } from "react-icons/fa";

const PhoneMenu = () => {
  const { data: session, status } = useSession();
  const { totalAmount, totalQuantity } = useContext(CartContext);
  const [isMenu, setIsMenu] = useState(false);
  const router = useRouter();

  return (
    <>
      <div
        class={`hidden max-lg:flex justify-between py-4 px-4  gap-4 bg-white max-sm:w-[100%] w-[80%] fixed bottom-0 left-1/2 transform -translate-x-1/2 z-50
        ${!isMenu && "rounded-t-md"}
      `}
      >
        <Link href="/">
          <AiOutlineBars className="w-8 h-8" />
        </Link>

        <Link href="/cart" className="outline-none flex text-gray-600 relative">
          <AiOutlineShoppingCart className="h-8 w-8" />
          <span className="font-pango absolute -top-1 -right-1 bg-red-600 text-white rounded-full h-4 w-4 flex items-center justify-center text-xs ">
            {totalQuantity}
          </span>
        </Link>

        <Link href="/">
          <AiOutlineHome className="w-8 h-8" />
        </Link>

        <Link href="/wishlist">
          <AiOutlineHeart className="w-8 h-8" />
        </Link>

        <button
          onClick={() => {
            setIsMenu(!isMenu);
          }}
        >
          <BsGrid className="w-8 h-8" />
        </button>
        <div
          className={`absolute left-0 bottom-[60px] z-50 h-max bg-slate-200 w-full rounded-t-sm ${
            !isMenu && "hidden"
          }`}
        >
          <ul className="flex gap-4 justify-around flex-wrap p-8">
            <li
              onClick={() => {
                router.push("/products");
                setIsMenu(false);
              }}
              className="flex flex-col items-center p-5 rounded-md bg-white gap-2"
            >
              <BsShop className="w-10 h-10" />
              <label className="text-zinc-800 w-16 text-center">Products</label>
            </li>

            <li
              onClick={() => {
                router.push("/blogs");
                setIsMenu(false);
              }}
              className="flex flex-col items-center p-5 rounded-md bg-white gap-2"
            >
              <AiOutlineRead className="w-10 h-10" />
              <label className="text-zinc-800 w-16 text-center">Blogs</label>
            </li>
            {status === "authenticated" && (
              <li
                onClick={() => {
                  router.push("/myorders");
                  setIsMenu(false);
                }}
                className="flex flex-col items-center p-5 rounded-md bg-white gap-2"
              >
                <FaBoxOpen className="w-10 h-10" />
                <label className="text-zinc-800 w-16 text-center">Orders</label>
              </li>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default PhoneMenu;
