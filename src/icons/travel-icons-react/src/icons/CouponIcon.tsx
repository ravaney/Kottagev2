import React from "react";
import { IconBase } from "../IconBase";
import type { TravelIconProps } from "../types";

export function CouponIcon(props: TravelIconProps) {
  return (
    <IconBase {...props}>
      <path fill="var(--travel-icon-light)" d="M3 7h18v3a2 2 0 0 0 0 4v3H3v-3a2 2 0 0 0 0-4z"/>
      <path fill="var(--travel-icon-dark)" d="m9 15 6-6 1.4 1.4-6 6z"/>
      <circle fill="var(--travel-icon-primary)" cx="9" cy="9" r="1.5"/>
      <circle fill="var(--travel-icon-primary)" cx="15" cy="15" r="1.5"/>
    </IconBase>
  );
}
