import { Label, Stack } from '@fluentui/react';
import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Divider } from '@mui/material';

type Props = {};

export default function BottomNav({}: Props) {
  const footerLinks = [
    { label: 'About', href: '/about' },
    { label: 'Help', href: '/help' },
    { label: 'Terms', href: '/terms' },
    { label: 'Privacy', href: '/privacy' },
    { label: 'Blog', href: '/blog' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        backgroundColor: '#f8f9fa',
        borderTop: '1px solid #e0e0e0',
        mt: 4,
        py: 3,
        px: 4,
        position: 'relative',
        zIndex: 1001,
      }}
    >
      {/* Main Footer Content */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: { xs: 2, sm: 4 },
          mb: 2,
        }}
      >
        {footerLinks.map((link, index) => (
          <Typography
            key={link.label}
            component={Link}
            to={link.href}
            sx={{
              color: '#666',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 500,
              position: 'relative',
              transition: 'all 0.3s ease',
              '&:hover': {
                color: '#2196f3',
                transform: 'translateY(-1px)',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                width: 0,
                height: '2px',
                bottom: '-4px',
                left: '50%',
                backgroundColor: '#2196f3',
                transition: 'all 0.3s ease',
                transform: 'translateX(-50%)',
              },
              '&:hover::after': {
                width: '100%',
              },
            }}
          >
            {link.label}
          </Typography>
        ))}
      </Box>

      <Divider sx={{ mb: 2, opacity: 0.6 }} />

      {/* Copyright */}
      <Box sx={{ textAlign: 'center' }}>
        <Typography
          variant="body2"
          sx={{
            color: '#888',
            fontSize: '0.8rem',
          }}
        >
          © {new Date().getFullYear()} BlueKottage. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}
