import React from "react";
import Link from "next/link";
import { FaFacebookSquare } from "react-icons/fa";
import { AiFillYoutube, AiOutlineInstagram } from "react-icons/ai";
import { BsTwitter } from "react-icons/bs";

const Footer = () => {
  return (
    <footer className="bg-black text-gray-200 ">
      <div className="px-5 py-10 mx-auto block border-b border-b-zinc-700 border-1">
        <div className="flex flex-wrap md:text-left text-center order-first">
          <div className="lg:w-1/4 lg:mb-0 lg:border-none pb-1 mb-2 border-b border-1 border-zinc-700 w-full px-4">
            <div className=" flex justify-between items-start">
              <div className="lg:hidden max-[640px]:hidden  w-1/2 font-monster flex flex-col justify-between gap-2 ">
                <div>
                  <p className="text-left">
                    Hello Lorem ipsum dolor sit amet consectetur adipisicing
                    elit. Fuga eaque voluptatibus quisquam? Iusto ut quia
                    voluptatum atque tenetur. Fugit, quod.
                  </p>
                </div>

                <div className="flex gap-4 items-center justify-start mt-2 py-2  ">
                  <FaFacebookSquare className="w-8 h-8" />
                  <AiOutlineInstagram className="w-8 h-8" />
                  <BsTwitter className="w-8 h-8" />
                  <AiFillYoutube className="w-8 h-8" />
                </div>
              </div>
              <div className="flex max-[640px]:w-full flex-col max-[640px]:items-center max-[640px]:mb-2">
                <div className="w-24 h-24 ">
                  <img
                    className="object-contain rounded-lg"
                    alt="logo"
                    src="/ecomm.png"
                  />
                </div>
                <div className="w-32  mt-2">
                  <span className="font-pango font-semibold text-2xl lg:text-left text-right">
                    Ecomm.
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:w-1/4 md:w-1/3 w-full px-4">
            <h2 className="title-font font-medium tracking-widest text-sm mb-3">
              SHOP
            </h2>
            <nav className="list-none mb-10">
              <Link href={"/products"}>
                <li className="cursor-pointer">Electronics</li>
              </Link>
              <Link href={"/products"}>
                <li className=" cursor-pointer ">Men</li>
              </Link>
              <Link href={"/products"}>
                <li className=" cursor-pointer ">Women</li>
              </Link>
              <Link href={"/products"}>
                <li className=" cursor-pointer ">Top Deals</li>
              </Link>
            </nav>
          </div>
          <div className="lg:w-1/4 md:w-1/3 w-full px-4">
            <h2 className="title-font font-medium tracking-widest text-sm mb-3">
              CUSTOMER SERVICE
            </h2>
            <nav className="list-none mb-10">
              <Link href={"/contact"}>
                <li className=" cursor-pointer ">Contact Us</li>
              </Link>
              <Link href={"/about"}>
                <li className="cursor-pointer ">About Us</li>
              </Link>
            </nav>
          </div>
          <div className="lg:w-1/4 md:w-1/3 w-full px-4">
            <h2 className="title-font font-medium tracking-widest text-sm mb-3">
              POLICY
            </h2>
            <nav className="list-none mb-10">
              <Link href={"/privacy"}>
                <li className=" cursor-pointer ">Privacy Policy</li>
              </Link>
              <Link href={"/terms"}>
                <li className=" cursor-pointer ">Terms and Condition</li>
              </Link>
              <Link href={"/refund"}>
                <li className="cursor-pointer ">Refund Policy</li>
              </Link>
            </nav>
          </div>
        </div>
      </div>
      <div className="bg-black">
        <div className="container px-5 py-4 mx-auto flex items-center justify-center">
          <p className="text-sm text-gray-200 sm:ml-6 sm:mt-0 mt-4">
            Copyright © 2022 Ecomm.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
