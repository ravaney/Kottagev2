import React from "react";
import { IconBase } from "../IconBase";
import type { TravelIconProps } from "../types";

export function BellIcon(props: TravelIconProps) {
  return (
    <IconBase {...props}>
      <path fill="var(--travel-icon-light)" d="M6 10a6 6 0 1 1 12 0v5l2 3H4l2-3z"/>
      <path fill="var(--travel-icon-primary)" d="M9 19h6a3 3 0 0 1-6 0Z"/>
    </IconBase>
  );
}
