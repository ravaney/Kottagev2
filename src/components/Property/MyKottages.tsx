import { FontIcon, IconButton, Label, Stack } from "@fluentui/react";
import { Box, Paper } from "@mui/material";
import React from "react";
import { Colors } from "../constants";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { MdOutlineVilla } from "react-icons/md";
import styles from "../../styles/MyKottages.module.css";
import { MdOutlineAddHomeWork } from "react-icons/md";
import { Link, NavLink, Outlet } from "react-router-dom";
import PageHeader from '../common/PageHeader';
import HolidayVillageIcon from '@mui/icons-material/HolidayVillage';

//create a class to style link if active or not
const activeLink = { backgroundColor: "#1a88ff" };

export default function MyKottages() {
  const gap = { childrenGap: 10 };
  return (
    <Box sx={{ width: '100%' }}>
      <PageHeader 
        title="My Properties"
        subtitle="Manage your rental properties and listings"
        icon={<HolidayVillageIcon sx={{ color: Colors.blue, fontSize: 32 }} />}
      />
      <Paper
        style={{
          borderRadius: "10px",
          backgroundColor: Colors.offWhite,
        }}
        sx={{mt:1}}
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
    </Box>
  );
}
