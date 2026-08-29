import React from "react";
import { IconBase } from "../IconBase";
import type { TravelIconProps } from "../types";

export function RestaurantIcon(props: TravelIconProps) {
  return (
    <IconBase {...props}>
      <path fill="var(--travel-icon-primary)" d="M4 3h2v7H4zM8 3h2v7H8z"/>
      <path fill="var(--travel-icon-dark)" d="M5.9 8h2v13h-2z"/>
      <path fill="var(--travel-icon-light)" d="M15 3c3.4 1.3 5 4.2 5 7.5 0 2-1.1 3.4-3 4V21h-2z"/>
    </IconBase>
  );
}
