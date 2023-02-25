const express = require("express");
const pool = require("../config/db");
const router = express.Router();

router.get("/", async (req, res) => {
  const userProfile = req.auth.payload;

  // Get event list for user
  const eventlist = await pool.query(
    `SELECT * FROM event_list 
    WHERE owner_id = '${userProfile.sub.replace("|", "_")}'`
  );

  var events = null;
  if (eventlist.rows.length !== 0) {
    const query = `SELECT * FROM event where event_list_id = ${eventlist.rows[0].id} AND is_deleted IS NULL OR FALSE`;
    events = await pool.query(query);
  }

  res.json({ events: events?.rows });
});

router.post("/", async (req, res) => {
  const userProfile = req.auth.payload;
  const event = req.body;
  // Get event list for user
  var eventlist = await pool.query(
    `SELECT * FROM event_list 
      WHERE owner_id = '${userProfile.sub.replace("|", "_")}'`
  );
  // Create event list if it doesn't exist
  if (eventlist.rows.length === 0) {
    const query = `
        INSERT INTO event_list (owner_id)
        VALUES ($1)
        RETURNING id
      `;
    const values = [userProfile.sub.replace("|", "_")];
    eventlist = await pool.query(query, values);
  }

  const query = `
        INSERT INTO event (event_list_id,title, description, is_recurring, is_private, days_of_week, event_frequency, event_tags, date, end_period, start_date, end_date)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING id
      `;

  if (eventlist.rows.length !== 0) {
    const values = [
      eventlist.rows[0].id,
      event.title,
      event.description,
      event.is_recurring,
      event.is_private,
      event.days_of_week,
      event.event_frequency,
      event.event_tags,
      event.date,
      event.end_period,
      event.start_date,
      event.end_date,
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
        SET title = $1, description = $2, is_recurring = $3, is_private = $4, days_of_week = $5, event_frequency = $6, event_tags = $7, date = $8, end_period = $9, start_date = $10, end_date = $11
        WHERE id = ${req.query.id}
      `;
  const values = [
    event.title,
    event.description,
    event.is_recurring,
    event.is_private,
    event.days_of_week,
    event.event_frequency,
    event.event_tags,
    event.date,
    event.end_period,
    event.start_date,
    event.end_date,
  ];
  await pool.query(query, values);

  res.json({ message: "Successfully updated" });
});

module.exports = router;
