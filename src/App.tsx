import React, { useEffect } from "react";
import "./App.css";
import Layout from "./components/Nav/Layout";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import Splash from "./components/Home/Splash";
import Login from "./components/Auth/Login";
import CreateAccount from "./components/Auth/CreateAccount";
import MyAccount from "./components/MyAccount/MyAccount";
import Profile from "./components/MyAccount/Profile";
import Settings from "./components/MyAccount/Settings";
import MyKottages from "./components/MyAccount/MyKottages";
import MyBookings from "./components/MyAccount/MyBookings";
import Favourites from "./components/MyAccount/Favourites";
import { Kottages } from "./components/Kottages";
import PageNotFound from "./components/Nav/PageNotFound";
import ProtectedRoute from "./ProtectedRoute";
import ViewKottages from "./components/Property/ViewKottages";
import AddKottage from "./components/MyAccount/AddKottage";
import AllMyKottages from "./components/MyAccount/AllMyKottages";
import { setIconOptions } from "@fluentui/react";

function App() {
  setIconOptions({ disableWarnings: true });
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <PageNotFound />,

      children: [
        {
          index: true,
          element: <Splash />,
        },
        {
          path: "/Login",
          element: <Login />,
        },
        {
          path: "/CreateAccount",
          element: <CreateAccount />,
        },
        {
          path: "/Kottages",
          element: <Kottages />,
        },
        {
          path: "/Kottages/:id",
          element: <ViewKottages />,
        },
        {
          path: "/MyAccount",
          //use protected route to wrap the element
          element: <ProtectedRoute children={<MyAccount />} />,

          children: [
            {
              element: <Navigate to="/MyAccount/Profile" />,
              index: true,
            },
            {
              path: "/MyAccount/Profile",
              element: <Profile />,
              index: true,
            },
            {
              path: "/MyAccount/MyKottages",
              element: <MyKottages />,
              children: [
                {
                  index: true,
                  element: <AllMyKottages />,
                },
                {
                  path: "/MyAccount/MyKottages/Home",
                  index: true,
                  element: <AllMyKottages />,
                },
                {
                  path: "/MyAccount/MyKottages/AddKottage",
                  element: <AddKottage />,
                },
              ],
            },
            {
              path: "/MyAccount/MyBookings",
              element: <MyBookings />,
            },
            {
              path: "/MyAccount/Favourites",
              element: <Favourites />,
            },
            {
              path: "/MyAccount/Settings",
              element: <Settings />,
            },
          ],
        },
      ],
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
