import React from "react";
import { IconBase } from "../IconBase";
import type { TravelIconProps } from "../types";

export function PlaneIcon(props: TravelIconProps) {
  return (
    <IconBase {...props}>
      <path fill="var(--travel-icon-primary)" d="m2.5 14.5 19-9-4.2 11-4.2-2.3-3.2 5.3-2.2-1 1.8-6.5z"/>
      <path fill="var(--travel-icon-light)" d="m9.5 12 8-3.8-4.4 6z"/>
    </IconBase>
  );
}
