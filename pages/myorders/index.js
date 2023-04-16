import React from "react";
import Head from "next/head";
import { getBuyerOrders, getOrders } from "@/helpers/useOrder";
import { getSession, useSession } from "next-auth/react";
import Rows from "@/components/Rows";

const orders = ({ allOrders }) => {
  const { data: session } = useSession();
  return (
    <div>
      <Head>
        <title>Ecomm. | Order</title>
      </Head>
      <section className="text-gray-600 body-font overflow-hidden ">
        <div className="flex flex-col">
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-4 inline-block min-w-full sm:px-6 lg:px-8">
              <div className="overflow-hidden lg:p-10 xl:p-20">
                <table className="min-w-full text-center ">
                  <thead className="border-b bg-zinc-800">
                    <tr>
                      <th
                        scope="col"
                        className="text-sm font-medium text-white px-6 py-4"
                      >
                        Order Id
                      </th>
                      <th
                        scope="col"
                        className="text-sm font-medium text-white px-6 py-4"
                      >
                        Product
                      </th>
                      <th
                        scope="col"
                        className="text-sm font-medium text-white px-6 py-4"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="text-sm font-medium text-white px-6 py-4"
                      >
                        Review
                      </th>
                      <th
                        scope="col"
                        className="text-sm font-medium text-white px-6 py-4"
                      >
                        Edit
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allOrders &&
                      allOrders.map((items, index) =>
                        items?.cartItems.map((item, index) => (
                          <Rows index={index} item={item} />
                        ))
                      )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default orders;

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
