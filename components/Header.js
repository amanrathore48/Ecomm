import { CartContext } from "@/stores/useCart";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import {
  AiFillYoutube,
  AiOutlineBars,
  AiOutlineHeart,
  AiOutlineHome,
  AiOutlineInstagram,
  AiOutlineShoppingCart,
  AiOutlineUser,
  AiOutlineUserAdd,
} from "react-icons/ai";
import { BiLogIn } from "react-icons/bi";
import { BsFillHandbagFill, BsGrid, BsSearch, BsTwitter } from "react-icons/bs";
import { FaFacebookSquare, FaTwitterSquare, FaUserPlus } from "react-icons/fa";

const Header = () => {
  const { status } = useSession();
  const { totalAmount, totalQuantity } = useContext(CartContext);
  const [isUserMenu, setIsUserMenu] = useState(false);
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (e.target.value.length >= 3) {
      router.push(`/products?search=${e.target.value}`);
    } else {
      router.push("/products");
    }
  };
  return (
    <header>
      <div className="px-4 py-2 block border-b border-gray-200 border-1">
        <div className="w-full flex justify-between items-center">
          <ul className="w-full flex items-center gap-2 text-zinc-700">
            <FaFacebookSquare className="w-6 h-6" />
            <AiOutlineInstagram className="w-6 h-6" />
            <BsTwitter className="w-6 h-6" />
            <AiFillYoutube className="w-6 h-6" />
          </ul>

          <div className="block w-full font-pango text-sm max-sm:hidden">
            <p>
              <b>30% Off! </b>
              On the first order
            </p>
          </div>

          <div className="flex items-center gap-4">
            <select className="border-none block min-w-[60px] py-2 px-0 font-inherit text-sm text-gray-500 uppercase cursor-pointer transition duration-200 ease-in  outline-none">
              <option value="usd">INR &#x20B9;</option>
              <option value="usd">USD $</option>
              <option value="eur">EUR &euro;</option>
            </select>

            <select className="border-none block min-w-[80px] py-2 px-0 font-inherit text-sm text-gray-500 uppercase cursor-pointer transition duration-200 ease-in  outline-none">
              <option value="en-US">English</option>
              <option value="es-ES">Espa&ntilde;ol</option>
              <option value="fr">Fran&ccedil;ais</option>
            </select>
          </div>
        </div>
      </div>

      <div className=" border-b border-gray-200 border-1 lg:px-20 px-4">
        <div className="flex items-center justify-between py-5 gap-10 max-sm:gap-2 ">
          <Link
            href={"/"}
            className="w-max flex title-font font-medium  text-gray-900 items-center"
          >
            <span className="ml-3 text-xl">Ecomm.</span>
          </Link>

          <div class="relative w-full">
            <input
              type="search"
              name="search"
              className="w-full px-4 py-2 border-2 border-gray-100 rounded-md outline-none pl-10 max-sm:pl-0 font-pango"
              placeholder="Search.. "
              onChange={(e) => handleSearch(e)}
            />
            <button class="absolute top-0 right-0 h-full w-10 text-gray-600">
              <BsSearch class="h-6 w-6" />
            </button>
          </div>

          <div className="flex gap-4 w-max items-center justify-end max-lg:hidden">
            <Link href="/wishlist" className="">
              <AiOutlineHeart className="h-8 w-8 text-gray-600" />
            </Link>

            <Link
              href="/cart"
              className="outline-none flex text-gray-600 relative"
            >
              <AiOutlineShoppingCart className="h-8 w-8" />
              <span className="font-pango absolute -top-1 -right-1 bg-red-600 text-white rounded-full h-4 w-4 flex items-center justify-center text-xs ">
                {totalQuantity}
              </span>
            </Link>
          </div>

          <div
            onClick={async () => {
              setIsUserMenu(!isUserMenu);
            }}
            className="relative"
          >
            <AiOutlineUser className="h-8 w-8 text-gray-600 cursor-pointer" />
            {isUserMenu ? (
              <div className="flex flex-col items-center absolute rounded-md px-4 py-4 z-50 top-[42px] right-[10px] w-36 h-max bg-gray-200 text-zinc-800 gap-2 font-monster font-semibold ">
                {status === "unauthenticated" || status === "loading" ? (
                  <>
                    <Link
                      href="/login"
                      className=" w-[98%] bg-white flex justify-center items-center rounded-md py-1 gap-2 cursor-pointer"
                    >
                      <BiLogIn className="w-6 h-6" />
                      <div>LogIn</div>
                    </Link>
                    <Link
                      href="signup"
                      className=" w-[98%] bg-white flex justify-center items-center rounded-md py-1 gap-2 cursor-pointer"
                    >
                      <AiOutlineUserAdd className="w-6 h-6" />
                      <div>SignUp</div>
                    </Link>
                  </>
                ) : (
                  <div
                    onClick={() => {
                      signOut();
                    }}
                    className=" w-[98%] bg-white flex justify-center items-center rounded-md py-1 gap-2 cursor-pointer"
                  >
                    <BiLogIn className="w-6 h-6" />
                    <div>LogOut</div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
