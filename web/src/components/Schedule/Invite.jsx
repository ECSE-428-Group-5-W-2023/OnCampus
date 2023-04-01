import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";
import Api from "../../helpers/api";
import Button from "../Common/Button";
import Popup from "../Common/Popup";

function Invite({inviteFriend}) {
  const { user, getAccessTokenSilently } = useAuth0();
  const [friends, setFriends] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const api = new Api();
  useEffect(() => {
    getFriends();
  }, []);
  async function getFriends() {
    await api.getAllFriends(await getAccessTokenSilently()).then((response) => {
      setFriends(response);
    });
  }

  useEffect(() => {
    filter();
  }, [searchTerm, friends]);

  const filter = () => {
    setFilteredFriends(
      friends?.filter(
        (friend) =>
          friend?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          friend?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search friends"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        onClick={() => {
          setShowDropdown(true);
        }}
      />
      {showDropdown && (
        <div
          className="absolute z-10 w-full mt-2 bg-white rounded-md shadow-lg"
          onMouseLeave={() => {
            setShowDropdown(false);
          }}
        >
          {filteredFriends && filteredFriends.length > 0 ? (
            <ul className="py-1">
              {filteredFriends.map((friend) => (
                <li
                  key={friend.id}
                  className="px-3 py-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => {
                    inviteFriend(friend);
                    setShowDropdown(false);
                  }}
                >
                  {friend.name} ({friend.email})
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-1 px-3">No friends found</div>
          )}
        </div>
      )}
    </div>
  );
}

export default Invite;
