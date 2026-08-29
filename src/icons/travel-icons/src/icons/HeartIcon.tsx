import React from "react";
import { IconBase } from "../IconBase";
import type { TravelIconProps } from "../types";

export function HeartIcon(props: TravelIconProps) {
  return (
    <IconBase {...props}>
      <path
        fill="var(--travel-icon-light)"
        fillRule="evenodd"
        d="M 5.000 21.419 L 5.000 26.527 L 5.730 26.527 L 5.730 21.419 Z M 42.946 8.284 L 42.946 9.014 L 46.595 9.014 L 46.595 8.284 Z M 18.135 8.284 L 18.135 9.014 L 22.514 9.014 L 22.514 8.284 Z"
      />
      <path
        fill="var(--travel-icon-primary)"
        fillRule="evenodd"
        d=""
      />
      <path
        fill="var(--travel-icon-dark)"
        fillRule="evenodd"
        d="M 13.757 11.203 L 8.649 15.581 L 6.459 21.419 L 6.459 27.257 L 7.189 27.986 L 7.919 31.635 L 12.297 38.203 L 21.784 47.689 L 22.514 47.689 L 26.162 51.338 L 31.270 54.986 L 33.459 54.986 L 41.486 49.149 L 53.892 36.743 L 56.811 32.365 L 56.811 30.905 L 58.270 27.986 L 58.270 19.959 L 57.541 19.230 L 57.541 17.770 L 52.432 11.932 L 46.595 9.743 L 40.027 10.473 L 37.108 11.932 L 32.730 16.311 L 32.000 16.311 L 29.081 12.662 L 25.432 10.473 L 18.865 9.743 L 18.135 10.473 Z"
      />
    </IconBase>
  );
}
