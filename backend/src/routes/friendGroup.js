const express = require("express");
const pool = require("../config/db");
const router = express.Router();

router.get("/", async (req, res) => {
  const userProfile = req.auth.payload;

  // Get friend groups of the user
  var groups = await pool.query(
    `SELECT friend_group.* FROM friend_group
        JOIN group_membership ON friend_group.id = group_membership.friend_group_id
        WHERE group_membership.profile_id = '${userProfile.sub.replace(
          "|",
          "_"
        )}'`
  );
  res.json({
    profile: groups?.rows,
    message: "Successfully querried friend groups of user",
  });
});

router.post("/", async (req, res) => {
  const userProfile = req.auth.payload;
  const friendGroup = req.body;
  // Create friend group
  const query = `
        INSERT INTO friend_group (name, description)
        VALUES ($1, $2)
        RETURNING id
        `;
  console.log(friendGroup);
  const values = [friendGroup.name, friendGroup.description];
  const result = await pool.query(query, values);
  const friendGroupId = result.rows[0].id;

  // Add user to group
  const groupMembershipQuery = `
        INSERT INTO group_membership (friend_group_id, profile_id)
        VALUES ($1, $2)
        `;
  const groupMembershipValues = [
    friendGroupId,
    userProfile.sub.replace("|", "_"), //The user creating the group is the only member until they add users
  ];
  await pool.query(groupMembershipQuery, groupMembershipValues);

  res.json({ message: "Successfully posted friend group" });
});

//leave group
router.post("/leave/:id", async (req, res) => {
  const friendGroupId = req.params.id;
  const userProfile = req.auth.payload;
  const profileId = userProfile.sub.replace("|", "_");

  // Remove the user from the group membership
  const query = `DELETE FROM group_membership WHERE friend_group_id = $1 AND profile_id = $2`;
  const values = [friendGroupId, profileId];
  await pool.query(query, values);

  res.json({ message: "Successfully left the friend group" });
});

router.post("/join/:id", async (req, res) => {
  const userProfile = req.auth.payload;
  const friendGroupId = req.params.id;

  // Check if friend group exists
  const friendGroupQuery = `SELECT * FROM friend_group WHERE id = $1`;
  const friendGroupResult = await pool.query(friendGroupQuery, [friendGroupId]);
  if (friendGroupResult.rows.length === 0) {
    return res.status(400).json({ message: "Friend group not found" });
  }

  // Check if user is already a member of the friend group
  const membershipQuery = `SELECT * FROM group_membership WHERE friend_group_id = $1 AND profile_id = $2`;
  const membershipResult = await pool.query(membershipQuery, [
    friendGroupId,
    userProfile.sub.replace("|", "_"),
  ]);
  if (membershipResult.rows.length > 0) {
    return res
      .status(400)
      .json({ message: "User is already a member of the friend group" });
  }

  // Join friend group
  const joinQuery = `
        INSERT INTO group_membership (friend_group_id, profile_id)
        VALUES ($1, $2)
        `;
  const joinValues = [friendGroupId, userProfile.sub.replace("|", "_")];
  await pool.query(joinQuery, joinValues);

  res.json({ message: "Successfully joined friend group" });
});

router.get("/all", async (req, res) => {
  // Get all friend groups
  const groups = await pool.query("SELECT * FROM friend_group");
  res.json({
    groups: groups?.rows,
    message: "Successfully querried all friend groups",
  });
});

module.exports = router;
