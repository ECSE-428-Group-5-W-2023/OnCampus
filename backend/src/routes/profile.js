const express = require("express");
const pool = require("../config/db");
const router = express.Router();

router.get("/", async (req, res) => {
  const userProfile = req.auth.payload;

  // Get user from profile list
  var profile = await pool.query(
    `SELECT * FROM profile
    WHERE profile_id = '${userProfile.sub.replace("|", "_")}' LIMIT 1`
  );
  res.json({ profile: profile?.rows });
});

router.post("/", async (req, res) => {
  const userProfile = req.auth.payload;
  const profile = req.body;

  var profileCreated = await pool.query(
    `SELECT * FROM profile
      WHERE profile_id = '${userProfile.sub.replace("|", "_")}'`
  );

  // create the profile if it doesn't exist or update it if it does
  if (profileCreated.rows.length === 0) {
  const query = {
      text: `INSERT INTO profile (profile_id, email, name, username, school, bio) VALUES ('${userProfile.sub.replace("|", "_")}', $1, $2, $3, $4, $5) RETURNING *`,
      values: [profile.email, profile.name, profile.username, profile.school, profile.bio]
  };
  await pool.query(query);
  res.json({ message: "Successfully posted" });
  } else {
   // Update profile
    const query = `
          UPDATE profile
          SET name = $1, username = $2, school = $3, bio = $4
          WHERE profile_id = '${userProfile.sub.replace("|", "_")}'
        `;

    const values = [
      profile.name,
      profile.username,
      profile.school,
      profile.bio,
    ];
    await pool.query(query, values);
    res.json({ message: "Successfully updated" });
  }
});

module.exports = router;
