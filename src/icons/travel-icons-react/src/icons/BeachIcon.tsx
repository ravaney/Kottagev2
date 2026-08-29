import React from "react";
import { IconBase } from "../IconBase";
import type { TravelIconProps } from "../types";

export function BeachIcon(props: TravelIconProps) {
  return (
    <IconBase {...props}>
      <path fill="var(--travel-icon-primary)" d="M12 9c-3.7 0-6.4 1.5-8.5 4.5 4.2-1 6.7-.8 8.5 1z"/>
      <path fill="var(--travel-icon-light)" d="M12 9c3.7 0 6.4 1.5 8.5 4.5-4.2-1-6.7-.8-8.5 1z"/>
      <path fill="var(--travel-icon-dark)" d="M11 9h2v11h-2z"/>
      <path fill="var(--travel-icon-light)" d="M4 19h16v2H4z"/>
    </IconBase>
  );
}
