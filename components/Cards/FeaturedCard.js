import Link from "next/link";
import React from "react";

const SingleCard = ({ data }) => {
  return (
    <div className="w-full h-full relative">
      {" "}
      <div className="w-full flex flex-col gap-2">
        <h1 className="font-pango text-2xl font-semibold">{data.title}</h1>
        <img className=" object-contain" alt="" src={data.img}></img>
        <Link
          href={"/products"}
          className="absolute bottom-1 text-left text-sm mt-1 text-blue-700 font-medium"
        >
          Shop Now
        </Link>
      </div>
    </div>
  );
};
const QuadCard = ({ data }) => {
  return (
    <div className="w-full h-full relative ">
      <h1 className="font-pango text-2xl font-semibold">{data.title}</h1>
      <div className="flex flex-wrap  justify-evenly mt-2">
        {data.blocks.map((block, index) => (
          <div className="w-1/2">
            <img className="w-full p-1" src={block.img} alt="" />
            <p className="text-left text-xs font-pango p-1 ">{block.des}</p>
          </div>
        ))}
      </div>
      <Link
        href={"/products"}
        className="absolute bottom-1 text-left text-sm mt-1 text-blue-700 font-medium"
      >
        Explore
      </Link>
    </div>
  );
};

const FeaturedCard = ({ data }) => {
  return (
    <div className="w-[320px] min-w-[280px] h-[400px] mt-2 p-4 bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
      {data?.grid === 1 ? <SingleCard data={data} /> : null}
      {data?.grid === 4 ? <QuadCard data={data} /> : null}
    </div>
  );
};

export default FeaturedCard;
