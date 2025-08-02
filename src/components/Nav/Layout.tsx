import NavBar from './NavBar';
import { Outlet, useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';

export default function Layout() {
  const location = useLocation();
  const isBookRoomPage = location.pathname.includes('/book-room') || location.pathname.includes('/booking-confirmation');

  return (
    <div>
      {!isBookRoomPage && <NavBar />}
      <main style={{ minHeight: !isBookRoomPage ? 'calc(100vh - 64px)' : '100vh', paddingTop: !isBookRoomPage ? '64px' : '0' }}>
        <Outlet />
      </main>
      {!isBookRoomPage && <BottomNav />}
    </div>
  );
}
