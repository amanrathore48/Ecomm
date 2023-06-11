import { AiFillEdit } from "react-icons/ai";
import { useRouter } from "next/router";
import { useState } from "react";

const Rows = ({ index, item }) => {
  const router = useRouter();
  const handleTrack = async () => {
    router.push(`/myorders/123`);
  };
  const handleDelete = async () => {};

  return (
    <>
      <tr className=" border-b">
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          {/* {index + 1} */} #{item._id}
        </td>
        <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
          {item.title}
        </td>
        <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
          Shipping
        </td>
        <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
          5 star
        </td>
        <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
          <button
            type="button"
            className="inline-block px-6 py-2.5 bg-zinc-900 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-zinc-600 hover:shadow-lg focus:bg-zinc-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-zinc-800 active:shadow-lg transition duration-150 ease-in-out mr-2"
            onClick={() => {
              handleTrack();
            }}
          >
            Track Order
          </button>
          {/* <button
            type="button"
            className="inline-block px-6 py-2.5 bg-green-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-green-600 hover:shadow-lg focus:bg-green-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-700 active:shadow-lg transition duration-150 ease-in-out mr-2"
            onClick={() => {
              handleUpdate();
            }}
          >
            Add Product
          </button> */}
          {/* <button
            type="button"
            className="inline-block px-6 py-2.5 bg-red-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out"
            onClick={() => {
              handleDelete();
            }}
          >
            cancel
          </button> */}
        </td>
      </tr>
    </>
  );
};

export default Rows;
