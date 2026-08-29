import React from "react";
import { IconBase } from "../IconBase";
import type { TravelIconProps } from "../types";

export function ChatIcon(props: TravelIconProps) {
  return (
    <IconBase {...props}>
      <path fill="var(--travel-icon-primary)" d="M3 5h18v12H9l-5 4v-4H3z"/>
      <circle fill="var(--travel-icon-light)" cx="8" cy="11" r="1.3"/>
      <circle fill="var(--travel-icon-light)" cx="12" cy="11" r="1.3"/>
      <circle fill="var(--travel-icon-light)" cx="16" cy="11" r="1.3"/>
    </IconBase>
  );
}
