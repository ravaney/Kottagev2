import { FontIcon, IconButton, Label, Stack } from "@fluentui/react";
import { Paper } from "@mui/material";
import React from "react";
import { Colors } from "../constants";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { MdOutlineVilla } from "react-icons/md";
import styles from "../../styles/MyKottages.module.css";
import { MdOutlineAddHomeWork } from "react-icons/md";
import { Link, NavLink, Outlet } from "react-router-dom";

//create a class to style link if active or not
const activeLink = { backgroundColor: "#1a88ff" };

export default function MyKottages() {
  const gap = { childrenGap: 10 };
  return (
    <Paper
      style={{
        borderRadius: "10px",
        backgroundColor: Colors.offWhite,
        // width: "100%",
      }}
    >
      <Stack
        horizontalAlign="space-between"
        horizontal
        style={{ padding: "10px 0px", backgroundColor: Colors.blue }}
        tokens={gap}
      >
        <nav>
          <NavLink
            className={({ isActive }) =>
              isActive ? styles.active : styles.navLink
            }
            to="/MyAccount/MyKottages"
          >
            <MdOutlineVilla /> My Kottages
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? styles.active : styles.navLink
            }
            to="/MyAccount/MyKottages/AddKottage"
          >
            <MdOutlineAddHomeWork /> Add Kottage
          </NavLink>
        </nav>
      </Stack>
      <Outlet />
    </Paper>
  );
}
