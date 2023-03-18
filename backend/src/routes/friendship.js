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
  const query = `
          SELECT * FROM profile
          WHERE username = $1
    `;
  const values = [usernameFriend];
  var profileFriend = await pool.query(query, values);

  // Creating a friendship between both user (friend and user logged in)
  const query_second = {
    text: `
        INSERT INTO friendship (profile_id_one, profile_id_two)
        VALUES ($1, $2)
        RETURNING *
    `,
    values: [userProfile.sub.replace("|", "_"), profileFriend.rows[0].profile_id]
  };
  var friendship = await pool.query(query_second);
  res.json({ friendship: friendship?.rows });
});

module.exports = router;
