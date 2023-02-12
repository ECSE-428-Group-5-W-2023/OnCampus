import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignIn, faSignOut } from "@fortawesome/free-solid-svg-icons";

const LoginButton = () => {
  const { isAuthenticated } = useAuth0();
  const { loginWithRedirect, logout } = useAuth0();
  return (
    <div className="flex">
      {isAuthenticated ? (
        <button
          className={`w-full text-white bg-gradient-to-r from-stone-400 via-stone-500 to-stone-600  font-medium rounded-lg text-lg px-5 py-2.5 text-center mx-2 my-1
       "hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-stone-300 dark:focus:ring-stone-800"
     `}
          onClick={() => logout({ returnTo: window.location.origin })}
        >
          <div className=" flex flex-row">
            <FontAwesomeIcon icon={faSignOut} />
            <div className="hidden sm:block ml-2"> Log Out</div>
          </div>
        </button>
      ) : (
        <button
          className={`w-full text-white bg-gradient-to-r from-stone-400 via-stone-500 to-stone-600  font-medium rounded-lg text-lg px-5 py-2.5 text-center mx-2 my-1
        "hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-stone-300 dark:focus:ring-stone-800 "
     } `}
          onClick={() => loginWithRedirect()}
        >
          <div className=" flex flex-row">
            <FontAwesomeIcon icon={faSignIn} />
            <div className="hidden sm:block ml-2"> Log In</div>
          </div>
        </button>
      )}
    </div>
  );
};

export default LoginButton;
