import React from "react";
import { IconBase } from "../IconBase";
import type { TravelIconProps } from "../types";

export function ClockIcon(props: TravelIconProps) {
  return (
    <IconBase {...props}>
      <circle fill="var(--travel-icon-light)" cx="12" cy="12" r="10"/>
      <circle fill="white" cx="12" cy="12" r="7"/>
      <path fill="var(--travel-icon-dark)" d="M11 6h2v6.3l4 2.3-1 1.8-5-2.9z"/>
    </IconBase>
  );
}
