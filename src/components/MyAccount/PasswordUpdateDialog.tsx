import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, CircularProgress } from '@mui/material';
import { Stack, TextField } from '@fluentui/react';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth } from '../../firebase';
import LockIcon from '@mui/icons-material/Lock';
import SecurityIcon from '@mui/icons-material/Security';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface PasswordUpdateDialogProps {
  open: boolean;
  onClose: () => void;
  currentEmail: string;
}

export const PasswordUpdateDialog: React.FC<PasswordUpdateDialogProps> = ({ open, onClose, currentEmail }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const gap = { childrenGap: 15 };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const credential = EmailAuthProvider.credential(currentEmail, currentPassword);
      await reauthenticateWithCredential(auth.currentUser!, credential);
      await updatePassword(auth.currentUser!, newPassword);
      onClose();
      setNewPassword('');
      setConfirmPassword('');
      setCurrentPassword('');
    } catch (error) {
      console.error('Failed to update password:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <LockIcon color="primary" />
          <Typography variant="h6">Change Password</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="textSecondary">
            Create a strong password to keep your account secure
          </Typography>
        </Box>
        <Stack tokens={gap} style={{ minWidth: "400px", paddingTop: "10px" }}>
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
          <TextField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e, v) => setNewPassword(v || '')}
            placeholder="Enter your new password"
            style={{ width: '100%' }}
          />
          <Box>
            <TextField
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e, v) => setConfirmPassword(v || '')}
              placeholder="Confirm your new password"
              style={{ width: '100%' }}
            />
            {newPassword && confirmPassword && newPassword !== confirmPassword && (
              <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                Passwords do not match
              </Typography>
            )}
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button 
          onClick={handleUpdatePassword} 
          variant="contained"
          disabled={!currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword || loading}
          startIcon={loading ? <CircularProgress size={20} /> : <CheckCircleIcon />}
        >
          {loading ? 'Updating...' : 'Update Password'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};