import React, { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import ChatIcon from '@mui/icons-material/Chat';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { push, ref, set } from 'firebase/database';
import { auth, database } from '../../firebase';
import { useAuth } from '../../hooks';
import { useChat } from '../../contexts/ChatContext';
import { Colors } from '../constants';
import PillButton from '../common/PillButton';

interface ContactHostButtonProps {
  hostId: string;
  hostName: string;
  propertyId: string;
  propertyName: string;
  variant?: 'text' | 'outlined' | 'contained';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}

const buildInitialName = (
  firstName?: string | null,
  lastName?: string | null,
  displayName?: string | null
) => {
  const combined = `${firstName || ''} ${lastName || ''}`.trim();
  return combined || displayName || '';
};

const ContactHostButton: React.FC<ContactHostButtonProps> = ({
  hostId,
  hostName,
  propertyId,
  propertyName,
  variant = 'contained',
  size = 'medium',
  fullWidth = false,
}) => {
  const { appUser, firebaseUser } = useAuth();
  const { sendDirectMessageToUser } = useChat();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [message, setMessage] = useState('');

  const isLoggedIn = !!firebaseUser;

  const prefilledName = useMemo(
    () =>
      buildInitialName(
        appUser?.firstName,
        appUser?.lastName,
        firebaseUser?.displayName
      ),
    [appUser?.firstName, appUser?.lastName, firebaseUser?.displayName]
  );

  const prefilledEmail = appUser?.email || firebaseUser?.email || '';
  const prefilledPhone = appUser?.phoneNumber || '';

  const handleOpen = () => {
    setGuestName(prefilledName);
    setGuestEmail(prefilledEmail);
    setGuestPhone(prefilledPhone);
    setMessage('');
    setSent(false);
    setError(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setLoading(false);
    setSent(false);
    setError(null);
  };

  const handleSend = async () => {
    if (!message.trim()) {
      setError(
        isLoggedIn
          ? 'Please add a message before sending.'
          : 'Please add your name, email, and a message.'
      );
      return;
    }

    if (!isLoggedIn && (!guestName.trim() || !guestEmail.trim())) {
      setError('Please add your name, email, and a message.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isLoggedIn) {
        await sendDirectMessageToUser(
          hostId,
          hostName,
          message.trim(),
          propertyId,
          propertyName
        );

        setSent(true);
        return;
      }

      const inquiriesRef = ref(database, `propertyInquiries/${hostId}`);
      const newInquiryRef = push(inquiriesRef);
      const inquiryId = newInquiryRef.key;

      if (!inquiryId) {
        throw new Error('Failed to create inquiry id');
      }

      await set(newInquiryRef, {
        id: inquiryId,
        hostId,
        hostName,
        propertyId,
        propertyName,
        guestUid: auth.currentUser?.uid || '',
        guestName: guestName.trim(),
        guestEmail: guestEmail.trim(),
        guestPhone: guestPhone.trim(),
        message: message.trim(),
        source: 'property_page',
        status: 'new',
        createdAt: Date.now(),
      });

      setSent(true);
    } catch (sendError) {
      console.error('Error sending inquiry:', sendError);
      setError('Could not send your inquiry. Please try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PillButton
        onClick={handleOpen}
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        startIcon={<ChatIcon />}
        sx={{
          ...(variant === 'contained' && {
            bgcolor: Colors.cerulean,
            borderColor: Colors.cerulean,
            color: 'white',
            '&:hover': {
              bgcolor: Colors.raspberry,
              borderColor: Colors.raspberry,
            },
          }),
          ...(variant === 'outlined' && {
            borderColor: alpha(Colors.cerulean, 0.35),
            color: Colors.cerulean,
            '&:hover': {
              borderColor: Colors.raspberry,
              color: Colors.raspberry,
              bgcolor: alpha(Colors.raspberry, 0.04),
            },
          }),
          ...(variant === 'text' && {
            color: Colors.cerulean,
            '&:hover': {
              color: Colors.raspberry,
              bgcolor: alpha(Colors.raspberry, 0.04),
            },
          }),
        }}
      >
        Contact host
      </PillButton>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: Colors.cerulean, color: 'white' }}>
          {isLoggedIn ? `Message ${hostName}` : `Ask about ${propertyName}`}
        </DialogTitle>
        <DialogContent sx={{ p: 3, mt: 2 }}>
          {sent ? (
            <Box py={1}>
              <Stack spacing={1.5} alignItems="flex-start">
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: 3,
                    display: 'grid',
                    placeItems: 'center',
                    bgcolor: 'rgba(22,163,74,0.12)',
                    color: '#15803d',
                  }}
                >
                  <CheckCircleRoundedIcon />
                </Box>
                <Typography variant="h6" fontWeight={700}>
                  {isLoggedIn ? 'Message sent' : 'Inquiry sent'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {isLoggedIn
                    ? 'Your message was sent to the host and will continue in the message center.'
                    : 'The host will receive your question along with your contact details so they can follow up directly.'}
                </Typography>
                {!isLoggedIn && (
                  <Typography variant="body2" color="text.secondary">
                    You do not need an account to send this first inquiry.
                  </Typography>
                )}
              </Stack>
            </Box>
          ) : (
            <Stack spacing={2}>
              <Box>
                <Typography variant="body1" gutterBottom>
                  {isLoggedIn
                    ? `Send a message to ${hostName} about ${propertyName}.`
                    : `Send a question to ${hostName} about ${propertyName}.`}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {isLoggedIn
                    ? 'The conversation will appear in your message center.'
                    : "We'll share your details with the host so they can reply directly."}
                </Typography>
              </Box>

              {error && <Alert severity="error">{error}</Alert>}

              {!isLoggedIn && (
                <>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                      autoFocus
                      fullWidth
                      label="Your name"
                      value={guestName}
                      onChange={event => setGuestName(event.target.value)}
                    />
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={guestEmail}
                      onChange={event => setGuestEmail(event.target.value)}
                    />
                  </Stack>

                  <TextField
                    fullWidth
                    label="Phone number"
                    value={guestPhone}
                    onChange={event => setGuestPhone(event.target.value)}
                    placeholder="Optional"
                  />
                </>
              )}

              <TextField
                multiline
                rows={5}
                fullWidth
                autoFocus={isLoggedIn}
                label={isLoggedIn ? 'Message' : 'Your message'}
                value={message}
                onChange={event => setMessage(event.target.value)}
                placeholder="Hi, I’m interested in this property and have a few questions..."
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} color="inherit">
            {sent ? 'Close' : 'Cancel'}
          </Button>
          {!sent && (
            <Button
              onClick={handleSend}
              variant="contained"
              disabled={loading}
              sx={{
                bgcolor: Colors.cerulean,
                '&:hover': { bgcolor: Colors.raspberry },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : isLoggedIn ? (
                'Send Message'
              ) : (
                'Send Inquiry'
              )}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ContactHostButton;
