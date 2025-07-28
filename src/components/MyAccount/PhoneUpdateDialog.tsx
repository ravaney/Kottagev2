import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Stepper, Step, StepLabel, CircularProgress } from '@mui/material';
import { Stack, TextField } from '@fluentui/react';
import { updatePhoneNumber, PhoneAuthProvider, RecaptchaVerifier } from 'firebase/auth';
import { auth } from '../../firebase';
import PhoneIcon from '@mui/icons-material/Phone';
import SecurityIcon from '@mui/icons-material/Security';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface PhoneUpdateDialogProps {
  open: boolean;
  onClose: () => void;
  currentPhone?: string;
}

export const PhoneUpdateDialog: React.FC<PhoneUpdateDialogProps> = ({ open, onClose, currentPhone }) => {
  const [newPhone, setNewPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [showVerificationInput, setShowVerificationInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const gap = { childrenGap: 15 };
  
  const steps = ['Enter Phone Number', 'Verify Identity', 'Complete Update'];
  const activeStep = !newPhone ? 0 : !showVerificationInput ? 1 : 2;

  const handleSendVerificationCode = async () => {
    if (newPhone) {
      setLoading(true);
      try {
        const recaptchaVerifier = new RecaptchaVerifier(
          auth,
          'recaptcha-container',
          {
            size: 'invisible',
            callback: () => {
              console.log('reCAPTCHA solved');
            },
          }
        );
        
        const provider = new PhoneAuthProvider(auth);
        const id = await provider.verifyPhoneNumber(newPhone, recaptchaVerifier);
        setVerificationId(id);
        setCaptchaVerified(true);
        setShowVerificationInput(true);
      } catch (error) {
        console.error('Failed to send verification code:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUpdatePhone = async () => {
    setLoading(true);
    try {
      if (verificationCode && verificationId) {
        const phoneCredential = PhoneAuthProvider.credential(verificationId, verificationCode);
        await updatePhoneNumber(auth.currentUser!, phoneCredential);
        onClose();
        setNewPhone('');
        setVerificationCode('');
        setVerificationId('');
        setCaptchaVerified(false);
        setShowVerificationInput(false);
      }
    } catch (error) {
      console.error('Failed to update phone:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setNewPhone('');
    setVerificationCode('');
    setVerificationId('');
    setCaptchaVerified(false);
    setShowVerificationInput(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <PhoneIcon color="primary" />
          <Typography variant="h6">Update Phone Number</Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ width: '100%', mb: 3 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel 
                  StepIconComponent={({ active, completed }) => (
                    completed ? <CheckCircleIcon color="success" /> : 
                    active ? <SecurityIcon color="primary" /> : 
                    <PhoneIcon color="disabled" />
                  )}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
        
        <Stack tokens={gap} style={{ minWidth: "400px", paddingTop: "10px" }}>
          <Box>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
              {currentPhone ? `Current: ${currentPhone}` : 'No phone number set'}
            </Typography>
            <TextField
              label="New Phone Number"
              value={newPhone}
              onChange={(e, v) => setNewPhone(v as string)}
              placeholder="Enter your new phone number"
             
            />
          </Box>
          
          {newPhone && newPhone.length > 10 && !captchaVerified && (
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button 
                onClick={handleSendVerificationCode} 
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} /> : <SecurityIcon />}
                disabled={loading}
                sx={{ minWidth: 200 }}
              >
                {loading ? 'Sending...' : 'Send Verification Code'}
              </Button>
              <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                We'll send a verification code to your phone
              </Typography>
            </Box>
          )}
          
          <div id="recaptcha-container"></div>
          
          {showVerificationInput && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                Enter the 6-digit code sent to {newPhone}
              </Typography>
              <TextField
                label="Verification Code"
                value={verificationCode}
                onChange={(e, v) => setVerificationCode(v || '')}
                placeholder="000000"
                style={{ width: '100%' }}
              />
            </Box>
          )}
        </Stack>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={handleUpdatePhone} 
          variant="contained" 
          disabled={!verificationCode || loading}
          startIcon={loading ? <CircularProgress size={20} /> : <CheckCircleIcon />}
        >
          {loading ? 'Updating...' : 'Update Phone'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};