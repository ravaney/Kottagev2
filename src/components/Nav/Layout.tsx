import NavBar from './NavBar';
import { Outlet, useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';

export default function Layout() {
  const location = useLocation();
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

  return (
    <div>
      {!hideNavigation && <NavBar />}
      <main
        style={{
          minHeight: '100vh',
          paddingTop: !hideNavigation ? '64px' : '0',
        }}
      >
        <Outlet />
      </main>
      {!hideNavigation && <BottomNav />}
    </div>
  );
}
