import React from "react";
import { IconBase } from "../IconBase";
import type { TravelIconProps } from "../types";

export function BusinessIcon(props: TravelIconProps) {
  return (
    <IconBase {...props}>
      <rect fill="var(--travel-icon-primary)" x="3" y="8" width="18" height="12" rx="2"/>
      <path fill="var(--travel-icon-dark)" d="M8 8V5h8v3h-2V7h-4v1z"/>
      <path fill="var(--travel-icon-light)" d="M3 11h18v3H3z"/>
      <rect fill="var(--travel-icon-dark)" x="10" y="12" width="4" height="3" rx=".6"/>
    </IconBase>
  );
}
