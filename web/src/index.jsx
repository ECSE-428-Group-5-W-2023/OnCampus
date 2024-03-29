import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Root from "./routes/Root";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./routes/Home";
import ErrorPage from "./routes/Error";
import { Auth0Provider } from "@auth0/auth0-react";
import Schedule from "./components/Schedule/Schedule";
import AccountInfo from "./components/Auth/AccountInfo";
import Friendship from "./components/Friendship/Friendship";
import FriendGroup from "./components/FriendGroup/FriendGroup";
import FriendRequests from "./components/Friendship/FriendRequests";
import FriendSchedule from "./components/Friendship/FriendSchedule";
import ViewInvitations from "./components/Schedule/ViewInvitations";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Home /> },
      {
        path: "/schedule",
        element: <Schedule />,
      },
      {
        path: "/account",
        element: <AccountInfo />,
      },
      {
        path: "/friendship",
        element: <Friendship />,
      },
      {
        path: "/friendGroup",
        element: <FriendGroup />,
      },
      {
        path: "/friendrequests",
        element: <FriendRequests />,
      },
      {
        path: "/friendSchedule",
        element: <FriendSchedule />,
      },
      {
        path: "/invites",
        element: <ViewInvitations />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Auth0Provider
    audience="OnCampus-auth"
    domain="oncampus.us.auth0.com"
    clientId="oPWwhgQhJdDj0xMknB2oSnhKQChVKMEY"
    redirectUri={window.location.origin}
  >
    <React.StrictMode>
      <div className="font-mono">
        <RouterProvider router={router} />
      </div>
    </React.StrictMode>
  </Auth0Provider>
);
