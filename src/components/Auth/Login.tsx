import { Spinner, Stack, TextField, Text } from '@fluentui/react';
import { StyledPrimaryButton } from '../common/StyledPrimaryButton';
import React, { useEffect, useState } from 'react';
import { useFirebaseUser, useLogin } from '../../hooks';
import { useUserClaims } from '../../hooks/useUserClaims';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Alert, Button } from '@mui/material';

export default function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  const [isHostUser, setIsHostUser] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { mutateAsync: loginMutation, error, isPending } = useLogin();
  const { data: user } = useFirebaseUser();
  const { claims } = useUserClaims();

  useEffect(() => {
    if (!isPending && user && claims) {
      // Check if user has host role - they should use host portal
      if (claims.role === 'host' || claims.userType === 'host') {
        setLoginError(
          'Host accounts should use the Host Portal. Please use the link below to access your host dashboard.'
        );
        setIsHostUser(true);
        return; // Don't redirect, show error instead
      }

      // Determine redirect based on user role for non-host users
      let redirectTo = '/';

      if (claims.role === 'guest' || claims.userType === 'guest') {
        // Guest users go to main site or their intended destination
        redirectTo = location.state?.from?.pathname || '/';
      } else if (claims.role === 'admin' || claims.role === 'super_admin') {
        // Admin users go to admin area
        redirectTo = '/admin/dashboard';
      } else if (claims.role === 'staff') {
        // Staff users go to staff area
        redirectTo = '/staff/dashboard';
      } else {
        // Default fallback
        redirectTo = location.state?.from?.pathname || '/';
      }

      const redirectState = location.state?.from?.state;
      navigate(redirectTo, { replace: true, state: redirectState });
    }
  }, [user, isPending, navigate, location, claims]);

  const handleSignIn = async () => {
    setLoginError(''); // Clear any previous errors
    setIsHostUser(false); // Reset host user flag
    try {
      await loginMutation({ email, password });
      // Note: Redirect logic will happen in useEffect after claims are loaded
    } catch (error) {
      console.error('Login failed:', error);
      setLoginError(
        'Login failed. Please check your credentials and try again.'
      );
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 400,
          width: '100%',
          borderRadius: 3,
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          overflow: 'visible',
        }}
      >
        <CardContent sx={{ padding: 4 }}>
          <Stack
            verticalAlign="center"
            horizontalAlign="center"
            tokens={{ childrenGap: 20 }}
          >
            <Box textAlign="center" mb={2}>
              <img
                src="/logoType.png"
                alt="Kottage Logo"
                style={{ height: 60, width: 120, marginBottom: 16 }}
              />
              <Text
                variant="xxLarge"
                style={{
                  fontWeight: 600,
                  color: '#2c3e50',
                  display: 'block',
                  marginBottom: 8,
                }}
              >
                Welcome Back!
              </Text>
              <Text variant="medium" style={{ color: '#7f8c8d' }}>
                Sign in to your account
              </Text>
            </Box>

            <TextField
              onChange={(e, v) => setEmail(v as string)}
              type="email"
              value={email}
              label="Email Address"
              placeholder="Enter your email"
              disabled={isPending}
              styles={{
                root: { width: '100%' },
                fieldGroup: {
                  borderRadius: 8,
                  border: '2px solid #e1e8ed',
                  ':hover': { borderColor: '#667eea' },
                },
              }}
            />

            <TextField
              onChange={(e, v) => setPassword(v as string)}
              value={password}
              type="password"
              label="Password"
              placeholder="Enter your password"
              errorMessage={error?.message}
              disabled={isPending}
              styles={{
                root: { width: '100%' },
                fieldGroup: {
                  borderRadius: 8,
                  border: '2px solid #e1e8ed',
                  ':hover': { borderColor: '#667eea' },
                },
              }}
            />

            {(error || loginError) && (
              <Alert
                severity={isHostUser ? 'info' : 'error'}
                sx={{ width: '100%', mt: 1 }}
                action={
                  isHostUser ? (
                    <Button
                      color="inherit"
                      size="small"
                      onClick={() => {
                        // Handle both development and production
                        if (process.env.NODE_ENV === 'development') {
                          // Development: Use subdomain simulation
                          localStorage.setItem('simulated_subdomain', 'host');
                          window.location.reload();
                        } else {
                          // Production: Navigate to actual host subdomain
                          const currentHost = window.location.hostname;
                          const protocol = window.location.protocol;
                          const port = window.location.port
                            ? `:${window.location.port}`
                            : '';

                          // Create host subdomain URL
                          const hostUrl = `${protocol}//host.${currentHost}${port}/login`;
                          window.location.href = hostUrl;
                        }
                      }}
                      sx={{ fontWeight: 600 }}
                    >
                      Go to Host Portal
                    </Button>
                  ) : null
                }
              >
                {error?.message || loginError}
              </Alert>
            )}

            {isPending ? (
              <Spinner
                label="Signing you in..."
                ariaLive="assertive"
                labelPosition="right"
                styles={{
                  root: { marginTop: 10 },
                }}
              />
            ) : (
              <StyledPrimaryButton text="Sign In" onClick={handleSignIn} />
            )}

            <Box textAlign="center" mt={2}>
              <Link
                to="#"
                style={{
                  color: '#667eea',
                  textDecoration: 'none',
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                Forgot your password?
              </Link>
            </Box>

            <Box textAlign="center" mt={1}>
              <Text style={{ color: '#7f8c8d', fontSize: 14 }}>
                Don't have an account?{' '}
                <Link
                  to="/CreateAccount"
                  style={{
                    color: '#667eea',
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  Sign up
                </Link>
              </Text>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
