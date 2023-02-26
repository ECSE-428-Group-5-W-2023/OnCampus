import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from 'react';
import * as React from "react";
import Api from "../../helpers/api";
import Button from "../Common/Button";

const Profile = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [bio, setBio] = useState("");
  const [profile, setProfile] = useState([]);
  const [profileCompleted, setProfileCompleted] = useState(false);

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
              setProfile(res.profile);
            });
          } catch (err) {
            console.log("error" + err);
          }
    }

    async function createProfile(event, name, username, school, bio) {
          event.preventDefault(); //prevent page refresh
          console.log(user.sub);
          //create or update profile
              await api
                .createProfile(
                  await getAccessTokenSilently(),
                  user.email,
                  name,
                  username,
                  school,
                  bio
                )
                .then((res) => {
                  console.log(res);
                  setUsername(res.username);
                  setName(res.name);
                  setSchool(res.school);
                  setBio(res.bio);
                  setProfileCompleted(true);
                });

                getUserProfile();
          }

//   async function handleSubmit (userProfile) {
//     userProfile.preventDefault();
//
//     const data = {
//         name,
//         username,
//         school,
//         bio,
//     };
//
//     async function createProfile(userProfile) {
//       userProfile.preventDefault(); //prevent page refresh
// //       const profile = await api.getProfile(await getAccessTokenSilently());
//
//       //create or update profile
//       if (profile) {
//           await api
//             .createProfile(
//               await getAccessTokenSilently(),
//               email,
//               name,
//               username,
//               school,
//               bio
//             )
//             .then((res) => {
//               console.log(res);
//               setUsername(res.username);
//               setName(res.name);
//               setSchool(res.school);
//               setBio(res.bio);
//               setProfileCompleted(true);
//             });
//       } else {
//         await api
//         .updateProfile(
//          await getAccessTokenSilently(),
//          email,
//          name,
//          username,
//          school,
//          bio
//          )
//          .then((res) => {
//             console.log(res);
//             setUsername(res.username);
//             setName(res.name);
//             setSchool(res.school);
//             setBio(res.bio);
//             setProfileCompleted(true);
//          });
//       }
//     } };

//   useEffect(() => {
//      async function  fetchProfile() {
//       if (isAuthenticated) {
//         const profile = await api.getProfile(await getAccessTokenSilently());
//         if (profile) {
//           setUsername(profile.username);
//           setName(profile.name);
//           setSchool(profile.school);
//           setBio(profile.bio);
//           setProfileCompleted(true);
//         }
//       }
//     };
//
//     fetchProfile();
//   }, [isAuthenticated, api, getAccessTokenSilently]);


  return (
    <div className="user-profile">
          <h1 className="text-white text-lg font-bold m-3 mx-auto">Complete Your Profile</h1>
          <form onSubmit={createProfile}>
              <label htmlFor="username" className="text-white text-lg font-bold m-3 mx-auto">
                Username:
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(username) => setUsername(username.target.value)}
              />
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(name) => setName(name.target.value)}
              />
              <label htmlFor="school">School:</label>
              <input
                type="text"
                id="school"
                value={school}
                onChange={(school) => setSchool(school.target.value)}
              />
              <label htmlFor="bio">Bio:</label>
              <input
                id="bio"
                value={bio}
                onChange={(bio) => setBio(bio.target.value)}
              />
            <Button type="submit">Submit</Button>
          </form>

      {profileCompleted => {
          return (
              <div>
                <img
                    src={user?.picture}
                    alt={`${user?.name}`}
                    className="w-40 h-40 rounded-full mx-auto"
                />

                <div className="text-white text-lg font-bold m-3 mx-auto">
                    Email: {user?.email}
                </div>
                <div className="row">
                    <pre className="col-12 text-light bg-dark p-4">
                        {JSON.stringify(user, null, 2)}
                    </pre>
                </div>

                <div className="text-white text-lg font-bold m-3 mx-auto">
                    Name: {name}
                </div>

                <div className="text-white text-lg font-bold m-3 mx-auto">
                    School: {school}
                </div>

                <div className="text-white text-lg font-bold m-3 mx-auto">
                 Bio: {bio}
                 </div>
              </div>
          );
        }}
        </div>
  );
};

export default Profile;
