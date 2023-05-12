import React from "react";
import Head from "next/head";
import { getBuyerOrders, getOrders } from "@/helpers/useOrder";
import { getSession, useSession } from "next-auth/react";

export default Orders = ({ allOrders }) => {
  const { data: session } = useSession();
  return (
    <div>
      <Head>
        <title>Ecomm. | Order</title>
      </Head>
      <section className="text-gray-600 body-font overflow-hidden">
        <div className="container px-5 py-24 mx-auto">
          <div className="lg:w-4/5 mx-auto flex flex-wrap">
            <div className="lg:w-1/2 w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0">
              <h2 className="text-sm title-font text-gray-500 tracking-widest">
                Don't Worry We'll deliver your order asap!
              </h2>

              {allOrders &&
                allOrders.map((order, index) => (
                  <h1 className="text-gray-900 text-3xl title-font font-medium mb-4">
                    OrderId : {order._id}
                  </h1>
                ))}

              <p className="leading-relaxed mb-4">
                Your Order Successfully Placed{" "}
              </p>
              <div className="flex mb-4">
                <a className="flex-grow border-b-2 border-gray-300 py-2 pr-[6.5rem] text-lg px-1">
                  Item Description
                </a>
                <a className="flex-grow border-b-2 border-gray-300 py-2 text-lg px-1">
                  Quantity
                </a>
                <a className="flex-grow border-b-2 border-gray-300 py-2 text-lg px-1">
                  Item Total
                </a>
              </div>
              {allOrders &&
                allOrders[0].cartItems?.map((item, index) => (
                  <div className="flex border-t border-gray-200 py-2">
                    <span className="text-gray-500">{item.title}</span>
                    <span className="ml-auto text-gray-900">
                      {item.quantity}
                    </span>
                    <span className="ml-auto text-gray-900">{item.price}</span>
                  </div>
                ))}

              <div className="flex">
                <span className="title-font font-medium text-2xl text-gray-900">
                  $58.00
                </span>
                <button className="flex ml-auto text-white bg-[#D11732] border-0 py-2 px-6 focus:outline-none hover:bg-black rounded">
                  Track Order
                </button>
              </div>
            </div>
            <img
              alt="ecommerce"
              className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded"
              src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1350&q=80"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export async function getServerSideProps({ req }) {
  const session = await getSession({ req });
  let allOrders;
  if (session) {
    allOrders = await getBuyerOrders(session.user.id);
    console.log("ordersss", allOrders);
  }

  if (!session) {
    return {
      props: {},
    };
  }

  return {
    props: { allOrders },
  };
}
