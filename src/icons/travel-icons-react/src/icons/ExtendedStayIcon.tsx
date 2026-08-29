import React from "react";
import { IconBase } from "../IconBase";
import type { TravelIconProps } from "../types";

export function ExtendedStayIcon(props: TravelIconProps) {
  return (
    <IconBase {...props}>
      <path fill="var(--travel-icon-light)" d="M5 7h14v14H5z"/>
      <path fill="var(--travel-icon-primary)" d="M3 6h18v3H3z"/>
      <rect fill="var(--travel-icon-dark)" x="9" y="14" width="6" height="7" rx="1"/>
      <rect fill="var(--travel-icon-primary)" x="7" y="10" width="3" height="3"/>
      <rect fill="var(--travel-icon-primary)" x="14" y="10" width="3" height="3"/>
    </IconBase>
  );
}
