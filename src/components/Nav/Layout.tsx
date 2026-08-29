import Box from '@mui/material/Box';
import NavBar from './NavBar';
import { Outlet, useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';
import RouteMetaManager from '../common/RouteMetaManager';

export default function Layout() {
  const location = useLocation();
  const isSearchPage = location.pathname === '/search';
  const isBookRoomPage =
    location.pathname.includes('/book-room') ||
    location.pathname.includes('/booking-confirmation');
  const isAuthPage =
    location.pathname.includes('/Login') ||
    location.pathname.includes('/signup') ||
    location.pathname.includes('/host-login') ||
    location.pathname.includes('/host-signup') ||
    location.pathname.includes('/guest-signup') ||
    location.pathname.includes('/signup-selection') ||
    location.pathname.includes('/CreateAccount') ||
    location.pathname.includes('/login-select');

  const hideNavigation = isBookRoomPage || isAuthPage;
  const hideFooter = hideNavigation || isSearchPage;

  return (
    <div>
      <RouteMetaManager />
      {!hideNavigation && <NavBar />}
      <Box
        component="main"
        sx={{
          minHeight: '100vh',
          ...(isSearchPage && {
            height: '100vh',
            boxSizing: 'border-box',
            overflow: 'hidden',
          }),
          pt: hideNavigation
            ? 0
            : isSearchPage
              ? { xs: '64px', sm: '70px' }
              : { xs: '64px', sm: '70px' },
        }}
      >
        <Outlet />
      </Box>
      {!hideFooter && <BottomNav />}
    </div>
  );
}
