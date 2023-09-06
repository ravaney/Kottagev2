import { Label, PrimaryButton, Stack, Text, TextField } from "@fluentui/react";
import { IconButton, Paper, Typography } from "@mui/material";
import React, { useRef } from "react";
import { Colors } from "../constants";
import { useUserState } from "../../state/userSlice";
import Address from "./Address";
import LockIcon from "@mui/icons-material/Lock";
import { FaCcMastercard } from "react-icons/fa";

export default function Profile() {
  const { user } = useUserState();
  const phone = useRef("");
  const email = useRef("");
  const gap = { childrenGap: 10 };
  const gap20 = { childrenGap: 20 };
  const gap30 = { childrenGap: 30 };
  return (
    <Paper
      style={{
        padding: "20px 20px",
        borderRadius: "10px",
        backgroundColor: Colors.offWhite,
      }}
    >
      <Typography variant="h6" color="black">
        Personal Information
      </Typography>
      <Stack tokens={gap30} style={{ paddingTop: "20px" }}>
        <Stack tokens={gap20} horizontal>
          <Stack style={{ width: "200px" }}>
            <Text>
              Update your personal information here. Your data is kept
              confidential and secured
            </Text>
          </Stack>
          <Stack tokens={gap}>
            <Stack horizontal tokens={gap20}>
              <Label>{user?.firstName}</Label>
              <Label>{user?.lastName}</Label>
            </Stack>
            <Stack style={{ width: "200px" }}>
              <Label>Birthday: {user?.dob}</Label>
              <TextField
                type="tel"
                label="Phone Number"
                placeholder={user?.phoneNumber}
                defaultValue={user?.phoneNumber}
              />
            </Stack>
          </Stack>
        </Stack>
        <Stack horizontal tokens={gap20} verticalAlign="end">
          <Stack style={{ width: "200px" }}>
            <Label>Email address</Label>
            <Text>
              Update your email address. You must re-authenticate to confirm
              changes
            </Text>
          </Stack>
          <Stack style={{ width: "200px" }} tokens={gap}>
            <TextField
              style={{ width: "200px" }}
              label="Email"
              defaultValue={user?.email}
            />
            <PrimaryButton text="Save" />
          </Stack>
        </Stack>

        <Stack horizontal tokens={gap20} verticalAlign="end">
          <Label style={{ width: "200px" }}>Home Address</Label>
          <Stack>
            <Address />
          </Stack>
        </Stack>
        <Stack horizontal tokens={gap20}>
          <Stack horizontal verticalAlign="center" style={{ width: "200px" }}>
            <Label>Password</Label>
          </Stack>
          <Stack
            horizontalAlign="start"
            style={{ width: "200px", cursor: "pointer" }}
          >
            <IconButton>
              <LockIcon color="warning" />
              <Label style={{ cursor: "pointer" }}>Change Password</Label>
            </IconButton>
          </Stack>
        </Stack>
      </Stack>
      <Typography variant="h6" color="black">
        Payment Methods
      </Typography>
      <Stack>
        <FaCcMastercard color="black" style={{ fontSize: "32px" }} />
      </Stack>
    </Paper>
  );
}
