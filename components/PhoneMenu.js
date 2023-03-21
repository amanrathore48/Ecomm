import Link from "next/link";
import React from "react";
import {
  AiOutlineBars,
  AiOutlineHeart,
  AiOutlineHome,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { BsGrid } from "react-icons/bs";

const PhoneMenu = () => {
  return (
    <div class="hidden max-lg:flex justify-between py-4 px-4 rounded-t-md gap-4 bg-white max-sm:w-[100%] w-[80%] fixed bottom-0 left-1/2 transform -translate-x-1/2 z-50">
      <Link href="/">
        <AiOutlineBars className="w-8 h-8" />
      </Link>

      <Link href="/cart">
        <AiOutlineShoppingCart className="w-8 h-8" />
      </Link>

      <Link href="/">
        <AiOutlineHome className="w-8 h-8" />
      </Link>

      <Link href="/wishlist">
        <AiOutlineHeart className="w-8 h-8" />
      </Link>

      <Link href="">
        <BsGrid className="w-8 h-8" />
      </Link>
    </div>
  );
};

export default PhoneMenu;
