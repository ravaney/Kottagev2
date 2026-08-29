import React from "react";
import { IconBase } from "../IconBase";
import type { TravelIconProps } from "../types";

export function PoolIcon(props: TravelIconProps) {
  return (
    <IconBase {...props}>
      <path fill="var(--travel-icon-dark)" d="M6 4h2v8H6zM10 4h2v8h-2z"/>
      <path fill="var(--travel-icon-primary)" d="M6 7h6v2H6z"/>
      <path fill="var(--travel-icon-light)" d="M3 14c1.5-1 3-.9 4.5 0s3 .9 4.5 0 3-.9 4.5 0 3 .9 4.5 0v2c-1.5.9-3 .9-4.5 0s-3-.9-4.5 0-3 .9-4.5 0S4.5 15 3 16z"/>
      <path fill="var(--travel-icon-primary)" d="M3 18c1.5-1 3-.9 4.5 0s3 .9 4.5 0 3-.9 4.5 0 3 .9 4.5 0v2c-1.5.9-3 .9-4.5 0s-3-.9-4.5 0-3 .9-4.5 0S4.5 19 3 20z"/>
    </IconBase>
  );
}
