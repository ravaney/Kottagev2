import React from "react";
import { IconBase } from "../IconBase";
import type { TravelIconProps } from "../types";

export function WifiIcon(props: TravelIconProps) {
  return (
    <IconBase {...props}>
      <path fill="var(--travel-icon-primary)" d="M3.5 9.5a12 12 0 0 1 17 0l-1.8 1.8a9.5 9.5 0 0 0-13.4 0z"/>
      <path fill="var(--travel-icon-light)" d="M7 13a7 7 0 0 1 10 0l-1.8 1.8a4.5 4.5 0 0 0-6.4 0z"/>
      <circle fill="var(--travel-icon-dark)" cx="12" cy="18" r="2"/>
    </IconBase>
  );
}
