import React from "react";
import { IconBase } from "../IconBase";
import type { TravelIconProps } from "../types";

export function HomeIcon(props: TravelIconProps) {
  return (
    <IconBase {...props}>
      <path fill="var(--travel-icon-light)" d="M5 10.5 12 5l7 5.5V21H5z"/>
      <path fill="var(--travel-icon-primary)" d="M2.5 10.7 12 3.2l9.5 7.5-1.6 2L12 6.5l-7.9 6.2z"/>
      <rect fill="var(--travel-icon-dark)" x="9.5" y="13" width="5" height="8" rx="1"/>
    </IconBase>
  );
}
