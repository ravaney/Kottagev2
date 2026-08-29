import React from "react";
import { IconBase } from "../IconBase";
import type { TravelIconProps } from "../types";

export function MapIcon(props: TravelIconProps) {
  return (
    <IconBase {...props}>
      <path fill="var(--travel-icon-light)" d="m3 6 6-3v15l-6 3z"/>
      <path fill="var(--travel-icon-primary)" d="m9 3 6 3v15l-6-3z"/>
      <path fill="var(--travel-icon-dark)" d="m15 6 6-3v15l-6 3z"/>
    </IconBase>
  );
}
