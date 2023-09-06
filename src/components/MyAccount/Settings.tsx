import { Label, PrimaryButton, Stack } from "@fluentui/react";
import { Paper } from "@mui/material";
import React from "react";
import { Colors } from "../constants";


export default function Settings() {
  return (
    <Paper
      style={{
        padding: "0px 20px",
        borderRadius: "10px",
        color: Colors.offWhite,
        width: "50%",
      }}
    >
      <Stack horizontalAlign="center" verticalAlign="center">
        <Label>Settings</Label>
        <PrimaryButton>Delete Account</PrimaryButton>
      </Stack>
    </Paper>
  );
}
