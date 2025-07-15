import { Stack, Label, TextField, Text, Spinner } from "@fluentui/react";
import { StyledPrimaryButton } from "../common/StyledPrimaryButton";
import React, { useState } from "react";
import { useFilePicker } from "use-file-picker";
import { IAddress, IInitUser } from "../../../public/QuickType";
import { Link, useNavigate } from "react-router-dom";
import { useCreateAccount } from "../../hooks";
import { Box, Card, CardContent } from "@mui/material";

export default function CreateAccount() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [image, setImage] = useState<File[]>();
  const [phoneNumber, setPhoneNumber] = useState<number>();
  const [address, setAddress] = useState<IAddress>();
  const navigate = useNavigate();
  const {mutateAsync: createAccountMutation, error, isPending} = useCreateAccount();

  const [openFileSelector, setOpnFileSelector] = useFilePicker({
    multiple: false,
    accept: "image/*",
    onFilesSuccessfulySelected: ({ plainFiles }: any) => {
      setImage(plainFiles);
    },
  });

  const handleCreateAccount = async () => {
    try {
      await createAccountMutation({
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
        address,
        image,
      } as IInitUser);
      navigate("/");
    } catch (error) {
      console.error('Account creation failed:', error);
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
          maxWidth: 500, 
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
                Create Account
              </Text>
              <Text 
                variant="medium" 
                style={{ color: '#7f8c8d' }}
              >
                Join Kottage today
              </Text>
            </Box>

            {image && image[0] ? (
              <Box textAlign="center">
                <img 
                  src={URL.createObjectURL(image[0])} 
                  alt="Profile Preview" 
                  style={{ 
                    width: 100, 
                    height: 100, 
                    borderRadius: '50%', 
                    objectFit: 'cover',
                    border: '3px solid #667eea',
                    marginBottom: 10
                  }} 
                />
                <br />
                <StyledPrimaryButton 
                  text="Change Image" 
                  onClick={openFileSelector}
                  variant="solid"
                  styles={{ root: { width: 'auto', height: 32, fontSize: 14 } }}
                />
              </Box>
            ) : (
              <StyledPrimaryButton 
                text="Upload Profile Image" 
                onClick={openFileSelector}
                variant="solid"
              />
            )}

            <Stack horizontal tokens={{ childrenGap: 10 }}>
              <TextField
                type="text"
                label="First Name"
                value={firstName}
                placeholder="Enter your first name"
                onChange={(e, v) => setFirstName(v as string)}
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
                type="text"
                label="Last Name"
                value={lastName}
                placeholder="Enter your last name"
                onChange={(e, v) => setLastName(v as string)}
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
            </Stack>

            <TextField
              type="email"
              label="Email Address"
              value={email}
              placeholder="Enter your email"
              onChange={(e, v) => setEmail(v as string)}
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
              type="tel"
              label="Phone Number"
              placeholder="Enter your phone number"
              onChange={(e, v) => setPhoneNumber((v as unknown) as number)}
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
              type="text"
              label="Address"
              value={address?.address1}
              placeholder="Enter your address"
              onChange={(e, v) => setAddress((v as unknown) as IAddress)}
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
              type="password"
              label="Password"
              value={password}
              placeholder="Enter your password"
              onChange={(e, v) => setPassword(v as string)}
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
              value={confirmPassword}
              onChange={(e, v) => setConfirmPassword(v as string)}
              type="password"
              label="Confirm Password"
              placeholder="Confirm your password"
              errorMessage={
                password !== confirmPassword ? "Passwords do not match" : ""
              }
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

            {error && (
              <Text style={{ color: 'red', fontSize: 14 }}>
                {error.message}
              </Text>
            )}

            {isPending ? (
              <Spinner 
                label="Creating your account..." 
                ariaLive="assertive" 
                labelPosition="right"
                styles={{
                  root: { marginTop: 10 }
                }}
              />
            ) : (
              <StyledPrimaryButton 
                text="Create Account" 
                onClick={handleCreateAccount}
                disabled={password !== confirmPassword || !email || !password}
              />
            )}
            
            <Box textAlign="center" mt={1}>
              <Text style={{ color: '#7f8c8d', fontSize: 14 }}>
                Already have an account?{' '}
                <Link 
                  to="/Login" 
                  style={{ 
                    color: '#667eea', 
                    textDecoration: 'none',
                    fontWeight: 600
                  }}
                >
                  Sign in
                </Link>
              </Text>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
