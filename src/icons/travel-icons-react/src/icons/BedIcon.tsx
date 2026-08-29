import React from "react";
import { IconBase } from "../IconBase";
import type { TravelIconProps } from "../types";

export function BedIcon(props: TravelIconProps) {
  return (
    <IconBase {...props}>
      <path fill="var(--travel-icon-dark)" d="M3 6h2v15H3zM19 10h2v11h-2z"/>
      <path fill="var(--travel-icon-primary)" d="M5 13h14v6H5z"/>
      <path fill="var(--travel-icon-light)" d="M5 9h6a4 4 0 0 1 4 4H5z"/>
    </IconBase>
  );
}
