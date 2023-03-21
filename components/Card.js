import Link from "next/link";

const Card = ({ image, type, width, productInfo }) => {
  return (
    <>
      <div className="min-h-[20rem] bg-red flex justify-center items-center flex-row flex-wrap min-w-[14rem]">
        <div className=" p-6 bg-white rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all transform duration-500 flex-row  w-[95%]">
          <img
            className={`${width} h-56 object-top rounded-t-md`}
            src={image}
            alt=""
          />
          <div className="mt-4">
            <h1 className="text-2xl font-bold text-gray-700">
              {productInfo.name}
              <span class="uppercase text-xs bg-green-50 p-0.5 border-green-500 border rounded text-green-700 font-medium select-none">
                {type}
              </span>
            </h1>
            <p className="text-sm mt-2 text-gray-700">HackWear</p>
            <div className="mt-3 space-x-4 flex p-1">
              <div className="p-1 border-4 rounded-full cursor-pointer hover:border-green-200 hover:scale-105 transition transform duration-200">
                <span className="block h-6 w-6 bg-green-400 rounded-full">
                  {" "}
                </span>
              </div>
              <div className="p-1 border-4 rounded-full cursor-pointer hover:border-blue-200 hover:scale-105 transition transform duration-200">
                <span className="block h-6 w-6 bg-blue-400 rounded-full">
                  {" "}
                </span>
              </div>
              <div className="p-1 border-4 rounded-full cursor-pointer hover:border-yellow-200 hover:scale-105 transition transform duration-200">
                <span className="block h-6 w-6 bg-yellow-400 rounded-full">
                  {" "}
                </span>
              </div>
            </div>
            <div className="mt-4 mb-2 flex justify-between pl-4 pr-2">
              <button className="block text-xl font-semibold text-gray-700 cursor-auto">
                ₹12.99
              </button>
              <button className="text-lg block font-semibold py-2 px-6 text-green-100 hover:text-white bg-green-400 rounded-lg shadow hover:shadow-md transition duration-300">
                <Link href={"/product/id"}>Buy</Link>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;
