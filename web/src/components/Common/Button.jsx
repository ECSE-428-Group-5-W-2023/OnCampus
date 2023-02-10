import React from "react";

const Button = ({ onClick, className, children }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 font-bold text-white bg-stone-400 rounded-md shadow-lg hover:bg-stone-600 focus:outline-none focus:shadow-outline ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
