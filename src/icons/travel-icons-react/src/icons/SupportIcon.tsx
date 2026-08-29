import React from "react";
import { IconBase } from "../IconBase";
import type { TravelIconProps } from "../types";

export function SupportIcon(props: TravelIconProps) {
  return (
    <IconBase {...props}>
      <path fill="var(--travel-icon-primary)" d="M4 11a8 8 0 0 1 16 0v5h-4v-5a4 4 0 0 0-8 0v5H4z"/>
      <rect fill="var(--travel-icon-light)" x="3" y="11" width="4" height="7" rx="2"/>
      <rect fill="var(--travel-icon-light)" x="17" y="11" width="4" height="7" rx="2"/>
      <path fill="var(--travel-icon-dark)" d="M17 18h3c0 2-1.5 3-4.5 3H13v-2h2.5c1 0 1.5-.3 1.5-1Z"/>
    </IconBase>
  );
}
