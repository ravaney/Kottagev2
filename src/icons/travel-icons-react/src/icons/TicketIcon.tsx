import React from "react";
import { IconBase } from "../IconBase";
import type { TravelIconProps } from "../types";

export function TicketIcon(props: TravelIconProps) {
  return (
    <IconBase {...props}>
      <path fill="var(--travel-icon-primary)" d="M3 7h18v3a2 2 0 0 0 0 4v3H3v-3a2 2 0 0 0 0-4z"/>
      <path fill="var(--travel-icon-light)" d="M13 7h2v10h-2z"/>
      <circle fill="var(--travel-icon-dark)" cx="14" cy="10" r=".7"/>
      <circle fill="var(--travel-icon-dark)" cx="14" cy="14" r=".7"/>
    </IconBase>
  );
}
