import React, { useEffect } from "react";
import "./App.css";
import Layout from "./components/Nav/Layout";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { getSubdomain, isSubdomain } from "./utils/subdomainRouter";
import Splash from "./components/Home/Splash";
import Login from "./components/Auth/Login";
import CreateAccount from "./components/Auth/CreateAccount";
import MyAccount from "./components/MyAccount/MyAccount";
import Profile from "./components/MyAccount/Profile";
import Settings from "./components/MyAccount/Settings";
import MyKottages from "./components/Property/MyKottages";
import MyBookings from "./components/Property/Reservations/MyBookings";
import Favourites from "./components/MyAccount/Favourites";
import { Kottages } from "./components/Kottages";
import PageNotFound from "./components/Nav/PageNotFound";
import ProtectedRoute from "./ProtectedRoute";
import ViewKottages from "./components/Property/ViewKottages";
import AddKottage from "./components/Property/AddKottage";
import AllMyKottages from "./components/Property/AllMyKottages";
import { setIconOptions } from "@fluentui/react";
import { QueryProvider } from "./providers/QueryProvider";
import ManageProperty from "./components/Property/ManageProperty";
import DashboardMenu from "./components/Dashboard/DashboardMenu";
import Dashboard from "./components/Dashboard/Dashboard";
import ActionCenter from "./components/Dashboard/ActionCenter";
import Messages from "./components/Dashboard/Messages";
import ManageReservations from "./components/Dashboard/ManageReservations";
import PropertyManagement from "./components/Dashboard/PropertyManagement";
import Explore from "./components/Property/Explore";
import AdminLanding from "./components/Admin/AdminLanding";
import SubdomainSimulator from "./components/Admin/SubdomainSimulator";

function App() {
  setIconOptions({ disableWarnings: true });
  
  // Check if we're on the admin subdomain
  const isAdminSite = isSubdomain('admin');
  
  // Create different routers based on subdomain
  const mainRouter = createBrowserRouter([
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
          path: "/explore",
          element: <Explore />,
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
              element: <Navigate to="/MyAccount/Dashboard" />,
              index: true,
            },
            {
              path: "/MyAccount/Dashboard",
              element: <DashboardMenu />,
              children: [
                {
                  index: true,
                  element: <Dashboard />,
                },
                {
                  path: "action-center",
                  element: <ActionCenter />,
                },
                {
                  path: "messages",
                  element: <Messages />,
                },
                {
                  path: "reservations",
                  element: <ManageReservations />,
                },
                {
                  path: "properties",
                  element: <PropertyManagement />,
                },
              ],
            },
            {
              path: "/MyAccount/Profile",
              element: <Profile />,
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
                {
                  path: "/MyAccount/MyKottages/ManageProperty/:propertyName",
                  element: <ManageProperty />,
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

  // Create admin router for admin subdomain
  const adminRouter = createBrowserRouter([
    {
      path: "*",
      element: <AdminLanding />,
      errorElement: <PageNotFound />
    }
  ]);

  // Select the appropriate router based on subdomain
  const router = isAdminSite ? adminRouter : mainRouter;

  return (
    <QueryProvider>
      <RouterProvider router={router} />
      {process.env.NODE_ENV === 'development' && <SubdomainSimulator />}
    </QueryProvider>
  );
}

export default App;
