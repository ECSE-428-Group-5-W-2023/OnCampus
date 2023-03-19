import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from "react";
import * as React from "react";
import Api from "../../helpers/api";
import Button from "../Common/Button";
import Popup from "../Common/Popup";

const Friendship = () => {
  const api = new Api();

  return (
    <div>
    <h1 className="text-white">Here are your friend requests!</h1>
    </div>
  );

};

export default Friendship;
