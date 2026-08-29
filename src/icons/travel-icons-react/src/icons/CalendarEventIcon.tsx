import React from "react";
import { IconBase } from "../IconBase";
import type { TravelIconProps } from "../types";

export function CalendarEventIcon(props: TravelIconProps) {
  return (
    <IconBase {...props}>
      <rect fill="var(--travel-icon-light)" x="3" y="5" width="18" height="16" rx="3"/>
      <path fill="var(--travel-icon-primary)" d="M3 8h18v3H3z"/>
      <rect fill="var(--travel-icon-dark)" x="7" y="3" width="2.5" height="5" rx="1.25"/>
      <rect fill="var(--travel-icon-dark)" x="14.5" y="3" width="2.5" height="5" rx="1.25"/>
      <path fill="var(--travel-icon-primary)" d="m9.2 15.2 2 2 4-4 1.8 1.8-5.8 5.8-3.8-3.8z"/>
    </IconBase>
  );
}
