import React from "react";
import type { CSSProperties } from "react";
import type { TravelIconProps } from "./types";

export const DEFAULT_TRAVEL_ICON_COLOR = "#6F42D8";

type IconBaseProps = TravelIconProps & {
  children: React.ReactNode;
};

export function IconBase({
  size = 24,
  color = DEFAULT_TRAVEL_ICON_COLOR,
  title,
  children,
  style,
  ...props
}: IconBaseProps) {
  const variables = {
    "--travel-icon-primary": color,
    "--travel-icon-light":
      `color-mix(in srgb, ${color} 60%, white)`,
    "--travel-icon-dark":
      `color-mix(in srgb, ${color} 72%, black)`,
    ...style,
  } as CSSProperties;

  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      style={variables}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}
