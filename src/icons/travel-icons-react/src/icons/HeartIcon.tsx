import React from "react";
import { IconBase } from "../IconBase";
import type { TravelIconProps } from "../types";

export function HeartIcon(props: TravelIconProps) {
  return (
    <IconBase {...props}>
      <path fill="var(--travel-icon-primary)" d="M12 21 3.7 13a5.6 5.6 0 0 1 7.9-7.9L12 6l.4-.9a5.6 5.6 0 0 1 7.9 7.9z"/>
    </IconBase>
  );
}
