import Filter from "@/components/Accordions/Filter";
import ProdCard2 from "@/components/Cards/prodCards/ProdCard2";
import ProdCard3 from "@/components/Cards/prodCards/ProdCard3";
import ProdCard1 from "@/components/Cards/prodCards/ProdCard1";
import { getProducts } from "@/helpers/useProd";
import { all } from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { ToastContainer } from "react-toastify";
import Head from "next/head";

const Products = ({ allProducts }) => {
  const router = useRouter();
  return (
    <>
      <ToastContainer />
      <Head>
        <title>Ecomm. | Products</title>
      </Head>
      <section className=" bg-gray-100 flex justify-center md:justify-between">
        <div className="hidden lg:flex flex-col p-4 w-[18%] ml-1 bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
          <h1 className="text-zinc-800 font-md font-semibold text-2xl text-center font-pango">
            Filter By
          </h1>
          <Filter />
        </div>
        <div className="w-full py-10 p-2 grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 justify-items-center">
          {allProducts.map((product, index) => (
            <>{product && <ProdCard3 key={product?.id} product={product} />}</>
          ))}
        </div>
      </section>
    </>
  );
};

export default Products;

export async function getServerSideProps({ query }) {
  const searchQuery = query.search || "";
  const allProducts = await getProducts();

  // Filter products by search query
  const filteredProducts = allProducts.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    props: { allProducts: filteredProducts },
  };
}
