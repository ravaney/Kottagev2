import React, { useEffect } from "react";
import { useAppDispatch } from "../../state/hooks";
import { getUserAsync } from "../../state/thunks";
import { auth } from "../../firebase";
import NavBar from "./NavBar";
import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";

export default function Layout() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log(user);
        dispatch(getUserAsync(user.uid));
      }
    });
    return () => unsub();
  }, [dispatch]);

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
