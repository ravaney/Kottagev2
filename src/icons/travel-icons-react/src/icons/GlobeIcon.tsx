import React from "react";
import { IconBase } from "../IconBase";
import type { TravelIconProps } from "../types";

export function GlobeIcon(props: TravelIconProps) {
  return (
    <IconBase {...props}>
      <circle fill="var(--travel-icon-primary)" cx="12" cy="12" r="10"/>
      <path fill="var(--travel-icon-light)" d="M3 11h18v2H3z"/>
      <path fill="var(--travel-icon-light)" d="M11 2h2v20h-2z"/>
      <path fill="var(--travel-icon-dark)" d="M12 2c3 3 4.5 6.4 4.5 10S15 19 12 22c-3-3-4.5-6.4-4.5-10S9 5 12 2Zm0 3.3c-1.7 2.1-2.5 4.3-2.5 6.7s.8 4.6 2.5 6.7c1.7-2.1 2.5-4.3 2.5-6.7s-.8-4.6-2.5-6.7Z"/>
    </IconBase>
  );
}
