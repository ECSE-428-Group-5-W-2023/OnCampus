import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Root from "./routes/Root";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./routes/Home";
import ErrorPage from "./routes/Error";
import { Auth0Provider } from "@auth0/auth0-react";
import Schedule from "./components/Schedule/Schedule";

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
      }
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root")
);
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
