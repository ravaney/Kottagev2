import React from "react";
import { IconBase } from "../IconBase";
import type { TravelIconProps } from "../types";

export function StarIcon(props: TravelIconProps) {
  return (
    <IconBase {...props}>
      <path fill="var(--travel-icon-primary)" d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>
    </IconBase>
  );
}
