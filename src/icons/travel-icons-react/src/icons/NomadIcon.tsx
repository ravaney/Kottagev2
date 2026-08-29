import React from "react";
import { IconBase } from "../IconBase";
import type { TravelIconProps } from "../types";

export function NomadIcon(props: TravelIconProps) {
  return (
    <IconBase {...props}>
      <circle fill="var(--travel-icon-primary)" cx="8" cy="8" r="3"/>
      <path fill="var(--travel-icon-primary)" d="M3 20c.5-4 2.2-6 5-6 1.5 0 2.7.5 3.5 1.3L10 20z"/>
      <rect fill="var(--travel-icon-light)" x="10" y="12" width="11" height="7" rx="1.5"/>
      <path fill="var(--travel-icon-dark)" d="M12 19h7v1H12z"/>
    </IconBase>
  );
}
