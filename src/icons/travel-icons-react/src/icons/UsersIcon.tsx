import React from "react";
import { IconBase } from "../IconBase";
import type { TravelIconProps } from "../types";

export function UsersIcon(props: TravelIconProps) {
  return (
    <IconBase {...props}>
      <circle fill="var(--travel-icon-primary)" cx="9" cy="8" r="3.2"/>
      <circle fill="var(--travel-icon-light)" cx="16.5" cy="9" r="2.7"/>
      <path fill="var(--travel-icon-primary)" d="M3 21c.4-5 2.4-7 6-7s5.6 2 6 7z"/>
      <path fill="var(--travel-icon-light)" d="M14 15.5c4.1-.5 6.5 1.4 7 5.5h-5.2c-.2-2.2-.8-4-1.8-5.5Z"/>
    </IconBase>
  );
}
