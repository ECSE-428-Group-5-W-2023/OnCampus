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


  //Link for the delete button inside of frontend: https://github.com/ECSE-428-Group-5-W-2023/OnCampus/commit/78b0addd19136d0ce2df47776a1ab25dcd9d56bc
  //Link for the frontend displaying all the events: https://github.com/ECSE-428-Group-5-W-2023/OnCampus/tree/78b0addd19136d0ce2df47776a1ab25dcd9d56bc

  //need a method that is called when Accept is pressed 
    // ->This will take the two id's from the database row
    // ->create a friendship between the two ids 
    // ->delete the friend request 
    // ->delete the front end 

  //need a method that is called when Decline is pressed 
    // ->This will just delete the friend request and nothing more 



};

export default Friendship;