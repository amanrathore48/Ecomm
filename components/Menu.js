import Link from "next/link";
import React from "react";

const Menu = () => {
  const menuLinks = [
    {
      title: "Electronics",
      links: ["Desktops", "Smartphones", "Laptops", "Televisions"],
      img: "http://mma.prnasia.com/media2/1597148/best_designed_flagship_killer_realme_gt_master_edition_series_launch_globally.jpg?p=medium600",
    },
    {
      title: "Accessories",
      links: ["Earphones", "Watches", "Headphones", "Sun Glasses"],
      img: "https://media.istockphoto.com/id/1052489966/photo/flat-lay-of-mens-accessories-with-shoes-watch-phone-earphones-sunglasses-scarf-over-the.jpg?s=170667a&w=0&k=20&c=PcKgv8VLyyGSuhUGDh8kfqgVk4WbwZEfGLR5jyPlCW4=",
    },
    {
      title: "Home appliances",
      links: [
        "Air Conditioners",
        "Refrigerators",
        "Microwaves",
        "Washing Machines",
      ],
      img: "https://img.freepik.com/free-vector/household-appliances-realistic-composition_1284-65307.jpg",
    },
  ];
  const men = ["Shirts", "Jeans", "Shoes", "Wallets"];
  const women = ["Shirts", "Jeans", "Footwears", "Perfumes"];
  const jewellery = ["Earrings", "Rings", "Necklace", "Bracelets"];
  const cat = [1, 2, 3, 4];
  return (
    <nav className="px-20 hidden lg:block">
      <div className="px-30 py-4">
        <ul className="flex items-center justify-evenly">
          <li className="">
            <Link
              href="/"
              className="group font-ubuntu font-semibold uppercase text-gray-700"
            >
              Home
              <span class="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-zinc-800"></span>
            </Link>
          </li>

          <li className="group">
            <Link
              href="/"
              className="group font-ubuntu font-semibold uppercase text-gray-700"
            >
              Categories
              <span class="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-zinc-800"></span>
            </Link>

            <div className="absolute mx-auto px-5 py-5 hidden group-hover:flex justify-between  bg-white z-50 gap-4 rounded-md transition duration-200 ease-in ">
              {menuLinks.map((data, index) => (
                <div key={index} className=" p-2">
                  <ul className="w-64 ">
                    <li className="">
                      <b>
                        <Link
                          className="p-2 flex font-monster text-2xl font-semibold items-center"
                          href="#"
                        >
                          {data.title}
                        </Link>
                      </b>
                    </li>

                    {data.links.map((links, index) => (
                      <div key={index}>
                        <li className="">
                          <Link
                            className="text-zinc-700 font-pango flex p-2"
                            href="#"
                          >
                            {links}
                          </Link>
                        </li>
                      </div>
                    ))}
                    <li className="w-full h-[150px] overflow-hidden">
                      <img
                        className="object-cover rounded-md"
                        src={data.img}
                        alt=""
                        width="250"
                        height="100"
                      />
                    </li>
                  </ul>
                </div>
              ))}
            </div>
          </li>

          <li className="group">
            <Link
              href="#"
              className="group font-ubuntu font-semibold uppercase text-gray-700"
            >
              Men's
              <span class="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-zinc-800"></span>
            </Link>

            <ul className="hidden group-hover:flex flex-col bg-white px-4 py-4 gap-2 rounded-md absolute z-50">
              {men.map((name, index) => (
                <li
                  key={index}
                  className="text-gray-700 font-pango py-1 px-4 text-md capitalize"
                >
                  <Link href="#">{name}</Link>
                </li>
              ))}
            </ul>
          </li>

          <li className="group">
            <Link
              href="#"
              className="font-ubuntu font-semibold uppercase text-gray-700"
            >
              Women's
              <span class="group block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-zinc-800"></span>
            </Link>

            <ul className="hidden group-hover:flex flex-col bg-white px-4 py-4 gap-2 rounded-md absolute z-50">
              {women.map((name, index) => (
                <li
                  key={index}
                  className="text-gray-700 font-pango py-1 px-4 text-md capitalize"
                >
                  <Link href="#">{name}</Link>
                </li>
              ))}
            </ul>
          </li>

          <li className="group">
            <Link
              href="#"
              className="group font-ubuntu font-semibold uppercase text-gray-700"
            >
              Jewellery
              <span class="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-zinc-800"></span>
            </Link>

            <ul className="hidden group-hover:flex flex-col bg-white px-4 py-4 gap-2 rounded-md absolute z-50">
              {jewellery.map((name, index) => (
                <li
                  key={index}
                  className="text-gray-700 font-pango py-1 px-4 text-md capitalize"
                >
                  <Link href="#">{name}</Link>
                </li>
              ))}
            </ul>
          </li>

          <li className="">
            <Link
              href="/blogs"
              className="group font-ubuntu font-semibold uppercase text-gray-700"
            >
              Blog
              <span class="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-zinc-800"></span>
            </Link>
          </li>

          <li className="">
            <Link
              href="/products"
              className="group font-ubuntu font-semibold uppercase text-gray-700"
            >
              Offers
              <span class="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-zinc-800"></span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Menu;
