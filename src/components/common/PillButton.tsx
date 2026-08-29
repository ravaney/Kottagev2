import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';

type PillButtonProps = ButtonProps & {
  target?: React.AnchorHTMLAttributes<HTMLAnchorElement>['target'];
  rel?: React.AnchorHTMLAttributes<HTMLAnchorElement>['rel'];
};

export const pillButtonHoverSx: SxProps<Theme> = {
  '&:hover': {
    backgroundColor: '#f1f5f9',
  },
};

export default function PillButton({
  size = 'small',
  variant = 'outlined',
  sx,
  ...props
}: PillButtonProps) {
  return (
    <Button size={size} variant={variant} sx={pillButtonHoverSx} {...props} />
  );
}
