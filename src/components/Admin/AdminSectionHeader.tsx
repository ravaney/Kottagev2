import React from 'react';
import { Box, Stack, Typography, Divider } from '@mui/material';

export type AdminSectionIcon = 'dashboard' | 'employee-management' | 'regional-assignment' | 'analytics' | 'events' | 'settings' | 'properties' | 'bookings' | 'reservation-support' | 'guests-hosts' | 'review-moderation' | 'platform-integrity' | 'payout-disputes';
export interface AdminHeaderMetric { label: React.ReactNode; icon?: React.ReactNode; }
export interface AdminSectionHeaderProps {
  title: string;
  description?: React.ReactNode;
  eyebrow?: string;
  icon: AdminSectionIcon;
  actions?: React.ReactNode;
  metrics?: AdminHeaderMetric[];
  contextLabel?: React.ReactNode;
}

/** Shared admin section heading; page behavior stays in the caller. */
export default function AdminSectionHeader({ title, description, eyebrow = 'ADMINISTRATION', icon, actions, metrics = [], contextLabel = 'Jamaica' }: AdminSectionHeaderProps) {
  return (
    <Box component="header" sx={{ p: { xs: 2, md: 3 }, mb: 2.5, bgcolor: '#fff', border: '1px solid #E1E8EF', borderRadius: 3, flexShrink: 0 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} spacing={2}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ minWidth: 0 }}>
          <Box sx={{ width: 56, height: 56, display: 'grid', placeItems: 'center', bgcolor: '#E5F4FB', color: '#007EAE', borderRadius: 2.5, flexShrink: 0 }}>
            <Box component="img" src={`${process.env.PUBLIC_URL}/bk_icons_admin/${icon}-512.png`} alt="" aria-hidden="true" sx={{ width: 42, height: 42, objectFit: 'contain' }} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, color: 'text.secondary', mb: 0.5 }}>{eyebrow}</Typography>
            <Typography component="h1" variant="h5" sx={{ fontWeight: 750, color: '#123B50', letterSpacing: '-0.5px' }}>{title}</Typography>
            {description && <Typography variant="body2" color="text.secondary">{description}</Typography>}
          </Box>
        </Stack>
        {actions && <Box sx={{ flexShrink: 0, '& > *': { flexWrap: 'wrap', rowGap: 1 }, '& .MuiButton-root': { textTransform: 'none', fontWeight: 600, borderRadius: 2, whiteSpace: 'nowrap' }, '& .MuiButton-contained': { bgcolor: '#007EAE', '&:hover': { bgcolor: '#00648B' } } }}>{actions}</Box>}
      </Stack>
      {(metrics.length > 0 || contextLabel) && <>
        <Divider sx={{ my: 2.5 }} />
        <Stack direction="row" spacing={2.5} alignItems="center" flexWrap="wrap" useFlexGap>
          {metrics.map((metric, index) => <Stack key={index} direction="row" spacing={0.75} alignItems="center">
            {metric.icon}<Typography variant="body2" fontWeight={600}>{metric.label}</Typography>
          </Stack>)}
          {contextLabel && <Typography variant="caption" color="text.secondary" sx={{ ml: { sm: 'auto' } }}>{contextLabel}</Typography>}
        </Stack>
      </>}
    </Box>
  );
}
