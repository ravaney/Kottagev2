import type { CSSProperties, SVGProps } from "react";

export type TravelIconProps = Omit<SVGProps<SVGSVGElement>, "color"> & {
  /** Width and height. Defaults to 24. */
  size?: number | string;

  /**
   * Base icon color.
   * The component automatically derives a light and dark shade.
   * Defaults to #6F42D8.
   */
  color?: string;

  /** Optional accessible title. */
  title?: string;

  style?: CSSProperties;
};
