import React from 'react';
import { Button } from '@mui/material';
import { PersonAddAltRounded, PlaceOutlined, LayersOutlined } from '@mui/icons-material';
import AdminSectionHeader from './AdminSectionHeader';

interface RegionalStaffHeaderProps {
  onNewAssignment: () => void;
  parishCount?: number;
  regionCount?: number;
}
export default function RegionalStaffHeader({ onNewAssignment, parishCount = 14, regionCount = 6 }: RegionalStaffHeaderProps) {
  return <AdminSectionHeader
    title="Regional Staff Assignment"
    description="Manage staff coverage across Jamaica's parishes and regions."
    eyebrow="STAFF MANAGEMENT / COVERAGE"
    icon="regional-assignment"
    actions={<Button variant="contained" startIcon={<PersonAddAltRounded />} onClick={onNewAssignment}
      sx={{ px: 2.5, py: 1.2 }}>New Assignment</Button>}
    metrics={[
      { label: `${parishCount} Parishes`, icon: <PlaceOutlined fontSize="small" color="action" /> },
      { label: `${regionCount} Coverage Regions`, icon: <LayersOutlined fontSize="small" color="action" /> },
    ]}
  />;
}
