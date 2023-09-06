import { Stack } from "@fluentui/react";
import React from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function MyAccount() {
  const gap = { childrenGap: 50 };
  return (
    <>
      <Stack
        style={{ height: "100%", padding: "50px 15px" }}
        horizontal
        horizontalAlign="start"
        tokens={gap}
      >
        <Sidebar />
        <Outlet />
      </Stack>
    </>
  );
}
