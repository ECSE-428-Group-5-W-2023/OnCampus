const express = require("express");
const pool = require("../config/db");
const router = express.Router();

// router.get("/", async (req, res) => {
//   const userProfile = req?.auth?.payload;
//   // userProfile.sub is going to the the user's id in our database. Only thing to be aware of si taht it contains the special characters |
//   // and we should therefore do something like ${userProfile.sub.replace("|", "_")} when we use it to query or post to the db

//   // PERFORM SQL QUERY TO THE DB
  
//   // EXAMPLE QUERY:
//   // const query = `SELECT * FROM todo where todo_list_id = ${todolist.rows[0].id} AND is_deleted IS NULL OR FALSE`;
//   // todos = await pool.query(query);

//   // EXAMPLE RESPONSE:
//   res.json({ message: "beep boop" });
// });

module.exports = router;