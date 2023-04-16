import React, { useState } from "react";

const Filter = () => {
  const [activeItem, setActiveItem] = useState("Categories");

  // Function to toggle an accordion item
  const toggleAccordion = (item) => {
    setActiveItem(activeItem === item ? null : item);
  };
  const items = [
    {
      title: "Categories",
      filters: ["Shirt", "Pant", "Shoes"],
    },
    {
      title: "Gender",
      filters: ["Men", "Women", "Girl", "Boy"],
    },
    {
      title: "Price",
      filters: ["100-999", "1000-1999", "2000-4999"],
    },
  ];
  return (
    <div className="mt-4">
      {items.map((item, index, array) => (
        <div className="rounded-t-lg border border-neutral-200 bg-white dark:border-white dark:bg-white">
          <h2 className="mb-0" id="headingOne">
            <button
              className={`
            ${
              activeItem === item.title
                ? `dark:bg-white bg-white dark:text-zinc-800 text-zinc-700 text-primary [box-shadow:inset_0_-1px_0_rgba(75,85,99)]`
                : `dark:bg-neutral-800 bg-neutral-800 dark:text-white text-primary-400 [box-shadow:inset_0_-1px_0_rgba(229,231,235)]`
            }
            group relative flex w-full items-center border-0  py-4 px-5 text-left text-base  transition [overflow-anchor:none] hover:z-[2] focus:z-[3] focus:outline-none`}
              type="button"
              data-te-collapse-init
              data-te-target="collapse"
              aria-expanded="true"
              aria-controls="collapse"
            >
              {item.title}
              <span
                className={`
            ${
              activeItem === item.title
                ? "-mr-1 rotate-[-180deg] fill-[#336dec] "
                : "rotate-0 mr-0 fill-[#212529]  dark:fill-white motion-reduce:transition-none"
            }
            ml-auto  h-5 w-5 shrink-0  transition-transform duration-200 ease-in-out dark:fill-blue-300 `}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                  onClick={() => toggleAccordion(item.title)}
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </span>
            </button>
          </h2>
          <div
            id="collapse"
            className={`${activeItem === item.title ? "visible" : "hidden"}`}
            data-te-collapse-item
            data-te-collapse-show
            aria-labelledby="headingOne"
          >
            <div className="py-4 px-5">
              <ul className="flex flex-col gap-2">
                {item.filters.map((filter, index, array) => (
                  <>
                    <li
                      className={` ${
                        index === array.length - 1 ? "" : "border-b"
                      } w-full  border-gray-200 `}
                    >
                      <div className="flex items-center pl-3">
                        <input
                          id="vue-checkbox"
                          type="checkbox"
                          value=""
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                        />
                        <label
                          for="vue-checkbox"
                          className="w-full py-3 ml-2 text-sm font-medium text-gray-900"
                        >
                          {filter}
                        </label>
                      </div>
                    </li>
                  </>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Filter;
