import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from "react";
import * as React from "react";
import Api from "../../helpers/api";
import Button from "../Common/Button";
import Popup from "../Common/Popup";

const Friendrequests = () => {
  const [requests, setRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const { getAccessTokenSilently } = useAuth0();

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
      getFriendInformation();
    } catch (err) {
      console.log("error" + err);
    }
  }, [requests]);

  async function getAllFriendRequests() {
    await api.getFriendRequests(await getAccessTokenSilently()).then((res) => {
      setRequests(res.friendRequests);
    });
  }

  async function getFriendInformation() {
    const friendsTemp = [];
    for (let i = 0; i < requests.length; i++) {
      try {
        api
          .getFriendInformation(
            await getAccessTokenSilently(),
            requests[i].sending_profile_id
          )
          .then((res) => {
            friendsTemp[i] = res.data.profileFriend[0];
            setFriends(friendsTemp);
          });
      } catch (err) {
        console.log("error" + err);
      }
    }
  }

  async function declineFriendRequest(id) {

    //delete event with specified id
    api.deleteFriendRequest(await getAccessTokenSilently(), id).then(() => {
      getAllFriendRequests();
      window.location.reload();
    });
  }

  async function acceptFriendRequest(friendID) {

    //create friendship with specified id
    api
      .createFriendship(await getAccessTokenSilently(), friendID)
      .then((res) => {
        console.log(res);
      });


    //delete event with specified id
    api
      .deleteFriendRequest(await getAccessTokenSilently(), friendID)
      .then(() => {
        getAllFriendRequests();
        window.location.reload();
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
              <Button onClick={() => acceptFriendRequest(friend.profile_id)}>
                Accept
              </Button>
              <Button
                className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded margin-left =2`}
                onClick={() => declineFriendRequest(friend.profile_id)}
              >
                Decline
              </Button>
            </div>
          </li>
        );
      })}
    </div>
  );
};

export default Friendrequests;
