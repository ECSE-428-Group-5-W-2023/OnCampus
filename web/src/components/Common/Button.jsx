import React from "react";

const Button = ({ onClick, className, selected, children }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 font-bold text-white  rounded-md shadow-lg hover:bg-stone-600  ${
        selected ? "bg-stone-600" : "bg-stone-400"
      } focus:outline-none focus:shadow-outline ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
