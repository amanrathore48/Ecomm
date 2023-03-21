import React from "react";

const FormLayout = ({ children }) => {
  return (
    <div className="flex h-full w-screen my-4 justify-center">
      <div className=" bg-slate-50 w-1/2 h-full rounded-md flex">
        <div className="hidden lg:flex rounded-md w-1/2 ">
          <div className="bg-herobg-1 rounded-md bg-cover bg-center w-full h-full">
            {" "}
          </div>
        </div>

        <div className="flex w-full lg:w-1/2 flex-col justify-evenly p-2">
          <div className="text-center">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default FormLayout;
