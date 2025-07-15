import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, CircularProgress } from '@mui/material';
import { Stack, TextField } from '@fluentui/react';
import { updateEmail, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth } from '../../firebase';
import EmailIcon from '@mui/icons-material/Email';
import SecurityIcon from '@mui/icons-material/Security';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface EmailUpdateDialogProps {
  open: boolean;
  onClose: () => void;
  currentEmail: string;
}

export const EmailUpdateDialog: React.FC<EmailUpdateDialogProps> = ({ open, onClose, currentEmail }) => {
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const gap = { childrenGap: 15 };

  const handleUpdateEmail = async () => {
    setLoading(true);
    try {
      const credential = EmailAuthProvider.credential(currentEmail, currentPassword);
      await reauthenticateWithCredential(auth.currentUser!, credential);
      await updateEmail(auth.currentUser!, newEmail);
      onClose();
      setNewEmail('');
      setCurrentPassword('');
    } catch (error) {
      console.error('Failed to update email:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <EmailIcon color="primary" />
          <Typography variant="h6">Update Email Address</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="textSecondary">
            Current email: {currentEmail}
          </Typography>
        </Box>
        <Stack tokens={gap} style={{ minWidth: "400px", paddingTop: "10px" }}>
          <TextField
            label="New Email Address"
            type="email"
            value={newEmail}
            onChange={(e, v) => setNewEmail(v || '')}
            placeholder="Enter your new email"
            style={{ width: '100%' }}
          />
          <Box>
            <TextField
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={(e, v) => setCurrentPassword(v || '')}
              placeholder="Enter your current password"
              style={{ width: '100%' }}
            />
            <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
              <SecurityIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
              Required for security verification
            </Typography>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button 
          onClick={handleUpdateEmail} 
          variant="contained"
          disabled={!newEmail || !currentPassword || loading}
          startIcon={loading ? <CircularProgress size={20} /> : <CheckCircleIcon />}
        >
          {loading ? 'Updating...' : 'Update Email'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};