import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from "react";
import * as React from "react";
import Api from "../../helpers/api";
import Button from "../Common/Button";
import Popup from "../Common/Popup";

const FriendGroup = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const [group_name, setGroupName] = useState("");
  const [userFriendGroups, setUserFriendGroups] = useState("");
  const [userFriendGroupsSize, setUserFriendGroupsSize] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showPopupModal, setShowPopupModal] = useState(false);
  const [modalPopupTitle, setModalPopupTitle] = useState(false);
  const [modalPopupDescription, setModalPopupDescription] = useState(false);

  const api = new Api();

  useEffect(() => {
    try {
      getFriendGroups();
    } catch (err) {
      console.log("error" + err);
    }
  }, []);


  async function getFriendGroups() {
    try {
      api.getFriendGroups(
        await getAccessTokenSilently()
      )
        .then((res) => {
          // console.log("result from get friendGroups message: " + res.message)
          // console.log("result from get friendGroups profile: " + res.profile[0].group_name)
          // setUserFriendGroupsSize(res.profile.length)
          setUserFriendGroups(res.profile);
        });
    } catch (err) {
      console.log("error" + err);
    }
    // add error handling for friendNotFound
    handleModalOpen();
  }

  //creates friendGroup
  async function createFriendGroup(event) {
    event.preventDefault(); //prevent page refresh
    console.log("The group name being created is: " + group_name);
    await api
      .createFriendGroup(
        await getAccessTokenSilently(),
        group_name
      )
      .then((res) => {
        console.log(res);
        if (res.data.message == 'Successfully posted friend group') { //it's a valid group
          console.log("data content: " + res.data);
        } else {
          console.log("Nothing created, there must be a mistake!");
        }
      });
    setShowModal(false);
    getFriendGroups(); // get all groups so we can update the display
  }


  const handleModalOpen = () => {
    setShowModal(true);
  };

  return (
    <div className="friend-group">
      {userFriendGroups ? (
        <div>
          <h1 className="text-white"> My {userFriendGroupsSize} friend groups: </h1>
          <div>
            {userFriendGroups.map(g => (
              <div key={g.id}>
                <h3 className="text-white"> {g.group_name}</h3>
              </div>
            ))}
          </div>
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
                value={group_name}
                onChange={(event) => setGroupName(event.target.value)}
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
      ) : (
        <div className="friend-group">
          <div>
            <h1 className="text-white">Create your first friend group!</h1>
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
                  value={group_name}
                  onChange={(event) => setGroupName(event.target.value)}
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
        </div>
      )}
    </div>
  );
};

export default FriendGroup;
