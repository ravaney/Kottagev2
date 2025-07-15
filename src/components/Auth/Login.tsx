import { Label, Spinner, Stack, TextField, Text } from "@fluentui/react";
import { StyledPrimaryButton } from "../common/StyledPrimaryButton";
import React, { useEffect,  useState } from "react";
import { useFirebaseUser, useLogin } from "../../hooks";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Box, Card, CardContent } from "@mui/material";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();
  const {mutateAsync: loginMutation, error, isPending} = useLogin();
  const { data: user } = useFirebaseUser();
   useEffect(() => {
    if (!isPending && user) {
      const redirectTo = location.state?.from?.pathname || '/';
      navigate(redirectTo, { replace: true });
    }
  }, [user, isPending, navigate, location]);
  
  const handleSignIn = async () => {
    try {
       await loginMutation({ email, password });
      if (location.state?.from) {
        navigate(location.state.from);
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error('Login failed:', error);
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
        padding: 2
      }}
    >
      <Card 
        sx={{ 
          maxWidth: 400, 
          width: '100%',
          borderRadius: 3,
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          overflow: 'visible'
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
                  marginBottom: 8
                }}
              >
                Welcome Back!
              </Text>
              <Text 
                variant="medium" 
                style={{ color: '#7f8c8d' }}
              >
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
                  ':hover': { borderColor: '#667eea' }
                }
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
                  ':hover': { borderColor: '#667eea' }
                }
              }}
            />

            {isPending ? (
              <Spinner 
                label="Signing you in..." 
                ariaLive="assertive" 
                labelPosition="right"
                styles={{
                  root: { marginTop: 10 }
                }}
              />
            ) : (
              <StyledPrimaryButton 
                text="Sign In" 
                onClick={handleSignIn}
              />
            )}
            
            <Box textAlign="center" mt={2}>
              <Link 
                to="#" 
                style={{ 
                  color: '#667eea', 
                  textDecoration: 'none',
                  fontSize: 14,
                  fontWeight: 500
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
                    fontWeight: 600
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
