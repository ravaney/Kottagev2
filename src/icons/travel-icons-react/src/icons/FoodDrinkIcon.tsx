import React from "react";
import { IconBase } from "../IconBase";
import type { TravelIconProps } from "../types";

export function FoodDrinkIcon(props: TravelIconProps) {
  return (
    <IconBase {...props}>
      <path fill="var(--travel-icon-primary)" d="M4 5h7l-1 13H5z"/>
      <path fill="var(--travel-icon-light)" d="M5.2 9h4.6l-.5 7H5.8z"/>
      <path fill="var(--travel-icon-dark)" d="M8 2h2l-1 5H7z"/>
      <path fill="var(--travel-icon-primary)" d="M13 11h8c0 4.4-1.7 7-4 7s-4-2.6-4-7Z"/>
      <path fill="var(--travel-icon-light)" d="M14.5 10c.9-1.7 2.1-2.6 3.7-2.8-.2 1.8-1.4 2.8-3.7 2.8Z"/>
    </IconBase>
  );
}
