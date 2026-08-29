import React from "react";
import { IconBase } from "../IconBase";
import type { TravelIconProps } from "../types";

export function FamilyIcon(props: TravelIconProps) {
  return (
    <IconBase {...props}>
      <circle fill="var(--travel-icon-primary)" cx="8" cy="8" r="3"/>
      <circle fill="var(--travel-icon-light)" cx="16" cy="8" r="3"/>
      <circle fill="var(--travel-icon-dark)" cx="12" cy="14" r="2.5"/>
      <path fill="var(--travel-icon-primary)" d="M3 21c.4-5 2.2-7 5-7 1.2 0 2.2.3 3 .9C8.9 16 8 18 7.7 21z"/>
      <path fill="var(--travel-icon-light)" d="M21 21c-.4-5-2.2-7-5-7-1.2 0-2.2.3-3 .9 2.1 1.1 3 3.1 3.3 6.1z"/>
      <path fill="var(--travel-icon-dark)" d="M8 21c.4-4 1.6-5.5 4-5.5s3.6 1.5 4 5.5z"/>
    </IconBase>
  );
}
