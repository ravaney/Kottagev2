import React from "react";
import { IconBase } from "../IconBase";
import type { TravelIconProps } from "../types";

export function VillaIcon(props: TravelIconProps) {
  return (
    <IconBase {...props}>
      <path fill="var(--travel-icon-light)" d="M4 11.2 12 5l8 6.2V21H4z"/>
      <path fill="var(--travel-icon-primary)" d="M2.2 11.3 12 3.8l9.8 7.5-1.5 2L12 6.9l-8.3 6.4z"/>
      <rect fill="var(--travel-icon-dark)" x="9.5" y="13" width="5" height="8" rx="1"/>
      <path fill="var(--travel-icon-primary)" d="M3.1 9.2C2.5 6 4.1 3.7 7.5 2.8c-.2 2.7-1.8 4.7-4.4 6.4Z"/>
    </IconBase>
  );
}
