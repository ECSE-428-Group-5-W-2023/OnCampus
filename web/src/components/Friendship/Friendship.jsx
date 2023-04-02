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
  const [userList, setUserList] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const api = new Api();

  useEffect(() => {
    setFilteredUsers(
      userList.filter((user) => {
        return user.username.toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
    console.log(filteredUsers);
  }, [searchTerm, userList]);

  useEffect(() => {
    try {
      getFriend(usernameFriend);
      getAllUsers();
    } catch (err) {
      console.log("error" + err);
    }
  }, []);
  async function getAllUsers() {
    try {
      api.getAllUsers(await getAccessTokenSilently()).then((users) => {
        setUserList(users);
      });
    } catch (err) {
      console.log("error" + err);
    }
  }

  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
    setIsDropdownOpen(true);
  };

  const handleUserSelect = (user) => {
    setSearchTerm("");
    setUserProfileFriend(user);
    setUsernameFriend(user.username);
  };

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

  async function friendshipDoesNotExist() {
    setModalPopupTitle("You are not friends!");
    setModalPopupDescription("You have not added this person as a friend.");
    setShowPopupModal(true);
  }

  async function friendshipDeleted() {
    setModalPopupTitle("Friendship Deleted!");
    setModalPopupDescription("You have successfully deleted this friend.");
    setShowPopupModal(true);
  }

  async function requestAlreadyMade() {
    setModalPopupTitle("You've already requested this person as a friend!");
    setModalPopupDescription("You cannot send two friend requests to the same person.");
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

  async function handleSubmit(event = null) {
    event?.preventDefault(); //prevent page refresh
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
        }else if (res.data.message == "Friend Request already exists") {
          requestAlreadyMade();
          console.log("Friend Request already exists");
        }
      });
    setShowModal(false);
    getFriend(usernameFriend);
  }

  async function deleteFriendship(event) {
    event.preventDefault(); //prevent page refresh
    await api
      .deleteFriendship(await getAccessTokenSilently(), usernameFriend)
      .then((res) => {
        console.log(res);
        if (res.data.message == "Friendship does not exist") {
          friendshipDoesNotExist();
          console.log("friendship does not exist!");
        } else if (res.data.message == "Friendship deleted") {
          friendshipDeleted();
          console.log("friendship deleted!");
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
      <div className="relative">
        <div className="flex flex-row">
          <input
            type="text"
            value={searchTerm}
            placeholder="Search for a friend"
            onClick={() => setIsDropdownOpen(true)}
            onChange={handleSearchInputChange}
            className="border border-gray-300 rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
          />
          <Button onClick={handleSubmit} className="ml-1">
            Search
          </Button>
        </div>

        {isDropdownOpen && (
          <div
            className="absolute z-10 w-full mt-2 bg-white rounded-md shadow-lg"
            onMouseLeave={() => {
              setIsDropdownOpen(false);
            }}
          >
            <ul className="py-1">
              {filteredUsers.map((user) => (
                <li
                  key={user.id}
                  className="px-3 py-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => {
                    handleUserSelect(user);
                    setIsDropdownOpen(false);
                  }}
                >
                  {user.username} ({user.name})
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {userProfileFriend && (
        <div>
          <div>
            <Popup
              open={showPopupModal}
              setOpen={setShowPopupModal}
              title={modalPopupTitle}
              description={modalPopupDescription}
            />
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
            <Button onClick={createFriendship}>Request Friend!</Button>
            &nbsp;
            <Button onClick={deleteFriendship}>Delete Friend!</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Friendship;
