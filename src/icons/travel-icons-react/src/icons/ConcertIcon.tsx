import React from "react";
import { IconBase } from "../IconBase";
import type { TravelIconProps } from "../types";

export function ConcertIcon(props: TravelIconProps) {
  return (
    <IconBase {...props}>
      <path fill="var(--travel-icon-light)" d="M5 18h14v2H5z"/>
      <path fill="var(--travel-icon-primary)" d="M7 18v-6c0-4 2.2-6.5 5-6.5s5 2.5 5 6.5v6h-2.8v-6c0-2.7-1-4-2.2-4s-2.2 1.3-2.2 4v6z"/>
      <circle fill="var(--travel-icon-dark)" cx="12" cy="11" r="2.5"/>
      <circle fill="var(--travel-icon-primary)" cx="6" cy="18" r="2"/>
      <circle fill="var(--travel-icon-primary)" cx="18" cy="18" r="2"/>
    </IconBase>
  );
}
