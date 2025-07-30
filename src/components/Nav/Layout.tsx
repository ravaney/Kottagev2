
import NavBar from "./NavBar";
import { Outlet, useLocation } from "react-router-dom";
import BottomNav from "./BottomNav";

export default function Layout() {
  const location = useLocation();
  const isBookRoomPage = location.pathname.includes('/book-room');

  return (
    <div>
      {!isBookRoomPage && <NavBar />}
      <main style={{ minHeight: "100vh" }}>
        <Outlet />
      </main>
      {!isBookRoomPage && <BottomNav />}
    </div>
  );
}
