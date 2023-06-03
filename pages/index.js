import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import TopCat from "@/components/TopCat";
import ProHorizonatl from "@/components/Cards/ProHorizonatl";
import HomeFeatures from "@/components/HomeFeatures";
import { useState } from "react";
import { Swiper, SwiperSlide } from "../config/swiperConfig";
import Menu from "@/components/Menu";
import { getSession } from "next-auth/react";
import FeaturedCard from "@/components/Cards/FeaturedCard";
import { f1, f2 } from "../data";
import TodaysDeals from "@/components/Cards/TodaysDeals";
import { useRouter } from "next/router";
import BlogCard from "@/components/Cards/BlogCard";

export default function Home({ session }) {
  const router = useRouter();
  const [phrase, setPhrase] = useState("");

  const heroImages = [1, 2, 3, 4];

  if (phrase) {
    const setProd = async () => {
      const tempProducts = await products.filter((p) =>
        p.name.toLowerCase().includes(phrase)
      );
    };
    setProd();
  }

  console.log("session Home", session);
  console.log("server", process.env.SERVER);

  return (
    <>
      <Head>
        <title>Ecomm. - Shopping made easier</title>
      </Head>

      <div>
        <Menu />
        <div className={` w-[100%] mx-auto`}>
          <Swiper
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000 }}
            loop
            className="mySwiper"
          >
            {heroImages.map((index) => (
              <SwiperSlide
                key={index}
                className="w-full px-4 lg:px-20 mt-4 lg:mt-0"
              >
                <div className="relative rounded-md h-[32rem] w-full bg-herobg-1 bg-center bg-cover ">
                  <div className="absolute left-10 bottom-10 text-gray-200 flex flex-col gap-2">
                    <h4 className="font-pango text-4xl font-semibold ">
                      Trending Items
                    </h4>
                    <h2 className="font-pango text-2xl font-semibold ">
                      Super Value Deals
                    </h2>
                    <h1 className="font-pango text-2xl font-semibold ">
                      On All Products
                    </h1>
                    <p className="font-pango text-lg  ">
                      Save more with coupons & upto 30% off!
                    </p>
                    <button
                      onClick={() => router.push("/products")}
                      className=" w-max bg-slate-200 rounded-md font-pango text-4xl font-semibold mt-2 text-zinc-800 px-2"
                    >
                      Shop Now
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      <div className="w-full px-4 lg:px-20 mt-4 lg:mt-2 flex gap-1 justify-evenly flex-wrap">
        {f1.map((data, index) => (
          <FeaturedCard key={index} data={data} />
        ))}
      </div>
      <TodaysDeals />
      <div className="w-full px-4 lg:px-20 mt-4 lg:mt-2 flex gap-1 justify-evenly flex-wrap">
        {f2.map((data, index) => (
          <FeaturedCard key={index} data={data} />
        ))}
      </div>
      <BlogCard />
      {/* <TopCat products={products} /> */}
      <HomeFeatures />
    </>
  );
}

export async function getServerSideProps({ req }) {
  const session = await getSession({ req });

  if (!session) {
    return {
      props: {},
    };
  }
  // authorize user return session
  return {
    props: { session },
  };
}
