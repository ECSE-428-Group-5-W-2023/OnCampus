import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from "react";
import * as React from "react";
import Api from "../../helpers/api";
import Button from "../Common/Button";
import Popup from "../Common/Popup";

const Friendrequests= () => {
  const [requests, setRequests] = useState([]);
  const { getAccessTokenSilently } = useAuth0();
  const [userProfileFriend, setUserProfileFriend] = useState(null);
  const [usernameFriend, setUsernameFriend] = useState("");


  const api = new Api();

  useEffect(() => {
    try {
      getAllFriendRequests();
    } catch (err) {
      console.log("error" + err);
    }
  }, []);

  useEffect(() => {
    try {
      getFriendInformation(usernameFriend);
    } catch (err) {
      console.log("error" + err);
    }
  }, []);


  
  async function getAllFriendRequests() {
    await api.getFriendRequests(await getAccessTokenSilently()).then((res) => {
      setRequests(res.friendRequests);
    });
  }


  async function getFriendInformation(usernameFriend) {
    console.log("Getting friend");
    try {
      api
        .getFriendInformation(await getAccessTokenSilently(), usernameFriend)
        .then((res) => {
          console.log("hi"); 
          setUserProfileFriend(res.data.profileFriend[0]);
          console.log(res.data.profileFriend[0]);
        });
    } catch (err) {
      console.log("error" + err);
    }
  }

  async function declineFriendRequest(id) {

    //delete event with specified id
    api.deleteFriendRequest(await getAccessTokenSilently(), id).then(() => {
      console.log("deleting");
      getAllFriendRequests();
    });
  }

  async function acceptFriendRequest(friendID, requestID) {

    console.log("Accepting friend request");
    //create friendship with specified id
    api.createFriendship(await getAccessTokenSilently(), friendID).then((res) => {
      console.log(res); 
      console.log("Creating Friend Request");
    });

    //delete event with specified id
    api.deleteFriendRequest(await getAccessTokenSilently(), requestID).then(() => {
      console.log("deleting");
      getAllFriendRequests();
    });
  }


  return (

    <div>
      
      <h1 className="text-white">Here are your friend requests!</h1>
      {requests &&
        requests.map((requests, key) => {
          console.log(requests.sending_profile_id);
          // getFriendInformation(requests.sending_profile_id); //this returns null for some reason?? 
          console.log(userProfileFriend);
          return (
            
            <li className="list-none" key={key}>
              {
                <div className="bg-slate-300 w-fit my-1 py-1 px-2 rounded ">
                  {requests.sending_profile_id}
                  <br />
                  {requests.receiving_profile_id}
                  <br />
                  {requests.id}
                  <br />  
                  <Button 
                  className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded`}
                  onClick={() => declineFriendRequest(requests.id)}>Decline</Button>
                  <br />  
                  <br />  

                  <Button 
                  className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded`}
                  onClick={() => acceptFriendRequest(requests.sending_profile_id, requests.id)}>Accept</Button>

                </div>
              }
            </li>
          );
        })}
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

export default Friendrequests;