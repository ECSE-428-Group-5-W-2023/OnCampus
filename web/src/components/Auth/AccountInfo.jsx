import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from 'react';
import * as React from "react";
import Api from "../../helpers/api";
import Button from "../Common/Button";

const Profile = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [bio, setBio] = useState("");
  const [profile, setProfile] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const api = new Api();

  useEffect(() => {
      try {
        getUserProfile();
      } catch (err) {
        console.log("error" + err);
      }
    }, []);

    async function getUserProfile() {
        try {
            api.getProfile(await getAccessTokenSilently()).then((res) => {
              setUserProfile(res.profile[0]);
            });
          } catch (err) {
            console.log("error" + err);
          }
    }

    async function createProfile(profile) {
          profile.preventDefault(); //prevent page refresh
          const email = user.email;
          setShowModal(false);
          //create or update profile
              await api
                .createProfile(
                  await getAccessTokenSilently(),
                  email,
                  name,
                  username,
                  school,
                  bio
                )
                .then((res) => {
                  console.log(res);
                });
                getUserProfile();
          }

    const handleModalOpen = () => {
      setShowModal(true);
    };

  return (
    <div className="user-profile">
      {userProfile ? (
        <div>
          <img
              src={user?.picture}
              alt={`${user?.name}`}
              className="w-40 h-40 rounded-full mx-auto"
          />
          <div className="text-white text-lg font-bold m-3 mx-auto">
              Email: {user?.email}
          </div>
          <div className="text-white text-lg font-bold m-3 mx-auto">
              Username: {userProfile.username}
          </div>
          <div className="text-white text-lg font-bold m-3 mx-auto">
              Name: {userProfile.name}
          </div>
          <div className="text-white text-lg font-bold m-3 mx-auto">
              School: {userProfile.school}
          </div>
          <div className="text-white text-lg font-bold m-3 mx-auto">
           Bio: {userProfile.bio}
          </div>

          <Button onClick={handleModalOpen}>Edit</Button>
          <div className={`modal ${showModal ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <form onSubmit={createProfile}>
              <label htmlFor="username" className="text-white text-lg font-bold m-3 mx-auto">
                Username:
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(profile) => setUsername(profile.target.value)}
              />
              <br></br>
              <label htmlFor="name"className="text-white text-lg font-bold m-3 mx-auto">
                Name:
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(profile) => setName(profile.target.value)}
              />
              <br></br>
              <label htmlFor="school" className="text-white text-lg font-bold m-3 mx-auto">
                School:
              </label>
              <input
                type="text"
                id="school"
                value={school}
                onChange={(profile) => setSchool(profile.target.value)}
              />
              <br></br>
              <label htmlFor="bio" className="text-white text-lg font-bold m-3 mx-auto">
                Bio:
              </label>
              <input
                id="bio"
                value={bio}
                onChange={(profile) => setBio(profile.target.value)}
              />
             <br></br>
            <Button type="submit">Submit Changes</Button>
          </form>
          </div>
        </div>
      ) : (
      <div>
          <h1 className="text-white">Complete Your Profile!</h1>
          <div>
          <form onSubmit={createProfile}>
              <label htmlFor="username" className="text-white text-lg font-bold m-3 mx-auto">
                Username:
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(profile) => setUsername(profile.target.value)}
              />
              <br></br>
              <label htmlFor="name"className="text-white text-lg font-bold m-3 mx-auto">
                Name:
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(profile) => setName(profile.target.value)}
              />
              <br></br>
              <label htmlFor="school" className="text-white text-lg font-bold m-3 mx-auto">
                School:
              </label>
              <input
                type="text"
                id="school"
                value={school}
                onChange={(profile) => setSchool(profile.target.value)}
              />
              <br></br>
              <label htmlFor="bio" className="text-white text-lg font-bold m-3 mx-auto">
                Bio:
              </label>
              <input
                id="bio"
                value={bio}
                onChange={(profile) => setBio(profile.target.value)}
              />
             <br></br>
            <Button type="submit">Submit</Button>
          </form>
          </div>
      </div>
      )}
    </div>
  );
};

export default Profile;
