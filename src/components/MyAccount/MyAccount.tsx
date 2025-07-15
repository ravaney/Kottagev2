import { Stack } from "@fluentui/react";
import React from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function MyAccount() {
  const gap = { childrenGap: 5 };
  return (
    <>
      <Stack
        style={{ height: "100%", padding: "0px 15px", paddingLeft: "285px" }}
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
