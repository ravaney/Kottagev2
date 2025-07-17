import { Label, PrimaryButton, Stack } from "@fluentui/react";
import { Box, Paper } from "@mui/material";
import React from "react";
import { Colors } from "../constants";
import PageHeader from '../common/PageHeader';
import SettingsIcon from '@mui/icons-material/Settings';


export default function Settings() {
  return (
    <Box sx={{ width: '100%' }}>
      <PageHeader 
        title="Settings"
        subtitle="Configure your account preferences"
        icon={<SettingsIcon sx={{ color: Colors.blue, fontSize: 32 }} />}
      />
      <Paper
        style={{
          
          borderRadius: "10px",
          color: Colors.offWhite,
          
        }}
        sx={{mt:1}}
      >
      <Stack horizontalAlign="center" verticalAlign="center">
        <Label>Settings</Label>
        <PrimaryButton>Delete Account</PrimaryButton>
      </Stack>
    </Paper>
    </Box>
  );
}
