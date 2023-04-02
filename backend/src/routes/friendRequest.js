const express = require("express");
const pool = require("../config/db");
const router = express.Router();

//This handle sending a friend request
router.post("/", async (req, res) => {
  const userProfile = req.auth.payload;
  const usernameFriend = req.query.usernameFriend;

  //Getting another user from profile list
  const queryProfile = `
      SELECT * FROM profile
      WHERE username = $1
    `;
  const valuesProfile = [usernameFriend];
  try {
    const profileFriend = await pool.query(queryProfile, valuesProfile);

    if (
      userProfile.sub.replace("|", "_") === profileFriend.rows[0].profile_id
    ) {
      res.json({ message: "Adding yourself" });
      return;
    }

    // check if they are already friends
    const queryFriendshipExists = `
        SELECT COUNT(*) as count
        FROM friendship
        WHERE (profile_id_one = $1 AND profile_id_two = $2)
          OR (profile_id_one = $2 AND profile_id_two = $1)
      `;
    const valuesFriendshipExists = [
      userProfile.sub.replace("|", "_"),
      profileFriend.rows[0].profile_id,
    ];
    const friendshipExists = await pool.query(
      queryFriendshipExists,
      valuesFriendshipExists
    );
    if (friendshipExists.rows[0].count > 0) {
      res.json({ message: "Friendship already exists" });
      return;
    }

    // check if a friend request has already been made
    const queryFriendRequestExists = `
        SELECT COUNT(*) as count
        FROM friendrequest
        WHERE (sending_profile_id = $1 AND receiving_profile_id = $2)
          OR (sending_profile_id = $2 AND receiving_profile_id = $1)
      `;
    const valuesFriendRequestExists = [
      userProfile.sub.replace("|", "_"),
      profileFriend.rows[0].profile_id,
    ];
    const friendRequestExists = await pool.query(
      queryFriendRequestExists,
      valuesFriendRequestExists
    );
    if (friendRequestExists.rows[0].count > 0) {
      res.json({ message: "Friend Request already exists" });
      return;
    }

    // Creating a friend request between both user (friend and user logged in)
    const queryCreateFriendRequest = {
      text: `
          INSERT INTO friendrequest (receiving_profile_id, sending_profile_id)
          VALUES ($2, $1)
          RETURNING *
        `,
      values: [
        userProfile.sub.replace("|", "_"),
        profileFriend.rows[0].profile_id,
      ],
    };
    const friendRequest = await pool.query(queryCreateFriendRequest);
    res.json({ message: "Successfully posted" });
  } catch (error) {
    console.error(error);
  }
});

//delete a friend request
router.delete("/", async (req, res) => {
  const userProfile = req.auth.payload;
  const profile = req.query.usernameFriend;

  // Delete friend request
  const query = `
          DELETE FROM friendrequest WHERE (sending_profile_id = $1 AND receiving_profile_id = '${userProfile.sub.replace(
            "|",
            "_"
          )}')
        `;

  const values = [profile];
  await pool.query(query, values);
  res.json({ message: "Successfully deleted" });
});

//Get all friend requests for a given user
router.get("/", async (req, res) => {
  const userProfile = req.auth.payload;

  //Get friend request list from user (ngl not sure if receiving profile is the user that didn't send)
  const query = `SELECT * FROM friendrequest 
    WHERE receiving_profile_id = '${userProfile.sub.replace("|", "_")}'`;

  //Putting the list obtained into a variable
  var friendRequests = null;
  friendRequests = await pool.query(query);

  res.json({ friendRequests: friendRequests?.rows });
});

module.exports = router;
