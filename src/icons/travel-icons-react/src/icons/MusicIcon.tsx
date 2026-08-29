import React from "react";
import { IconBase } from "../IconBase";
import type { TravelIconProps } from "../types";

export function MusicIcon(props: TravelIconProps) {
  return (
    <IconBase {...props}>
      <path fill="var(--travel-icon-primary)" d="M9 6v10.3a3.3 3.3 0 1 1-2-3V8l11-2v8.3a3.3 3.3 0 1 1-2-3V4z"/>
      <path fill="var(--travel-icon-light)" d="m9 6 9-2v3L9 9z"/>
    </IconBase>
  );
}
