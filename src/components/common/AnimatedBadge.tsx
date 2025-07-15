import React from 'react';
import { Badge, BadgeProps } from '@mui/material';

interface AnimatedBadgeProps extends BadgeProps {
  animate?: boolean;
}

export const AnimatedBadge: React.FC<AnimatedBadgeProps> = ({ 
  animate = false, 
  children, 
  ...props 
}) => {
  return (
    <Badge
      {...props}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
        ...props.anchorOrigin
      }}
      sx={{
        '& .MuiBadge-badge': {
          right: -6,
          top: -6,
          ...(animate && {
            animation: 'jump 1.5s infinite',
            '@keyframes jump': {
              '0%, 20%, 50%, 80%, 100%': {
                transform: 'translateY(0)'
              },
              '40%': {
                transform: 'translateY(-8px)'
              },
              '60%': {
                transform: 'translateY(-4px)'
              }
            }
          })
        },
        ...props.sx
      }}
    >
      {children}
    </Badge>
  );
};