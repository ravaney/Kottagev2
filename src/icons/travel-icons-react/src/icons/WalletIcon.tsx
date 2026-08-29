import React from "react";
import { IconBase } from "../IconBase";
import type { TravelIconProps } from "../types";

export function WalletIcon(props: TravelIconProps) {
  return (
    <IconBase {...props}>
      <path fill="var(--travel-icon-dark)" d="M4 5h14a2 2 0 0 1 2 2v12H5a3 3 0 0 1-3-3V7a2 2 0 0 1 2-2z"/>
      <rect fill="var(--travel-icon-primary)" x="4" y="7" width="15" height="11" rx="2"/>
      <path fill="var(--travel-icon-light)" d="M15 11h7v5h-7a2.5 2.5 0 0 1 0-5Z"/>
      <circle fill="var(--travel-icon-dark)" cx="16" cy="13.5" r=".8"/>
    </IconBase>
  );
}
