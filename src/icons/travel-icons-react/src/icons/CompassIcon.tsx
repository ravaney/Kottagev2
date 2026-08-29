import React from "react";
import { IconBase } from "../IconBase";
import type { TravelIconProps } from "../types";

export function CompassIcon(props: TravelIconProps) {
  return (
    <IconBase {...props}>
      <circle fill="var(--travel-icon-light)" cx="12" cy="12" r="10"/>
      <circle fill="white" cx="12" cy="12" r="7"/>
      <path fill="var(--travel-icon-primary)" d="m15.8 8.2-2.2 5.4-5.4 2.2 2.2-5.4z"/>
      <path fill="var(--travel-icon-dark)" d="m15.8 8.2-5.4 2.2 3.2 3.2z"/>
    </IconBase>
  );
}
