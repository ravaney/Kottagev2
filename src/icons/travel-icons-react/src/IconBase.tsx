import React from "react";
import type { CSSProperties } from "react";
import type { TravelIconProps } from "./types";

type IconBaseProps = TravelIconProps & {
  children: React.ReactNode;
};

export const DEFAULT_TRAVEL_ICON_COLOR = "#6D42D8";

export function IconBase({
  size = 24,
  color = DEFAULT_TRAVEL_ICON_COLOR,
  title,
  children,
  style,
  ...props
}: IconBaseProps) {
  const labelled = Boolean(title);

  const shadeStyle = {
    "--travel-icon-color": color,
    "--travel-icon-primary": "var(--travel-icon-color)",
    "--travel-icon-light":
      "color-mix(in srgb, var(--travel-icon-color) 58%, white)",
    "--travel-icon-dark":
      "color-mix(in srgb, var(--travel-icon-color) 78%, black)",
    ...style,
  } as CSSProperties;

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      role={labelled ? "img" : undefined}
      aria-hidden={labelled ? undefined : true}
      aria-label={labelled ? title : undefined}
      focusable="false"
      style={shadeStyle}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}
