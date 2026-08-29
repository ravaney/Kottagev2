import React from 'react';
import {
  Alert,
  Box,
  Chip,
  FormControlLabel,
  Paper,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import {
  BusinessCenter,
  LaptopMac,
  Monitor,
  Verified,
  Wifi,
} from '@mui/icons-material';
import { Colors } from '../constants';
import { NomadInfo } from '../../hooks/propertyHooks';

interface NomadFieldsSectionProps {
  nomad: NomadInfo;
  onChange: <K extends keyof NomadInfo>(field: K, value: NomadInfo[K]) => void;
  disabled?: boolean;
}

const toggleFields: Array<{
  field: keyof NomadInfo;
  label: string;
  helper: string;
}> = [
  {
    field: 'wifiBackupAvailable',
    label: 'Wi-Fi backup available',
    helper: 'Portable hotspot, LTE router, or backup connection available.',
  },
  {
    field: 'coworkingAccess',
    label: 'Coworking access included',
    helper: 'Guests can access a partnered coworking location.',
  },
  {
    field: 'privateWorkspace',
    label: 'Private workspace',
    helper: 'Dedicated desk or quiet work setup inside the property.',
  },
  {
    field: 'ergonomicDeskChair',
    label: 'Ergonomic desk and chair',
    helper: 'Workstation is comfortable enough for daily remote work.',
  },
  {
    field: 'monitorRental',
    label: 'Monitor rental available',
    helper: 'External monitor or stand can be requested by the guest.',
  },
  {
    field: 'quietRoomAccess',
    label: 'Quiet room access',
    helper: 'Guests can access a quieter work-focused room or booth.',
  },
];

export default function NomadFieldsSection({
  nomad,
  onChange,
  disabled = false,
}: NomadFieldsSectionProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 3,
        borderRadius: 3,
        borderColor: 'rgba(25, 118, 210, 0.18)',
        background:
          'linear-gradient(180deg, rgba(227,242,253,0.5) 0%, rgba(255,255,255,1) 100%)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          mb: 2,
          flexWrap: 'wrap',
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{ color: Colors.cerulean, fontWeight: 700, mb: 0.5 }}
          >
            Nomad Network
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Self-attest remote-work amenities to qualify this property as Nomad
            Verified.
          </Typography>
        </Box>
        {nomad.isVerified && (
          <Chip
            color="primary"
            icon={<Verified />}
            label="Nomad Verified"
            sx={{ fontWeight: 700 }}
          />
        )}
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        Only enable this if the property genuinely supports remote-work guests
        with reliable internet and workspace amenities.
      </Alert>

      <FormControlLabel
        control={
          <Switch
            checked={Boolean(nomad.isVerified)}
            onChange={event =>
              onChange('isVerified', event.target.checked as NomadInfo['isVerified'])
            }
            disabled={disabled}
          />
        }
        label="Mark this property as Nomad Verified"
        sx={{ mb: 2 }}
      />

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            type="number"
            label="Wi-Fi Speed (Mbps)"
            value={nomad.wifiSpeedMbps || ''}
            onChange={event =>
              onChange(
                'wifiSpeedMbps',
                event.target.value ? Number(event.target.value) : undefined
              )
            }
            size="small"
            disabled={disabled}
            InputProps={{
              startAdornment: <Wifi sx={{ color: Colors.cerulean, mr: 1 }} />,
            }}
            helperText="Use your verified or expected speed."
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Coworking Partner"
            value={nomad.coworkingPartner || ''}
            onChange={event =>
              onChange('coworkingPartner', event.target.value || undefined)
            }
            size="small"
            disabled={disabled}
            InputProps={{
              startAdornment: (
                <BusinessCenter sx={{ color: Colors.cerulean, mr: 1 }} />
              ),
            }}
            helperText="Optional partner or venue name."
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Coworking Address"
            value={nomad.coworkingAddress || ''}
            onChange={event =>
              onChange('coworkingAddress', event.target.value || undefined)
            }
            size="small"
            disabled={disabled}
            InputProps={{
              startAdornment: (
                <LaptopMac sx={{ color: Colors.cerulean, mr: 1 }} />
              ),
            }}
            helperText="Optional address or meeting point."
          />
        </Grid>

        {toggleFields.map(option => (
          <Grid item xs={12} md={6} key={option.field}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                border: '1px solid rgba(0,0,0,0.08)',
                backgroundColor: 'rgba(255,255,255,0.85)',
              }}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={Boolean(nomad[option.field])}
                    onChange={event =>
                      onChange(
                        option.field,
                        event.target.checked as NomadInfo[typeof option.field]
                      )
                    }
                    disabled={disabled}
                  />
                }
                label={option.label}
              />
              <Typography variant="body2" color="text.secondary">
                {option.helper}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Box
        sx={{
          mt: 3,
          display: 'flex',
          gap: 1,
          flexWrap: 'wrap',
        }}
      >
        {Boolean(nomad.wifiSpeedMbps) && (
          <Chip
            icon={<Wifi />}
            label={`${nomad.wifiSpeedMbps} Mbps Wi-Fi`}
            size="small"
            variant="outlined"
          />
        )}
        {nomad.privateWorkspace && (
          <Chip
            icon={<LaptopMac />}
            label="Private Workspace"
            size="small"
            variant="outlined"
          />
        )}
        {nomad.monitorRental && (
          <Chip
            icon={<Monitor />}
            label="Monitor Rental"
            size="small"
            variant="outlined"
          />
        )}
        {nomad.coworkingAccess && (
          <Chip
            icon={<BusinessCenter />}
            label="Coworking Access"
            size="small"
            variant="outlined"
          />
        )}
      </Box>
    </Paper>
  );
}

