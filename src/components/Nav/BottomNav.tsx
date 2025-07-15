import { Label, Stack } from "@fluentui/react";
import React from "react";
import { Link } from "react-router-dom";

type Props = {};

export default function BottomNav({}: Props) {
  const gap20 = { childrenGap: 20 };
  return (
    <Stack
      horizontal
      verticalAlign="start"
      horizontalAlign="space-evenly"
      style={{
        // bottom: 0,
        width: "100%",
        zIndex: 1001,
        padding: "20px 40px",
        backgroundColor: "white",
        minWidth: "350px",
        color: "black",
        position: "relative",
      }}
      tokens={gap20}
    >
      <Label>About</Label>
      <div>Help</div>
      <div>Terms</div>
      <div>Privacy</div>
      <div>Blog</div>
    </Stack>
  );
}
