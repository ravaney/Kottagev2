import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Divider,
  Button,

  Paper
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import { useUserClaims } from '../../hooks/useUserClaims';

export const ClaimsViewer: React.FC = () => {
  const { user, claims, loading, refreshClaims, logClaims } = useUserClaims();

  if (loading) {
    return <Typography>Loading claims...</Typography>;
  }

  if (!user) {
    return <Typography>No user logged in</Typography>;
  }

  return (
    <Card sx={{ m: 2, maxWidth: 800 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h2">
            User Claims Viewer
          </Typography>
          <Box>
            <Button onClick={refreshClaims} variant="outlined" size="small" sx={{ mr: 1 }}>
              Refresh Claims
            </Button>
            <Button onClick={logClaims} variant="outlined" size="small">
              Log to Console
            </Button>
          </Box>
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        {/* User Info */}
        <Paper sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
          <Typography variant="h6" gutterBottom>User Information</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2"><strong>UID:</strong> {user.uid}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2"><strong>Email:</strong> {user.email}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2"><strong>Display Name:</strong> {user.displayName}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2"><strong>Email Verified:</strong> {user.emailVerified ? 'Yes' : 'No'}</Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Claims */}
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>Custom Claims</Typography>
          {claims ? (
            <Box>
              {/* Basic Claims */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>Basic Information:</Typography>
                <Grid container spacing={1}>
                  {claims.userType && (
                    <Grid item>
                      <Chip label={`User Type: ${claims.userType}`} color="primary" size="small" />
                    </Grid>
                  )}
                  {claims.role && (
                    <Grid item>
                      <Chip label={`Role: ${claims.role}`} color="secondary" size="small" />
                    </Grid>
                  )}
                  {claims.isEmployee && (
                    <Grid item>
                      <Chip label="Employee" color="success" size="small" />
                    </Grid>
                  )}
                  {claims.isActive !== undefined && (
                    <Grid item>
                      <Chip 
                        label={claims.isActive ? 'Active' : 'Inactive'} 
                        color={claims.isActive ? 'success' : 'error'} 
                        size="small" 
                      />
                    </Grid>
                  )}
                </Grid>
              </Box>

              {/* Employee Details */}
              {claims.isEmployee && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>Employee Details:</Typography>
                  <Grid container spacing={2}>
                    {claims.employeeId && (
                      <Grid item xs={6} sm={3}>
                        <Typography variant="body2"><strong>ID:</strong> {claims.employeeId}</Typography>
                      </Grid>
                    )}
                    {claims.department && (
                      <Grid item xs={6} sm={3}>
                        <Typography variant="body2"><strong>Department:</strong> {claims.department}</Typography>
                      </Grid>
                    )}
                    {claims.position && (
                      <Grid item xs={6} sm={3}>
                        <Typography variant="body2"><strong>Position:</strong> {claims.position}</Typography>
                      </Grid>
                    )}
                    {claims.accessLevel && (
                      <Grid item xs={6} sm={3}>
                        <Typography variant="body2"><strong>Access Level:</strong> {claims.accessLevel}</Typography>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              )}

              {/* Permissions */}
              {claims.permissions && claims.permissions.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>Permissions:</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {claims.permissions.map((permission: string, index: number) => (
                      <Chip key={index} label={permission} variant="outlined" size="small" />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Capabilities */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>Capabilities:</Typography>
                <Grid container spacing={1}>
                  {Object.entries(claims)
                    .filter(([key, value]) => key.startsWith('can') && typeof value === 'boolean')
                    .map(([key, value]) => (
                      <Grid item key={key}>
                        <Chip 
                          label={key} 
                          color={value ? 'success' : 'default'} 
                          variant={value ? 'filled' : 'outlined'}
                          size="small" 
                        />
                      </Grid>
                    ))}
                </Grid>
              </Box>

              {/* Raw Claims JSON */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>Raw Claims (JSON):</Typography>
                <Paper sx={{ p: 2, bgcolor: 'grey.100' }}>
                  <pre style={{ 
                    fontSize: '12px', 
                    overflow: 'auto', 
                    margin: 0,
                    fontFamily: 'monospace'
                  }}>
                    {JSON.stringify(claims, null, 2)}
                  </pre>
                </Paper>
              </Box>
            </Box>
          ) : (
            <Typography color="text.secondary">No custom claims found</Typography>
          )}
        </Paper>
      </CardContent>
    </Card>
  );
};

export default ClaimsViewer;
