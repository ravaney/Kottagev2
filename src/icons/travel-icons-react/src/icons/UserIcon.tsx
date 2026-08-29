import React from "react";
import { IconBase } from "../IconBase";
import type { TravelIconProps } from "../types";

export function UserIcon(props: TravelIconProps) {
  return (
    <IconBase {...props}>
      <circle fill="var(--travel-icon-primary)" cx="12" cy="8" r="4"/>
      <path fill="var(--travel-icon-light)" d="M4 21c.7-5 3.4-7 8-7s7.3 2 8 7z"/>
    </IconBase>
  );
}
