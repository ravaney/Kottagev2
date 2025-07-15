import React from 'react';
import { IconButton, IconButtonProps } from '@mui/material';
import { Label } from '@fluentui/react';

interface StyledIconButtonProps extends Omit<IconButtonProps, 'children'> {
  icon: React.ReactElement;
  label: string;
  variant?: 'primary' | 'secondary' | 'success';
}

export const StyledIconButton: React.FC<StyledIconButtonProps> = ({ 
  icon, 
  label, 
  variant = 'primary',
  ...props 
}) => {
  const getHoverColor = () => {
    switch (variant) {
      case 'success':
        return 'rgba(46, 125, 50, 0.08)';
      case 'secondary':
        return 'rgba(211, 47, 47, 0.08)';
      default:
        return 'rgba(25, 118, 210, 0.08)';
    }
  };

  return (
    <IconButton
      {...props}
      sx={{
        borderRadius: '8px',
        padding: '8px 12px',
        '&:hover': {
          backgroundColor: getHoverColor(),
          borderRadius: '8px'
        },
        ...props.sx
      }}
    >
      {icon}
      <Label style={{ cursor: "pointer", marginLeft: "5px" }}>{label}</Label>
    </IconButton>
  );
};