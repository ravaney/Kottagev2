import React from "react";
import { IconBase } from "../IconBase";
import type { TravelIconProps } from "../types";

export function MapPinIcon(props: TravelIconProps) {
  return (
    <IconBase {...props}>
      <path fill="var(--travel-icon-primary)" d="M12 3a7 7 0 0 1 7 7c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 7-7Z"/>
      <circle fill="var(--travel-icon-light)" cx="12" cy="10" r="3"/>
    </IconBase>
  );
}
