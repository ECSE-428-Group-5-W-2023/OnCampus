const express = require("express");
const pool = require("../config/db");
const router = express.Router();

router.get("/", async (req, res) => {
  const userProfile = req.auth.payload;
  const group_id = req.query.group_id;

  // Get event list for user
  const eventlist = await pool.query(
    `SELECT * FROM event_list 
    WHERE owner_id = '${
      group_id && group_id > 0
        ? `group_${group_id}`
        : userProfile.sub.replace("|", "_")
    }'`
  );

  var events = null;
  if (eventlist.rows.length !== 0) {
    const query = `SELECT * FROM event where event_list_id = ${eventlist.rows[0].id}`;
    events = await pool.query(query);
  }

  res.json({ events: events?.rows });
});

router.post("/", async (req, res) => {
  const userProfile = req.auth.payload;
  const event = req.body;
  const group_id = event.group_id;
  // Get event list for user
  var eventlist = await pool.query(
    `SELECT * FROM event_list 
      WHERE owner_id = '${
        group_id && group_id > 0
          ? `group_${group_id}`
          : userProfile.sub.replace("|", "_")
      }'`
  );
  // Create event list if it doesn't exist
  if (eventlist.rows.length === 0) {
    const query = `
        INSERT INTO event_list (owner_id)
        VALUES ($1)
        RETURNING id
      `;
    const values = [
      group_id && group_id > 0
        ? `group_${group_id}`
        : userProfile.sub.replace("|", "_"),
    ];
    eventlist = await pool.query(query, values);
  }

  const query = `
        INSERT INTO event (event_list_id, title, description, is_private, event_tags, r_rule, ex_date, all_day, start_date, end_date, like_count, dislike_count)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING id
      `;

  if (eventlist.rows.length !== 0) {
    const values = [
      eventlist.rows[0].id,
      event.title,
      event.description,
      event.is_private,
      event.event_tags,
      event.r_rule,
      event.ex_date,
      event.all_day,
      event.start_date,
      event.end_date,
      event.like_count,
      event.dislike_count,
    ];
    await pool.query(query, values);
  }

  res.json({ message: "Successfully posted" });
});

router.put("/", async (req, res) => {
  const event = req.body;

  // Update event
  const query = `
        UPDATE event
        SET title = COALESCE($1, title), description = COALESCE($2, description), is_private = COALESCE($3, is_private), event_tags = COALESCE($4, event_tags), r_rule = COALESCE($5, r_rule), ex_date = COALESCE($6, ex_date), all_day = COALESCE($7, all_day), start_date = COALESCE($8, start_date), end_date =COALESCE($9, end_date), like_count = COALESCE($10, like_count), dislike_count = COALESCE($11, dislike_count)
        WHERE id = ${req.query.id}
      `;

  const values = [
    event.title,
    event.description,
    event.is_private,
    event.event_tags,
    event.r_rule,
    event.ex_date,
    event.all_day,
    event.start_date,
    event.end_date,
    event.like_count,
    event.dislike_count,
  ];
  await pool.query(query, values);

  res.json({ message: "Successfully updated" });
});

router.delete("/", async (req, res) => {
  // Delete event
  const query = `
        DELETE FROM event WHERE id = ${req.query.id} 
      `;

  await pool.query(query);

  res.json({ message: "Successfully deleted" });
});

module.exports = router;
