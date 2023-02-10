import React from "react";

function NavIcon(
  icon,
  element,
  disabled = false
) {
  return (
    <div
      className={`text-white bg-gradient-to-r from-stone-400 via-stone-500 to-stone-600  font-medium rounded-lg text-lg px-4 sm:px-5 py-1 sm:py-2.5 text-center sm:mx-2 my-1 ${
        disabled
          ? "opacity-25"
          : "hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-stone-300 dark:focus:ring-stone-800"
      } `}
    >
      <div className=" flex flex-row">
        <div>{icon}</div>

        <div className="hidden sm:block ml-2">{element}</div>
      </div>
    </div>
  );
}

export default NavIcon;
