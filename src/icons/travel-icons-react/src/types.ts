import type { CSSProperties, SVGProps } from "react";

export type TravelIconProps = Omit<SVGProps<SVGSVGElement>, "color"> & {
  size?: number | string;
  /** Any valid CSS color. Default: #6D42D8 */
  color?: string;
  title?: string;
  style?: CSSProperties;
};
