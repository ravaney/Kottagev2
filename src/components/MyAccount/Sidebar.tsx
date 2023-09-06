import { Label, Stack } from "@fluentui/react";
import React from "react";
import { useUserState } from "../../state/userSlice";
import { Avatar, IconButton } from "@mui/material";
import { auth } from "../../firebase";
import { Colors } from "../constants";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import HolidayVillageIcon from "@mui/icons-material/HolidayVillage";
import LuggageIcon from "@mui/icons-material/Luggage";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SettingsIcon from "@mui/icons-material/Settings";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const { user } = useUserState();
  const gap = { childrenGap: 10 };
  const gap20 = { childrenGap: 20 };
  if (!user) return <div>Loading user...</div>;
  return (
    <Stack style={{ width: "200px", height: "100%" }} tokens={gap20}>
      <Label>
        <Link to={"/"}>Kottage</Link> /{" "}
        <span style={{ color: "blue" }}>My Account</span>
      </Label>
      <Stack
        style={{
          padding: "20px 0px",
          borderRadius: "10px",
        }}
        horizontalAlign="center"
        verticalAlign="center"
      >
        <Avatar
          sx={{ width: 150, height: 150 }}
          src={auth.currentUser?.photoURL as string}
        />
        <Label>{user?.firstName}</Label>
      </Stack>
      <Stack horizontalAlign="start">
        <IconButton style={{ borderRadius: "0px" }}>
          <Link to="/MyAccount/Profile">
            <Stack horizontal verticalAlign="center" tokens={gap}>
              <AccountBoxIcon color="primary" />
              <Label style={{ cursor: "pointer" }}>My Account</Label>
            </Stack>
          </Link>
        </IconButton>
        <IconButton style={{ borderRadius: "0px" }}>
          <Link to="/MyAccount/MyKottages">
            <Stack horizontal verticalAlign="center" tokens={gap}>
              <HolidayVillageIcon color="primary" />
              <Label style={{ cursor: "pointer" }}>My Kottages</Label>
            </Stack>
          </Link>
        </IconButton>
        <IconButton style={{ borderRadius: "0px" }}>
          <Stack horizontal verticalAlign="center" tokens={gap}>
            <LuggageIcon color="primary" />
            <Label style={{ cursor: "pointer" }}>My Bookings</Label>
          </Stack>
        </IconButton>
        <IconButton style={{ borderRadius: "0px" }}>
          <Stack horizontal verticalAlign="center" tokens={gap}>
            <FavoriteIcon color="primary" sx={{ color: Colors.raspberry }} />
            <Label style={{ cursor: "pointer" }}>Favourites</Label>
          </Stack>
        </IconButton>
        <IconButton style={{ borderRadius: "0px" }}>
          <Link to="/MyAccount/Settings">
            <Stack horizontal verticalAlign="center" tokens={gap}>
              <SettingsIcon color="primary" />
              <Label style={{ cursor: "pointer" }}>Settings</Label>
            </Stack>
          </Link>
        </IconButton>
      </Stack>
    </Stack>
  );
}
