import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from "react";
import * as React from "react";
import Api from "../../helpers/api";
import Button from "../Common/Button";
import Popup from "../Common/Popup";

const FriendGroup = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const [name, setGroupName] = useState("");
  const [description, setGroupDescription] = useState("");
  const [username, setMemberUsername] = useState("");
  const [groupName, setName] = useState("");
  const [userFriendGroups, setUserFriendGroups] = useState([]);
  const [allGroups, setAllGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPopupModal, setShowPopupModal] = useState(false);
  const [modalPopupTitle, setModalPopupTitle] = useState(false);
  const [modalPopupDescription, setModalPopupDescription] = useState(false);
  const [showDescriptions, setShowDescriptions] = useState({});


  const api = new Api();

  useEffect(() => {
    try {
      getGroups();
    } catch (err) {
      console.log("error" + err);
    }
  }, []);

  async function getGroups() {
    try {
      api.getFriendGroups(await getAccessTokenSilently()).then((res) => {
        setUserFriendGroups(res.profile);
      });
      api.getAllGroups(await getAccessTokenSilently()).then((res) => {
        setAllGroups(res);
      });
    } catch (err) {
      console.log("error" + err);
    }
  }

  async function createFriendGroup(event) {
    event.preventDefault(); //prevent page refresh
    await api
      .createFriendGroup(await getAccessTokenSilently(), name, description)
      .then((res) => {
        if (res.data.message == "Successfully posted friend group") {
          //it's a valid group
          console.log("data content: " + res.data);
        } else {
          console.log("Nothing created, there must be a mistake!");
        }
      });
    getGroups(); // get all groups so we can update the display
  }
  
  useEffect(() => {
    filter();
  }, [searchTerm, allGroups]);

  const filter = () => {
    setFilteredGroups(
      allGroups.filter(
        (group) =>
          group?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          group?.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  async function removeUserFromGroup(event) {
    event.preventDefault(); //prevent page refresh
    try{
      await api
        .removeUser(await getAccessTokenSilently(), groupName, username)
        .then((res) => {
          if (res.data.message == "Successfully removed from friend group") {
            //it's a valid group
            console.log("data content: " + res.data);
          } else {
            console.log("Nothing created, there must be a mistake!");
          }
        });
    }catch (err){
      console.log("error"+err);
    }
    getGroups(); // get all groups so we can update the display
  };

  const joinGroup = async (groupId) => {
    await api.joinGroup(await getAccessTokenSilently(), groupId);
    getGroups();
  };

  const leaveGroup = async (groupId) => {
    await api.leaveGroup(await getAccessTokenSilently(), groupId);
    getGroups();
  };

  return (
    <div className="friend-group">
      <div>
        <input
          type="text"
          placeholder="Search groups"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          onClick={() => {
            setShowDropdown(true);
          }}
        />
      </div>
      <div>
        {showDropdown && (
          <div
            className="absolute z-10 w-full mt-2 bg-white rounded-md shadow-lg"
            onMouseLeave={() => {
              setShowDropdown(false);
            }}
          >
            <ul className="py-1">
              {filteredGroups.map((group) => (
                <li
                  key={group.id}
                  className="px-3 py-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => {
                    joinGroup(group.id);
                    setShowDropdown(false);
                  }}
                >
                  {group.name} ({group.description})
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="text-white">Your friend groups:</div>

      {userFriendGroups && userFriendGroups.length > 0 ? (
        <div className="friend-groups-container">
          {userFriendGroups.map((group) => (
            <div
              key={group.id}
              className="friend-group-item p-1 mb-1 flex flex-col"
            >
              <div className="outline-slate-400 outline p-1 rounded">
                <div className="flex justify-between items-center align-middle">
                  <div
                    className="text-white font-bold 
                "
                  >
                    {group.name}
                  </div>
                  <Button
                    className="bg-red-500 text-white rounded hover:bg-red-600 ml-2"
                    onClick={() => {
                      leaveGroup(group.id);
                    }}
                  >
                    Leave Group
                  </Button>
                  <Button
                    className="text-white font-bold border border-gray-500 ml-2 p-2 rounded hover:bg-gray-500"
                    onClick={() => {
                      setShowDescriptions({
                        ...showDescriptions,
                        [group.id]: !showDescriptions[group.id],
                      });
                    }}
                  >
                    {showDescriptions[group.id] ? "Hide" : "Show"} Description
                  </Button>
                </div>
                {showDescriptions[group.id] && (
                  <p className="text-white mt-2">{group.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-white">
          You are not a part of any friend groups
        </div>
      )}

      <div>
        <h1 className="text-white">Create more friend groups!</h1>
        <div>
          <form onSubmit={createFriendGroup}>
            <label
              htmlFor="groupName"
              className="text-white text-lg font-bold m-3 mx-auto"
            >
              Group name:
            </label>
            <input
              type="text"
              id="groupName"
              value={name}
              onChange={(event) => setGroupName(event.target.value)}
            />
            <br></br>
            <label
              htmlFor="groupDescription"
              className="text-white text-lg font-bold m-3 mx-auto"
            >
              Group description:
            </label>
            <input
              type="text"
              id="groupDescription"
              value={description}
              onChange={(event) => setGroupDescription(event.target.value)}
            />
            <br></br>
            <Popup
              open={showPopupModal}
              setOpen={setShowPopupModal}
              title={modalPopupTitle}
              description={modalPopupDescription}
            />
            <Button type="submit">Create</Button>
          </form>
        </div>
      </div>

      <div>
        <h1 className="text-white">Remove a user from a group</h1>
        <div>
          <form onSubmit={removeUserFromGroup}>
            <label
              htmlFor="groupName                                                               r"
              className="text-white text-lg font-bold m-3 mx-auto"
            >
              Group name:
            </label>
            <input
              type="text"
              id="groupName"
              value={groupName}
              onChange={(event) => setName(event.target.value)}
            />
            <br></br>
            <label
              htmlFor="memberUser"
              className="text-white text-lg font-bold m-3 mx-auto"
            >
              Username:
            </label>
            <input
              type="text"
              id="memberUser"
              value={username}
              onChange={(event) => setMemberUsername(event.target.value)}
            />
            <br></br>
            <Popup
              open={showPopupModal}
              setOpen={setShowPopupModal}
              title={modalPopupTitle}
              description={modalPopupDescription}
            />
            <Button type="submit">Remove</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FriendGroup;
