import { IconButton, Menu, MenuItem } from "@mui/material";
import React from "react";
import { Button } from "react-bootstrap";
import { useAppDispatch } from "../../state/hooks";
import { signOutAsync } from "../../state/thunks";
import { auth } from "../../firebase";
import Avatar from "@mui/material/Avatar";
import { useUserState } from "../../state/userSlice";
import { Stack } from "@fluentui/react";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineManageAccounts } from "react-icons/md";
export default function CommandMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(signOutAsync());
    navigate("/");
  };

  const { user } = useUserState();
  return (
    <>
      <IconButton
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        style={{
          color: "black",
          border: "none",
          cursor: "pointer",
          backgroundColor: "transparent",
        }}
      >
        <MdOutlineManageAccounts />
      </IconButton>
      <Menu
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        //close menu after clicking on an item
        onClick={handleClose}
      >
        <Stack
          verticalAlign="center"
          horizontalAlign="center"
          style={{ borderBottom: "1px solid black" }}
        >
          <MenuItem>
            <Avatar src={auth?.currentUser?.photoURL as string} />{" "}
          </MenuItem>
          <MenuItem>{user?.firstName}</MenuItem>
        </Stack>
        <MenuItem>
          <Link to="/MyAccount">My Account</Link>
        </MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </>
  );
}
