const express = require("express");
const pool = require("../config/db");
const router = express.Router();

router.get("/", async (req, res) => {
  const userProfile = req.auth.payload;
  const usernameFriend = req.query.usernameFriend;

  // Get friend from profile list
  const query = `
          SELECT * FROM profile
          WHERE username = $1
    `;
  const values = [usernameFriend];
  var profileFriend = await pool.query(query, values);
  res.json({ profileFriend: profileFriend?.rows });
});

router.post("/", async (req, res) => {
  const userProfile = req.auth.payload;
  const usernameFriend = req.query.usernameFriend;

  // Get friend from profile list
  const queryProfile = `
    SELECT * FROM profile
    WHERE username = $1
  `;
  const valuesProfile = [usernameFriend];
  try {
    const profileFriend = await pool.query(queryProfile, valuesProfile);

    if (userProfile.sub.replace("|", "_") === profileFriend.rows[0].profile_id) {
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
    const valuesFriendshipExists = [userProfile.sub.replace("|", "_"), profileFriend.rows[0].profile_id];
    const friendshipExists = await pool.query(queryFriendshipExists, valuesFriendshipExists);
    if (friendshipExists.rows[0].count > 0) {
      res.json({ message: "Friendship already exists" });
      return;
    }

    // Creating a friendship between both user (friend and user logged in)
    const queryCreateFriendship = {
      text: `
        INSERT INTO friendship (profile_id_one, profile_id_two)
        VALUES ($1, $2)
        RETURNING *
      `,
      values: [userProfile.sub.replace("|", "_"), profileFriend.rows[0].profile_id]
    };
    const friendship = await pool.query(queryCreateFriendship);
    res.json({ message: "Successfully posted" });
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
