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

router.get("/specific/:eventId", async (req, res) => {
  const eventId = req.params.eventId;
  try {
    const { rows } = await pool.query(
      "SELECT * FROM event WHERE id = $1 LIMIT 1",
      [eventId]
    );
    if (rows.length === 0) {
      res.status(404).json({ message: "Event not found" });
    } else {
      res.json({ event: rows[0] });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
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
        INSERT INTO event (event_list_id, title, description, is_private, event_tags, r_rule, ex_date, all_day, start_date, end_date)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
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
    ];

    const event_id = await pool.query(query, values);
    res.json({ message: "Successfully posted", eventID: event_id.rows[0].id });
  } else {
    res.json({ message: "Event List not found " });
  }
});

router.put("/", async (req, res) => {
  const event = req.body;

  // Update event
  const query = `
        UPDATE event
        SET title = COALESCE($1, title), description = COALESCE($2, description), is_private = COALESCE($3, is_private), event_tags = COALESCE($4, event_tags), r_rule = COALESCE($5, r_rule), ex_date = COALESCE($6, ex_date), all_day = COALESCE($7, all_day), start_date = COALESCE($8, start_date), end_date =COALESCE($9, end_date)
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

router.post("/invitation", async (req, res) => {
  sender_profile_id = req.auth.payload.sub.replace("|", "_");

  const { event_id, recipient_profile_id } = req.body;
  const query = `
    INSERT INTO event_invitation (event_id, sender_profile_id, recipient_profile_id, status)
    VALUES ($1, $2, $3, 'pending')
  `;
  const values = [event_id, sender_profile_id, recipient_profile_id];

  await pool.query(query, values);

  res.json({ message: "Successfully sent event invitation" });
});

router.put("/invitation", async (req, res) => {
  const { invitation_id, status } = req.body;

  try {
    // Get the invitation
    const { rows } = await pool.query(
      "SELECT * FROM event_invitation WHERE id = $1 LIMIT 1",
      [invitation_id]
    );

    if (rows.length === 0) {
      res.status(404).json({ message: "Invitation not found" });
      return;
    }

    // Check if the authenticated user is the recipient of the invitation
    const recipient_profile_id = req.auth.payload.sub.replace("|", "_");
    if (rows[0].recipient_profile_id !== recipient_profile_id) {
      res.status(403).json({ message: "Not authorized" });
      return;
    }

    // Update the invitation status
    const query = `
      UPDATE event_invitation
      SET status = $1
      WHERE id = $2
    `;
    const values = [status, invitation_id];
    await pool.query(query, values);

    // If the status is "accepted", create the event in the user's calendar
    if (status === "accepted") {
      // Fetch the event data using the event_id provided in the invitation
      const event_id = rows[0].event_id;
      const { rows: eventRows } = await pool.query(
        "SELECT * FROM event WHERE id = $1 LIMIT 1",
        [event_id]
      );

      if (eventRows.length === 0) {
        res.status(404).json({ message: "Event not found" });
        return;
      }

      const event = eventRows[0];
      const group_id = event?.group_id;

      // Get event list for user
      var eventlist = await pool.query(
        `SELECT * FROM event_list 
          WHERE owner_id = '${
            group_id && group_id > 0
              ? `group_${group_id}`
              : recipient_profile_id
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
          group_id && group_id > 0 ? `group_${group_id}` : recipient_profile_id,
        ];
        eventlist = await pool.query(query, values);
      }

      // Create the event
      const query2 = `
        INSERT INTO event (event_list_id, title, description, is_private, event_tags, r_rule, ex_date, all_day, start_date, end_date)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id
      `;
      const values2 = [
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
      ];

      await pool.query(query2, values2);
    }

    res.json({ message: "Invitation updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/invitation", async (req, res) => {
  const recipient_profile_id = req.auth.payload.sub.replace("|", "_");

  const query = `
    SELECT * FROM event_invitation
    WHERE recipient_profile_id = $1 AND status = 'pending'
  `;
  const values = [recipient_profile_id];

  const result = await pool.query(query, values);

  res.json({ invitations: result.rows });
});

module.exports = router;
