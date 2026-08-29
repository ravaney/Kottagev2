import React, { useEffect } from 'react';
import './App.css';
import Layout from './components/Nav/Layout';
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import { ChatProvider } from './contexts/ChatContext';
import { isSubdomain } from './utils/subdomainRouter';
import Splash from './components/Home/Splash';
import SearchPage from './components/Home/SearchPage';
import NomadNetworkPage from './components/Home/NomadNetworkPage';
import EventsPage from './components/Events/EventsPage';
import EventDetailPage from './components/Events/EventDetailPage';
import Login from './components/Auth/Login';
import MyAccount from './components/MyAccount/MyAccount';
import Profile from './components/MyAccount/Profile';
import Settings from './components/MyAccount/Settings';
import Favourites from './components/MyAccount/Favourites';
import TicketsAndCoupons from './components/MyAccount/TicketsAndCoupons';
import PageNotFound from './components/Nav/PageNotFound';
import ProtectedRoute from './ProtectedRoute';
import ViewKottage from './components/Property/ViewKottage';
import BookRoom from './components/Property/Reservations/BookRoom';
import BookingConfirmation from './components/Property/Reservations/BookingConfirmation';
import { setIconOptions } from '@fluentui/react';
import { QueryProvider } from './providers/QueryProvider';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import DashboardMenu from './components/Dashboard/DashboardMenu';
import { analyticsService } from './services/analyticsService';
import ManageReservations from './components/Dashboard/ManageReservations/ManageReservations';
import PropertyManagement from './components/Dashboard/PropertyManagement/PropertyManagement';
import Explore from './components/Property/Explore';
import PropertyAnalyticsPage from './components/Dashboard/PropertyManagement/PropertyAnalyticsPage';
import ManageProperty from './components/Property/ManageProperty';
import AdminLanding from './components/Admin/AdminLanding';
import AdminDashboard from './components/Admin/AdminDashboard';
import RegionalAssignment from './components/Admin/RegionalAssignment';
import StaffLanding from './components/Staff/StaffLanding';
import StaffDashboard from './components/Staff/StaffDashboard';
import ReservationSupport from './components/Staff/ReservationSupport';
import PropertyVerification from './components/Staff/PropertyVerification';
import GuestHostManagement from './components/Staff/GuestHostManagement';
import BookingManagement from './components/Staff/BookingManagement';
import ReviewModeration from './components/Staff/ReviewModeration';
import PlatformIntegrity from './components/Staff/PlatformIntegrity';
import PayoutDispute from './components/Staff/PayoutDispute';
import SubdomainSimulator from './components/Admin/SubdomainSimulator';
import CEOAnalytics from './components/Admin/CEOAnalytics';
import EmployeeManagement from './components/Admin/EmployeeManagement';
import EventManagement from './components/Admin/EventManagement';
import ProtectedAdminRoute from './components/Admin/ProtectedAdminRoute';
import ProtectedStaffRoute from './components/Staff/ProtectedStaffRoute';
import AddProperty from './components/Dashboard/PropertyManagement/AddProperty';
import Messages from './components/Dashboard/Messages/Messages';
import ActionCenter from './components/Dashboard/ActionCenter/ActionCenter';
import HostSignup from './components/Host/HostSignup';
import GuestSignup from './components/Auth/GuestSignup';
import HostLogin from './components/Host/HostLogin';
import ProtectedHostRoute from './components/Auth/ProtectedHostRoute';
import ProtectedHostOnlyRoute from './components/Auth/ProtectedHostOnlyRoute';
import RouterScrollLayout from './components/common/RouterScrollLayout';
import HostLanding from './components/Host/HostLanding';
import HostLayout from './components/Host/HostLayout';
import HostDashboardHome from './components/Host/HostDashboardHome';
import HostRoot from './components/Host/HostRoot';

