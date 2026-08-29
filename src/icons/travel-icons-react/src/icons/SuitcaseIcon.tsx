import React from "react";
import { IconBase } from "../IconBase";
import type { TravelIconProps } from "../types";

export function SuitcaseIcon(props: TravelIconProps) {
  return (
    <IconBase {...props}>
      <rect fill="var(--travel-icon-primary)" x="5" y="7" width="14" height="14" rx="2"/>
      <path fill="var(--travel-icon-dark)" d="M9 7V4h6v3h-2V6h-2v1z"/>
      <rect fill="var(--travel-icon-light)" x="8" y="10" width="2" height="7" rx="1"/>
      <rect fill="var(--travel-icon-light)" x="14" y="10" width="2" height="7" rx="1"/>
    </IconBase>
  );
}
