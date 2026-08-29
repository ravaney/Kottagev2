import React from "react";
import { IconBase } from "../IconBase";
import type { TravelIconProps } from "../types";

export function SearchIcon(props: TravelIconProps) {
  return (
    <IconBase {...props}>
      <circle fill="var(--travel-icon-light)" cx="10.5" cy="10.5" r="7.5"/>
      <circle fill="white" cx="10.5" cy="10.5" r="4.8"/>
      <path fill="var(--travel-icon-dark)" d="m15.6 14.2 5.2 5.2-1.8 1.8-5.2-5.2z"/>
    </IconBase>
  );
}
