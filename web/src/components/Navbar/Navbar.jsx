import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";
import UserProfile from "../Auth/AuthInfo";
import LoginButton from "../Auth/Login";
import NavIcon from "./NavIcon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import React from "react";
export default function Navbar() {
  const { isAuthenticated, isLoading } = useAuth0();

  return (
    <div className="flex flex-row sm:flex-col justify-between my-1 sm:my-3 sm:ml-3 sm:py-1 sm:bg-gray-700 rounded-lg sm:w-60">
      <Link to={"/"}>
        <div className="mx-2 my-1">
          <img
            src={require("../../images/Logo.png")}
            className="sm:hidden h-12"
            alt="OnCampus"
          />
          <img
            src={require("../../images/logo-large.png")}
            className="hidden sm:block w-fit"
            alt="OnCampus"
          />
        </div>
      </Link>
      <Link to={"schedule"}>
        {NavIcon(
          <FontAwesomeIcon icon={faCalendar} />,
          "Schedule",
          !isAuthenticated
        )}
      </Link>

      <div className="sm:mt-auto">
      <Link to={"account"}>
        {!isLoading && isAuthenticated && (
          <div className="hidden sm:block sm:text-white sm:outline outline-gray-800 outline- font-medium rounded-lg text-lg sm:px-3 py-1.5 text-center sm:mx-3 sm:my-2">
            <UserProfile />
          </div>
        )}
        <LoginButton />
      </Link>
      </div>
    </div>
  );
}
