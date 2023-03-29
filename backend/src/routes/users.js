const express = require("express");
const pool = require("../config/db");
const router = express.Router();

router.get("/", async (req, res) => {
  // Get friend from profile list
  const query = `
          SELECT * FROM profile
    `;
  var users = await pool.query(query);
  res.json({ users: users?.rows });
});


module.exports = router;
