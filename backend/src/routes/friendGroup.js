const express = require("express");
const pool = require("../config/db");
const router = express.Router();

router.get("/", async (req, res) => {
    const userProfile = req.auth.payload;
  
    // Get friend groups of the user
    var groups = await pool.query(
        `SELECT * FROM friend_group
        WHERE profile_id = '${userProfile.sub.replace("|", "_")}'`
    );
    res.json({ profile: groups?.rows , message:"Successfully querried friend groups of user"});
});

router.post("/", async (req, res) => {
    const userProfile = req.auth.payload;
    const friendGroup = req.body;
  
    // Create friend group
    const query = `
        INSERT INTO friend_group (group_name, profile_id)
        VALUES ($1, $2)
        RETURNING id
        `;
    const values = [
        friendGroup.group_name,
        userProfile.sub.replace("|", "_") //The user creating the group is the only member until they add users
    ];
    await pool.query(query, values);

    res.json({ message: "Successfully posted friend group" });
});

module.exports = router;