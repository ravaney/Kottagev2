import React, { useEffect } from "react";
import "./App.css";
import Layout from "./components/Nav/Layout";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import { ChatProvider } from "./contexts/ChatContext";
import { getSubdomain, isSubdomain } from "./utils/subdomainRouter";
import Splash from "./components/Home/Splash";
import SearchPage from "./components/Home/SearchPage";
import Login from "./components/Auth/Login";
import CreateAccount from "./components/Auth/CreateAccount";
import MyAccount from "./components/MyAccount/MyAccount";
import Profile from "./components/MyAccount/Profile";
import Settings from "./components/MyAccount/Settings";
import MyBookings from "./components/Property/Reservations/MyBookings";
import Favourites from "./components/MyAccount/Favourites";
import PageNotFound from "./components/Nav/PageNotFound";
import ProtectedRoute from "./ProtectedRoute";
import ViewKottage from "./components/Property/ViewKottage";
import BookRoom from "./components/Property/Reservations/BookRoom";
import { setIconOptions } from "@fluentui/react";
import { QueryProvider } from "./providers/QueryProvider";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import DashboardMenu from "./components/Dashboard/DashboardMenu";
import Dashboard from "./components/Dashboard/Dashboard";
import { analyticsService } from "./services/analyticsService";
import ManageReservations from "./components/Dashboard/ManageReservations/ManageReservations";
import PropertyManagement from "./components/Dashboard/PropertyManagement/PropertyManagement";
import Explore from "./components/Property/Explore";
import PropertyAnalyticsPage from "./components/Dashboard/PropertyManagement/PropertyAnalyticsPage";
import ManageProperty from "./components/Property/ManageProperty";
// Subdomain-specific imports
import AdminLanding from "./components/Admin/AdminLanding";
import AdminDashboard from "./components/Admin/AdminDashboard";
import RegionalAssignment from "./components/Admin/RegionalAssignment";
import StaffLanding from "./components/Staff/StaffLanding";
import StaffDashboard from "./components/Staff/StaffDashboard";
import ReservationSupport from "./components/Staff/ReservationSupport";
import PropertyVerification from "./components/Staff/PropertyVerification";
import GuestHostManagement from "./components/Staff/GuestHostManagement";
import BookingManagement from "./components/Staff/BookingManagement";
import ReviewModeration from "./components/Staff/ReviewModeration";
import PlatformIntegrity from "./components/Staff/PlatformIntegrity";
import PayoutDispute from "./components/Staff/PayoutDispute";
import SubdomainSimulator from "./components/Admin/SubdomainSimulator";
import CEOAnalytics from "./components/Admin/CEOAnalytics";
import EmployeeManagement from "./components/Admin/EmployeeManagement";
import ProtectedAdminRoute from "./components/Admin/ProtectedAdminRoute";
import ProtectedStaffRoute from "./components/Staff/ProtectedStaffRoute";
import AddProperty from "./components/Dashboard/PropertyManagement/AddProperty";
import Messages from "./components/Dashboard/Messages/Messages";
import ActionCenter from "./components/Dashboard/ActionCenter/ActionCenter";

function App() {
  setIconOptions({ disableWarnings: true });
  
  // Initialize analytics service
  useEffect(() => {
    analyticsService.enableAutoTracking();
    analyticsService.enableBatchTracking();
  }, []);
  
  // Check which subdomain we're on
  const isAdminSite = isSubdomain('admin');
  const isStaffSite = isSubdomain('staff');
  
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
          path: "/search",
          element: <SearchPage />,
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
          path: "/explore",
          element: <Explore />,
        },
        {
          path: "/Kottages/:id",
          element: <ViewKottage />,
        },
        {
          path: "/book-room",
          element: <BookRoom />,
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
                  children: [
                    {
                      path: "add-property",
                      element: <AddProperty />,
                    },
                    {
                      path: "manage/:propertyId",
                      element: <ManageProperty />,
                    },
                  ],
                },
                {
                  path: "analytics/:propertyId",
                  element: <PropertyAnalyticsPage />,
                },
              ],
            },
            {
              path: "/MyAccount/Profile",
              element: <Profile />,
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
      path: "/",
      element: <ProtectedAdminRoute><AdminLanding /></ProtectedAdminRoute>,
      errorElement: <PageNotFound />,
      children: [
        {
          index: true,
          element: <Navigate to="/dashboard" replace />
        },
        {
          path: "dashboard",
          element: <AdminDashboard />
        },
        {
          path: "properties",
          element: <PropertyVerification />
        },
        {
          path: "bookings",
          element: <BookingManagement />
        },
        {
          path: "reservation-support",
          element: <ReservationSupport />
        },
        {
          path: "guests",
          element: <GuestHostManagement />
        },
        {
          path: "review-moderation",
          element: <ReviewModeration />
        },
        {
          path: "platform-integrity",
          element: <PlatformIntegrity />
        },
        {
          path: "payout-dispute",
          element: <PayoutDispute />
        },
        {
          path: "employee-management",
          element: <EmployeeManagement />
        },
        {
          path: "regional-assignment",
          element: <RegionalAssignment />
        },
        {
          path: "analytics",
          element: <CEOAnalytics />
        },
        {
          path: "settings",
          element: <div>Settings (Coming Soon)</div>
        }
      ]
    },
    {
      path: "*",
      element: <Navigate to="/" />
    }
  ]);

  // Create staff router for staff subdomain
  const staffRouter = createBrowserRouter([
    {
      path: "/",
      element: <ProtectedStaffRoute><StaffLanding /></ProtectedStaffRoute>,
      errorElement: <PageNotFound />,
      children: [
        {
          index: true,
          element: <StaffDashboard />
        },
        {
          path: "dashboard",
          element: <StaffDashboard />
        },
        {
          path: "reservation-support",
          element: <ReservationSupport />
        },
        {
          path: "properties",
          element: <PropertyVerification />
        },
        {
          path: "bookings",
          element: <BookingManagement />
        },
        {
          path: "guests",
          element: <GuestHostManagement />
        },
        {
          path: "review-moderation",
          element: <ReviewModeration />
        },
        {
          path: "platform-integrity",
          element: <PlatformIntegrity />
        },
        {
          path: "payout-dispute",
          element: <PayoutDispute />
        },
        {
          path: "settings",
          element: <div>Settings (Coming Soon)</div>
        }
      ]
    },
    {
      path: "*",
      element: <Navigate to="/" />
    }
  ]);

  // Select the appropriate router based on subdomain
  let router = mainRouter;
  if (isAdminSite) {
    router = adminRouter;
  } else if (isStaffSite) {
    router = staffRouter;
  }

  return (
    <QueryProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ChatProvider>
          <RouterProvider router={router} />
          {process.env.NODE_ENV === 'development' && <SubdomainSimulator />}
        </ChatProvider>
      </LocalizationProvider>
    </QueryProvider>
  );
}

export default App;
