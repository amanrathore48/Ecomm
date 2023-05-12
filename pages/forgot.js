import Link from "next/link";
import React from "react";

const Forgot = () => {
  return (
    <div>
      <div className="bg-grey-lighter min-h-screen flex flex-col">
        <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
          <span>
            <h4 className="text-xl font-bold mt-1 mb-12 pb-1 text-red-600">
              Ecomm.
            </h4>
          </span>
          <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
            <h1 className="mb-8 text-3xl text-center font-bold">
              Forgot Password
            </h1>
            <input
              type="email"
              className="block border border-grey-light w-full p-3 rounded mb-4 focus:outline-red-600"
              name="email"
              placeholder="Email"
            />

            <button
              type="submit"
              className="w-full text-center py-3 rounded bg-black text-white hover:bg-green-dark focus:outline-none my-1"
            >
              Continue
            </button>

            <div className="text-center text-sm text-grey-dark mt-4">
              By signing up, you agree to the
              <a
                className="no-underline border-b border-grey-dark text-grey-dark"
                href="#"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                className="no-underline border-b border-grey-dark text-grey-dark"
                href="#"
              >
                Privacy Policy
              </a>
            </div>
          </div>

          <div className="text-grey-dark mt-6">
            Remebered Password?
            <Link
              className="no-underline text-red-600 ml-3 font-semibold hover:border-b-2 border-red-600"
              href={"/login"}
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forgot;
