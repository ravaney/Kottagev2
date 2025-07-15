import { PrimaryButton, IButtonProps } from "@fluentui/react";
import React from "react";

interface StyledPrimaryButtonProps extends IButtonProps {
  variant?: 'gradient' | 'solid';
}

export const StyledPrimaryButton: React.FC<StyledPrimaryButtonProps> = ({ 
  variant = 'gradient', 
  ...props 
}) => {
  const gradientStyles = {
    root: {
      width: '100%',
      height: 44,
      borderRadius: 8,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      border: 'none',
      fontSize: 16,
      fontWeight: 600
    },
    rootHovered: {
      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
    }
  } as any;

  const solidStyles = {
    root: {
      width: '100%',
      height: 44,
      borderRadius: 8,
      fontSize: 16,
      fontWeight: 600
    }
  };

  return (
    <PrimaryButton 
      {...props}
      styles={variant === 'gradient' ? gradientStyles : solidStyles}
    />
  );
};