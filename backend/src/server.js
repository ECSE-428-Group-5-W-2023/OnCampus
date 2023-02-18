const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { auth } = require("express-oauth2-jwt-bearer");

// Authorization middleware. When used, the Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.
const checkJwt = auth({
  audience: "OnCampus-auth",
  issuerBaseURL: `https://oncampus.us.auth0.com`,
});

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
const port = process.env.PORT;

app.listen(port, console.log(`Listening on port ${port}`));

const exampleRouter = require("./routes/example");
//map routes
app.use("/api/example", exampleRouter);
app.use("/api/example_login_protected", checkJwt, exampleRouter);
app.use("/api/event", checkJwt, require("./routes/event")); // route for events, user needs to have an account to view and get events, therefore login required

