import React from 'react';
import { IconBase } from '../IconBase';
import type { TravelIconProps } from '../types';

export function WellnessIcon(props: TravelIconProps) {
  return (
    <IconBase {...props}>
      <circle
        fill="var(--travel-icon-light)"
        cx="12"
        cy="4.2"
        r="2.1"
      />
      <path
        fill="var(--travel-icon-light)"
        d="M12 7c2 1.5 2.8 3.4 2.3 5.5-.4 1.5-1.2 2.8-2.3 3.8-1.1-1-1.9-2.3-2.3-3.8C9.2 10.4 10 8.5 12 7z"
      />
      <path
        fill="var(--travel-icon-primary)"
        d="M10.5 16.1C7 15.9 4.3 13.9 3.2 10.8c3.5-.1 6 1.5 7.3 5.3z"
      />
      <path
        fill="var(--travel-icon-primary)"
        d="M13.5 16.1c3.5-.2 6.2-2.2 7.3-5.3-3.5-.1-6 1.5-7.3 5.3z"
      />
      <path
        fill="var(--travel-icon-dark)"
        d="M12 20.3c-4.2.3-7.7-.9-9.8-3.6 3.7-.8 7.1.3 9.8 3.6z"
      />
      <path
        fill="var(--travel-icon-dark)"
        d="M12 20.3c4.2.3 7.7-.9 9.8-3.6-3.7-.8-7.1.3-9.8 3.6z"
      />
    </IconBase>
  );
}
