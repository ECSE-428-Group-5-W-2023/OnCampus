import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from "react";
import * as React from "react";
import Api from "../../helpers/api";
import Button from "../Common/Button";
import Popup from "../Common/Popup";

const Friendship = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const [usernameFriend, setUsernameFriend] = useState("");
  const [profile, setProfile] = useState(null);
  const [userProfileFriend, setUserProfileFriend] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showPopupModal, setShowPopupModal] = useState(false);
  const [modalPopupTitle, setModalPopupTitle] = useState(false);
  const [modalPopupDescription, setModalPopupDescription] = useState(false);

  const api = new Api();

  useEffect(() => {
    try {
      getFriend(usernameFriend);
    } catch (err) {
      console.log("error" + err);
    }
  }, []);

  async function friendNotFound() {
    setModalPopupTitle("Account Does Not Exist");
    setModalPopupDescription(
      "Your friend may not have an OnCampus account or the username is wrong."
    );
    setShowPopupModal(true);
  }

  async function friendshipExists() {
    setModalPopupTitle("You are already friends!");
    setModalPopupDescription("You have already added this person as a friend.");
    setShowPopupModal(true);
  }

  async function addingYourself() {
    setModalPopupTitle("You are adding yourself!");
    setModalPopupDescription("You cannot add yourself as a friend.");
    setShowPopupModal(true);
  }

  async function requestAlreadyMade() {
    setModalPopupTitle("You've already requested this person as a friend!");
    setModalPopupDescription(
      "You cannot send two friend requests to the same person."
    );
    setShowPopupModal(true);
  }

  async function getFriend(usernameFriend) {
    try {
      api
        .getFriend(await getAccessTokenSilently(), usernameFriend)
        .then((res) => {
          setUserProfileFriend(res.data.profileFriend[0]);
        });
    } catch (err) {
      console.log("error" + err);
    }
    // add error handling for friendNotFound
    handleModalOpen();
  }

  async function handleSubmit(event) {
    event.preventDefault(); //prevent page refresh
    try {
      api
        .getFriend(await getAccessTokenSilently(), usernameFriend)
        .then((res) => {
          if (res.data.profileFriend.length === 0) {
            friendNotFound();
            console.log("username not found!");
          } else {
            setUserProfileFriend(res.data.profileFriend[0]);
          }
        });
    } catch (err) {
      console.log("error" + err);
    }
    handleModalOpen();
  }

  async function createFriendship(event) {
    event.preventDefault(); //prevent page refresh
    //create or update profile
    console.log(usernameFriend);
    await api
      .sendFriendRequest(await getAccessTokenSilently(), usernameFriend)
      .then((res) => {
        console.log(res);
        if (res.data.message == "Friendship already exists") {
          friendshipExists();
          console.log("friendship already exists!");
        } else if (res.data.message == "Adding yourself") {
          addingYourself();
          console.log("adding yourself!");
        } else if (res.data.message == "Friend Request already exists") {
          requestAlreadyMade();
          console.log("Friend Request already exists");
        }
      });
    setShowModal(false);
    getFriend(usernameFriend);
  }

  const handleModalOpen = () => {
    setShowModal(true);
  };

  return (
    <div className="friend-profile">
      {userProfileFriend ? (
        <div>
          <div>
            <h1 className="text-white">Search a friend!</h1>
            <div>
              <form onSubmit={handleSubmit}>
                <label
                  htmlFor="usernameFriend"
                  className="text-white text-lg font-bold m-3 mx-auto"
                >
                  Friend's Username:
                </label>
                <input
                  type="text"
                  id="usernameFriend"
                  value={usernameFriend}
                  onChange={(event) => setUsernameFriend(event.target.value)}
                />
                <br></br>
                <Popup
                  open={showPopupModal}
                  setOpen={setShowPopupModal}
                  title={modalPopupTitle}
                  description={modalPopupDescription}
                />
                <Button type="submit">Search</Button>
              </form>
            </div>
          </div>
          <div className="text-white text-lg font-bold m-3 mx-auto">
            Username: {userProfileFriend.username}
          </div>
          <div className="text-white text-lg font-bold m-3 mx-auto">
            Name: {userProfileFriend.name}
          </div>
          <div className="text-white text-lg font-bold m-3 mx-auto">
            School: {userProfileFriend.school}
          </div>
          <div className="text-white text-lg font-bold m-3 mx-auto">
            Bio: {userProfileFriend.bio}
          </div>
          <Popup
            open={showPopupModal}
            setOpen={setShowPopupModal}
            title={modalPopupTitle}
            description={modalPopupDescription}
          />
          <Button onClick={createFriendship}>Send Friend Request!</Button>
        </div>
      ) : (
        <div>
          <h1 className="text-white">Search a friend!</h1>
          <div>
            <form onSubmit={handleSubmit}>
              <label
                htmlFor="usernameFriend"
                className="text-white text-lg font-bold m-3 mx-auto"
              >
                Friend's Username:
              </label>
              <input
                type="text"
                id="usernameFriend"
                value={usernameFriend}
                onChange={(event) => setUsernameFriend(event.target.value)}
              />
              <br></br>
              <Popup
                open={showPopupModal}
                setOpen={setShowPopupModal}
                title={modalPopupTitle}
                description={modalPopupDescription}
              />
              <Button type="submit">Search</Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Friendship;
