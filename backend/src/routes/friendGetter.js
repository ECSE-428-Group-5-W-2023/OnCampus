const express = require("express");
const pool = require("../config/db");
const router = express.Router();

router.get("/", async (req, res) => {
  const usernameFriendID = req.query.usernameFriend;

  // Get friend from profile list
  const query = `
          SELECT * FROM profile
          WHERE profile_id = $1
    `;
  const values = [usernameFriendID];
  var profileFriend = await pool.query(query, values);
  res.json({ profileFriend: profileFriend?.rows });
});

module.exports = router;