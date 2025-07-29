
import NavBar from "./NavBar";
import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";

export default function Layout() {


  return (
    <div>
      <NavBar />
      <main style={{ minHeight: "100vh" }}>
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
