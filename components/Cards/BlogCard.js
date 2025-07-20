import Link from "next/link";
import React from "react";

const BlogCard = () => {
  return (
    <section className="pt-10">
      <div className="relative  mx-auto bg-white bg-opacity-20 bg-cover bg-center w-[90%] md:w-[60%] rounded-md">
        <img
          className="absolute h-full w-full object-cover rounded-md"
          src="https://image.cnbcfm.com/api/v1/image/106963490-1634759952978-gettyimages-1308615771-dsc05921.jpeg?v=1634760396&w=1920&h=1080"
        />
        <div className="text-white lg:w-1/2">
          <div className="bg-zinc-900 bg-opacity-95 p-5 opacity-90 backdrop-blur-lg lg:p-12 rounded-l-md">
            <p className="mb-4 font-serif font-light">August 03, 2022</p>
            <h2 className="font-serif text-4xl font-bold">
              Best oragnic products for your hairs
            </h2>
            <Link
              href="/blogs"
              className="mt-6 inline-block rounded-xl border-2 px-10 py-3 font-semibold border-white hover:bg-white hover:text-zinc-900"
            >
              Read More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogCard;
