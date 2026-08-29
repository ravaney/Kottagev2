import React from "react";
import { IconBase } from "../IconBase";
import type { TravelIconProps } from "../types";

export function NightlifeIcon(props: TravelIconProps) {
  return (
    <IconBase {...props}>
      <path fill="var(--travel-icon-primary)" d="M16.8 17.3A8.5 8.5 0 0 1 8 4a9 9 0 1 0 8.8 13.3Z"/>
      <path fill="var(--travel-icon-light)" d="m18 5 .8 2 2.2.8-2.2.8-.8 2-.8-2-2.2-.8 2.2-.8z"/>
    </IconBase>
  );
}
