import React from "react";
import { IconBase } from "../IconBase";
import type { TravelIconProps } from "../types";

export function FilterIcon(props: TravelIconProps) {
  return (
    <IconBase {...props}>
      <path fill="var(--travel-icon-primary)" d="M3 5h18l-7 8v6l-4 2v-8z"/>
      <path fill="var(--travel-icon-light)" d="M16 14h5v2h-5zM16 18h3v2h-3z"/>
    </IconBase>
  );
}
