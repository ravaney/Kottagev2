import React from "react";
import { IconBase } from "../IconBase";
import type { TravelIconProps } from "../types";

export function PartyIcon(props: TravelIconProps) {
  return (
    <IconBase {...props}>
      <path fill="var(--travel-icon-primary)" d="m5 20 3-12 8 8z"/>
      <path fill="var(--travel-icon-light)" d="m7.4 10.5 5.9 5.9-2 1-4.6-4.6z"/>
      <circle fill="var(--travel-icon-dark)" cx="16" cy="6" r="1.5"/>
      <circle fill="var(--travel-icon-primary)" cx="20" cy="10" r="1.2"/>
      <rect fill="var(--travel-icon-light)" x="18" y="3" width="2" height="4" rx="1" transform="rotate(35 19 5)"/>
    </IconBase>
  );
}
