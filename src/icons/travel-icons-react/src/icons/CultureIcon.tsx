import React from "react";
import { IconBase } from "../IconBase";
import type { TravelIconProps } from "../types";

export function CultureIcon(props: TravelIconProps) {
  return (
    <IconBase {...props}>
      <path fill="var(--travel-icon-primary)" d="m12 3 10 5H2z"/>
      <path fill="var(--travel-icon-light)" d="M4 9h16v9H4z"/>
      <rect fill="var(--travel-icon-dark)" x="6" y="9" width="2" height="9"/>
      <rect fill="var(--travel-icon-dark)" x="11" y="9" width="2" height="9"/>
      <rect fill="var(--travel-icon-dark)" x="16" y="9" width="2" height="9"/>
      <path fill="var(--travel-icon-primary)" d="M2 19h20v2H2z"/>
    </IconBase>
  );
}
