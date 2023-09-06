import { Stack } from "@fluentui/react";
import { useUserState } from "../../state/userSlice";
import CommandMenu from "./CommandMenu";
import Menu from "./Menu";
import { Badge } from "@mui/material";
import MailIcon from "@mui/icons-material/Mail";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import { Link } from "react-router-dom";
import { Colors } from "../constants";
import { transcode } from "buffer";
import { IUser } from "../../../public/QuickType";
const NavBar = () => {
  const { user } = useUserState();
  const gap = { childrenGap: 10 };
  return (
    <Stack
      horizontal
      verticalAlign="center"
      horizontalAlign="space-between"
      style={{
        top: 0,
        width: "100%",
        zIndex: 1000,
        padding: "5px 10px",
        backgroundColor: "rgba(249,241,240,0.8)",
        backdropFilter: "blur(5px)",
        minWidth: "350px",
      }}
    >
      <div style={{ width: "250px", padding: "5px 0px 5px 5px" }}>
        <Link to="/">
          <img src="/blue logo.png" alt="logo" height={40} />
        </Link>
      </div>
      <CommandMenu />
      <div style={{ width: "250px", paddingRight: "5px" }}>
        {(user as IUser) ? (
          <Stack
            horizontal
            tokens={gap}
            horizontalAlign="end"
            verticalAlign="center"
          >
            <Badge badgeContent={1} color="primary">
              <MailIcon color="action" />
            </Badge>
            <Badge badgeContent={6} color="secondary">
              <AnnouncementIcon color="action" />
            </Badge>
            <Menu />
          </Stack>
        ) : (
          <Stack
            horizontal
            tokens={gap}
            horizontalAlign="end"
            verticalAlign="center"
          >
            <Link to="/Login">Login</Link>
            <Link to="/CreateAccount">Create Account</Link>
          </Stack>
        )}
      </div>
    </Stack>
  );
};
export default NavBar;
