import React from "react";
import { IconBase } from "../IconBase";
import type { TravelIconProps } from "../types";

export function LiveMusicIcon(props: TravelIconProps) {
  return (
    <IconBase {...props}>
      <rect
        fill="var(--travel-icon-light)"
        x="5.8"
        y="2"
        width="1.8"
        height="5.3"
      />
      <path fill="var(--travel-icon-light)" d="M7.6 2 11 1.2v2L7.6 4z" />
      <circle fill="var(--travel-icon-light)" cx="4.8" cy="7.3" r="2.3" />
      <path
        fill="var(--travel-icon-primary)"
        d="M12.8 11.2c-1.2-1.2-3-1.3-4-.3-.7.7-.8 1.6-.5 2.4-.9-.3-1.9-.1-2.6.6-1.5 1.5-1.1 4.4.9 6.4s4.9 2.4 6.4.9c.7-.7.9-1.7.6-2.6.8.3 1.8.2 2.4-.5 1-1 .9-2.8-.3-4z"
      />
      <path
        fill="var(--travel-icon-primary)"
        d="M13.7 13.2 19.1 7.8l1.8 1.8-5.4 5.4z"
      />
      <path
        fill="var(--travel-icon-dark)"
        d="m18.6 7.6 2.1-2.3L23 7.6l-2.3 2.1z"
      />
      <path
        fill="var(--travel-icon-light)"
        d="m7.8 18.1.7-.7L21.3 4.6l.7.7L9.2 18.8z"
      />
      <circle fill="var(--travel-icon-dark)" cx="11.2" cy="15.6" r="1.45" />
    </IconBase>
  );
}
