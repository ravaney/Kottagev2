import React from "react";
import { IconBase } from "../IconBase";
import type { TravelIconProps } from "../types";

export function PaymentCardIcon(props: TravelIconProps) {
  return (
    <IconBase {...props}>
      <rect fill="var(--travel-icon-light)" x="3" y="5" width="18" height="14" rx="2"/>
      <path fill="var(--travel-icon-dark)" d="M3 8h18v4H3z"/>
      <rect fill="var(--travel-icon-primary)" x="6" y="15" width="5" height="2" rx="1"/>
    </IconBase>
  );
}
