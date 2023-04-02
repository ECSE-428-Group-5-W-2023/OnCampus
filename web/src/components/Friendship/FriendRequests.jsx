import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from "react";
import * as React from "react";
import Api from "../../helpers/api";
import Button from "../Common/Button";
import Popup from "../Common/Popup";

const Friendrequests= () => {
  const [requests, setRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const { getAccessTokenSilently } = useAuth0();
  const [userProfileFriends, setUserProfileFriends] = useState([]);
  const [usernameFriend, setUsernameFriend] = useState(null);


  const api = new Api();

  useEffect(() => {
    try {
      console.log("getting friend requests");
      getAllFriendRequests();
      // console.log(userProfileFriends); 

    } catch (err) {
      console.log("error" + err);
    }
  }, []);

  useEffect(() => {
    try {
      console.log("getting friend information");
      getFriendInformation();
    } catch (err) {
      console.log("error" + err);
    }
  }, [requests]);


  
  async function getAllFriendRequests() {
    await api.getFriendRequests(await getAccessTokenSilently()).then((res) => {
      console.log("entered get friend requests");
      console.log("res");
      console.log(res);
      setRequests(res.friendRequests);
    });
  }


  async function getFriendInformation() {
    console.log("entered get friend information");
    console.log("requests"); 
    console.log(requests);

    const friendsTemp = []; 
    for (let i = 0; i < requests.length; i++) {
      console.log("friend # " + i);
      console.log(requests[i].sending_profile_id); 
      try {
        api
          .getFriendInformation(await getAccessTokenSilently(), requests[i].sending_profile_id)
          .then((res) => {
            console.log(res);
            // setUserProfileFriend(res.data.profileFriend[0]);
            friendsTemp[i] = res.data.profileFriend[0];
            console.log(friendsTemp[i]);
            // setUserProfileFriends(friendsTemp); 
            // setUsernameFriend(res.data.profileFriend[0])
            // console.log(res.data.profileFriend[0])
            console.log("friends set");
            setFriends(friendsTemp);
            console.log(friends);
          });
      } catch (err) {
        console.log("error" + err);
      }

    }
    // console.log(usernameFriend);

    // setUserProfileFriends(friends); 


  }

  async function declineFriendRequest(id) {
    console.log("Declining Request"); 
    console.log(id); 
    // getFriendInformation(); 

    //delete event with specified id
    api.deleteFriendRequest(await getAccessTokenSilently(), id).then(() => {
      console.log("deleting");
      getAllFriendRequests();
    });
  }

  async function acceptFriendRequest(friendID) {
    console.log("Accepting Request");

    //create friendship with specified id [THIS MAY NOT WORK BECAUSE SHE USES USERNAME AND IM PASSING AUTH AGAIN]
    api.createFriendship(await getAccessTokenSilently(), friendID).then((res) => {
      console.log(res); 
      console.log("Creating Friend Request");
    });

    console.log("id: "+friendID)

    //delete event with specified id
    api.deleteFriendRequest(await getAccessTokenSilently(), friendID).then(() => {
      console.log("deleting");
      getAllFriendRequests();
    });
  }


  return (

    <div>
      
      <h1 className="text-white">Here are your friend requests!</h1>
      {friends?.map((friend) => {
          return (
              <li className="list-none" key={friend.id}>
                <div className="bg-slate-300 w-fit my-1 py-1 px-2 rounded ">
                  Username: {friend.username}
                  <br />
                  Name: {friend.name}
                  <br />
                  School: {friend.school}
                  <br />
                  Bio: {friend.bio}
                  <br />
                 <Button 
                  onClick={() => acceptFriendRequest(friend.profile_id)}>Accept</Button>

                  <Button 
                  className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded margin-left =2`}
                  onClick={() => declineFriendRequest(friend.profile_id)}>Decline</Button>
                </div>
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