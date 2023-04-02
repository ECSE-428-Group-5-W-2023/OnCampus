import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Api from "../../helpers/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

function ViewInvitations() {
  const { getAccessTokenSilently } = useAuth0();
  const [invitations, setInvitations] = useState([]);
  const api = new Api();

  useEffect(() => {
    getInvitations();
  }, []);

  async function getInvitations() {
    try {
      const res = await api.getInvitations(await getAccessTokenSilently());
      const invitationWithProfile = [];
      for (let i = 0; i < res.length; i++) {
        const userProfile = await api.getProfileWithId(
          await getAccessTokenSilently(),
          res[i].sender_profile_id
        );
        const event = await api.getEvent(
          await getAccessTokenSilently(),
          res[i].event_id
        );
        invitationWithProfile.push({ ...res[i], ...userProfile, ...event });
      }
      console.log(invitationWithProfile);
      setInvitations(invitationWithProfile);
    } catch (err) {
      console.log("Error: " + err);
    }
  }

  async function acceptInvitation(invitation_id) {
    try {
      await api.acceptInvitation(await getAccessTokenSilently(), invitation_id);
      getInvitations();
    } catch (err) {
      console.log("Error: " + err);
    }
  }

  async function declineInvitation(invitation_id) {
    try {
      await api.declineInvitation(
        await getAccessTokenSilently(),
        invitation_id
      );
      getInvitations();
    } catch (err) {
      console.log("Error: " + err);
    }
  }

  return (
    <div className="py-4 text-white">
      <h1 className="text-2xl font-bold mb-4">Event Invitations</h1>
      {invitations?.length > 0 &&
        invitations?.map((invitation) => (
          <div key={invitation.id} className="border-b-2 py-2">
            <div className="flex justify-end items-center mt-2">
              <div className="text-sm">
                <div className="flex justify-between">
                  <div className="font-semibold">{invitation.event.title}</div>
                  <p className="text-sm mb-2">
                    {invitation.profile?.name} - {invitation.profile?.email}
                  </p>
                </div>

                <div>
                  {new Date(invitation.event.start_date).toLocaleDateString()},{" "}
                  {new Date(invitation.event.start_date).toLocaleTimeString()} -{" "}
                  {new Date(invitation.event.end_date).toLocaleDateString()},{" "}
                  {new Date(invitation.event.end_date).toLocaleTimeString()}
                </div>
              </div>
              <button
                className="px-3 py-1 mr-4 ml-4 text-white bg-green-500 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50"
                onClick={() => acceptInvitation(invitation.id)}
              >
                <FontAwesomeIcon icon={faCheck} />
              </button>
              <button
                className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50"
                onClick={() => declineInvitation(invitation.id)}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          </div>
        ))}
    </div>
  );
}

export default ViewInvitations;