function App() {
  setIconOptions({ disableWarnings: true });

  useEffect(() => {
    analyticsService.enableAutoTracking();
    analyticsService.enableBatchTracking();
  }, []);

  const isAdminSite = isSubdomain('admin');
  const isStaffSite = isSubdomain('staff');
  const isHostSite = isSubdomain('host');

  const mainRouter = createBrowserRouter([
    {
      element: <RouterScrollLayout />,
      errorElement: <PageNotFound />,
      children: [
        {
          path: '/',
          element: <Layout />,
          errorElement: <PageNotFound />,
          children: [
            {
              index: true,
              element: <Splash />,
            },
            {
              path: '/search',
              element: <SearchPage />,
            },
            {
              path: '/nomad-network',
              element: <NomadNetworkPage />,
            },
            {
              path: '/Events',
              element: <EventsPage />,
            },
            {
              path: '/Events/:eventId',
              element: <EventDetailPage />,
            },
            {
              path: '/Login',
              element: <Login />,
            },
            {
              path: '/signup',
              element: <GuestSignup />,
            },
            {
              path: '/explore',
              element: <Explore />,
            },
            {
              path: '/Kottages/:id',
              element: <ViewKottage />,
            },
            {
              path: '/Kottages/:id/book-room',
              element: <ProtectedRoute children={<BookRoom />} />,
            },
            {
              path: '/booking-confirmation',
              element: <BookingConfirmation />,
            },
            {
              path: '/MyAccount',
              element: <ProtectedRoute children={<MyAccount />} />,
              children: [
                {
                  element: <Navigate to="/MyAccount/Dashboard/myreservations" />,
                  index: true,
                },
                {
                  path: '/MyAccount/Dashboard',
                  element: <DashboardMenu />,
                  children: [
                    {
                      index: true,
                      element: <Navigate to="myreservations" replace />,
                    },
                    {
                      path: 'action-center',
                      element: <ActionCenter />,
                    },
                    {
                      path: 'messages',
                      element: <Messages />,
                    },
                    {
                      path: 'myreservations',
                      element: <ManageReservations />,
                    },
                    {
                      path: 'reservations',
                      element: (
                        <ProtectedHostOnlyRoute>
                          <ManageReservations />
                        </ProtectedHostOnlyRoute>
                      ),
                    },
                  ],
                },
                {
                  path: '/MyAccount/Profile',
                  element: <Profile />,
                },
                {
                  path: '/MyAccount/Favourites',
                  element: <Favourites />,
                },
                {
                  path: '/MyAccount/TicketsAndCoupons',
                  element: <TicketsAndCoupons />,
                },
                {
                  path: '/MyAccount/Settings',
                  element: <Settings />,
                },
              ],
            },
            {
              path: '*',
              element: <PageNotFound />,
            },
          ],
        },
      ],
    },
  ]);

  const adminRouter = createBrowserRouter([
    {
      element: <RouterScrollLayout />,
      errorElement: <PageNotFound />,
      children: [
        {
          path: '/',
          element: (
            <ProtectedAdminRoute>
              <AdminLanding />
            </ProtectedAdminRoute>
          ),
          errorElement: <PageNotFound />,
          children: [
            {
              index: true,
              element: <Navigate to="/dashboard" replace />,
            },
            {
              path: 'dashboard',
              element: <AdminDashboard />,
            },
            {
              path: 'properties',
              element: <PropertyVerification />,
            },
            {
              path: 'bookings',
              element: <BookingManagement />,
            },
            {
              path: 'reservation-support',
              element: <ReservationSupport />,
            },
            {
              path: 'guests',
              element: <GuestHostManagement />,
            },
            {
              path: 'review-moderation',
              element: <ReviewModeration />,
            },
            {
              path: 'platform-integrity',
              element: <PlatformIntegrity />,
            },
            {
              path: 'payout-dispute',
              element: <PayoutDispute />,
            },
            {
              path: 'employee-management',
              element: <EmployeeManagement />,
            },
            {
              path: 'regional-assignment',
              element: <RegionalAssignment />,
            },
            {
              path: 'analytics',
              element: <CEOAnalytics />,
            },
            {
              path: 'events',
              element: <EventManagement />,
            },
            {
              path: 'settings',
              element: <div>Settings (Coming Soon)</div>,
            },
            {
              path: '*',
              element: <PageNotFound />,
            },
          ],
        },
      ],
    },
  ]);

  const staffRouter = createBrowserRouter([
    {
      element: <RouterScrollLayout />,
      errorElement: <PageNotFound />,
      children: [
        {
          path: '/',
          element: (
            <ProtectedStaffRoute>
              <StaffLanding />
            </ProtectedStaffRoute>
          ),
          errorElement: <PageNotFound />,
          children: [
            {
              index: true,
              element: <StaffDashboard />,
            },
            {
              path: 'dashboard',
              element: <StaffDashboard />,
            },
            {
              path: 'reservation-support',
              element: <ReservationSupport />,
            },
            {
              path: 'properties',
              element: <PropertyVerification />,
            },
            {
              path: 'bookings',
              element: <BookingManagement />,
            },
            {
              path: 'guests',
              element: <GuestHostManagement />,
            },
            {
              path: 'review-moderation',
              element: <ReviewModeration />,
            },
            {
              path: 'platform-integrity',
              element: <PlatformIntegrity />,
            },
            {
              path: 'payout-dispute',
              element: <PayoutDispute />,
            },
            {
              path: 'settings',
              element: <div>Settings (Coming Soon)</div>,
            },
            {
              path: '*',
              element: <PageNotFound />,
            },
          ],
        },
      ],
    },
  ]);

  const hostRouter = createBrowserRouter([
    {
      element: <RouterScrollLayout />,
      errorElement: <PageNotFound />,
      children: [
        {
          path: '/',
          element: <HostRoot />,
          errorElement: <PageNotFound />,
        },
        {
          path: '/dashboard',
          element: (
            <ProtectedHostRoute>
              <HostLayout />
            </ProtectedHostRoute>
          ),
          children: [
            {
              index: true,
              element: <HostDashboardHome />,
            },
            {
              path: 'action-center',
              element: <ActionCenter />,
            },
            {
              path: 'messages',
              element: <Messages />,
            },
            {
              path: 'reservations',
              element: <ManageReservations />,
            },
            {
              path: 'properties',
              element: <PropertyManagement />,
              children: [
                {
                  path: 'add-property',
                  element: <AddProperty />,
                },
                {
                  path: 'manage/:propertyId',
                  element: <ManageProperty />,
                },
              ],
            },
            {
              path: 'analytics/:propertyId',
              element: <PropertyAnalyticsPage />,
            },
            {
              path: '*',
              element: <PageNotFound />,
            },
          ],
        },
        {
          path: '/profile',
          element: (
            <ProtectedHostRoute>
              <HostLayout />
            </ProtectedHostRoute>
          ),
          children: [
            {
              index: true,
              element: <Profile />,
            },
          ],
        },
        {
          path: '/settings',
          element: (
            <ProtectedHostRoute>
              <HostLayout />
            </ProtectedHostRoute>
          ),
          children: [
            {
              index: true,
              element: <Settings />,
            },
          ],
        },
        {
          path: '/landing',
          element: <HostLanding />,
        },
        {
          path: '/signup',
          element: <HostSignup />,
        },
        {
          path: '/login',
          element: <HostLogin />,
        },
        {
          path: '*',
          element: <PageNotFound />,
        },
      ],
    },
  ]);

  let router = mainRouter;
  if (isAdminSite) {
    router = adminRouter;
  } else if (isStaffSite) {
    router = staffRouter;
  } else if (isHostSite) {
    router = hostRouter;
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
