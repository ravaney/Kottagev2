import { Label, PrimaryButton, Stack, Text, TextField, Modal } from "@fluentui/react";
import { IconButton, Paper, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import React, { useState } from "react";
import { Colors } from "../constants";
import Address from "./Address";
import LockIcon from "@mui/icons-material/Lock";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import { FaCcMastercard } from "react-icons/fa";
import { useAuth, useUpdateProfile } from "../../hooks";
import { IAddress } from "../../../public/QuickType";
import { updateEmail, updatePassword, updatePhoneNumber, reauthenticateWithCredential, EmailAuthProvider, PhoneAuthProvider, RecaptchaVerifier } from "firebase/auth";
import { auth } from "../../firebase";
import { EmailUpdateDialog } from './EmailUpdateDialog';
import { PasswordUpdateDialog } from './PasswordUpdateDialog';
import { PhoneUpdateDialog } from './PhoneUpdateDialog';
import { StyledIconButton } from '../common/StyledIconButton';

export default function Profile() {
  const { appUser,firebaseUser } = useAuth();
  const {mutateAsync:AsyncUpdateProfile,isPending} = useUpdateProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [emailDialog, setEmailDialog] = useState(false);
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [phoneDialog, setPhoneDialog] = useState(false);
  const [formData, setFormData] = useState({
    firstName: appUser?.firstName || '',
    lastName: appUser?.lastName || '',
    email: firebaseUser?.email || '',
    phoneNumber: firebaseUser?.phoneNumber || '',
    dob: appUser?.dob || '',
    bio: appUser?.bio || '',
    occupation: appUser?.occupation || '',
    company: appUser?.company || '',
    website: appUser?.website || '',
    address: {
      address1: appUser?.address?.address1 || '',
      address2: appUser?.address?.address2 || '',
      city: appUser?.address?.city || '',
      state: appUser?.address?.state || '',
      zip: appUser?.address?.zip || '',
      country: appUser?.address?.country || ''
    } as IAddress
  });
  
  const gap = { childrenGap: 10 };
  const gap20 = { childrenGap: 20 };
  const gap30 = { childrenGap: 30 };

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      firstName: appUser?.firstName || '',
      lastName: appUser?.lastName || '',
      email: firebaseUser?.email || '',
      phoneNumber: firebaseUser?.phoneNumber || '',
      dob: appUser?.dob || '',
      bio: appUser?.bio || '',
      occupation: appUser?.occupation || '',
      company: appUser?.company || '',
      website: appUser?.website || '',
      address: {
        address1: appUser?.address?.address1 || '',
        address2: appUser?.address?.address2 || '',
        city: appUser?.address?.city || '',
        state: appUser?.address?.state || '',
        zip: appUser?.address?.zip || '',
        country: appUser?.address?.country || ''
      } as IAddress
    });
  };
  const handleSave = async () => {
    try {
      // await AsyncUpdateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };
  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: { ...prev.address, [addressField]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };






  return (
    <Paper
      style={{
        padding: "20px 20px",
        // borderRadius: "10px",
        backgroundColor: Colors.offWhite,
      }}
    >
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
        <Typography variant="h6" color="black">
          Personal Information
        </Typography>
        {!isEditing ? (
          <StyledIconButton
            onClick={handleEdit}
            icon={<EditIcon color="primary" />}
            label="Edit"
          />
        ) : (
          <Stack horizontal tokens={gap}>
            <StyledIconButton
              onClick={handleSave}
              disabled={isPending}
              icon={<SaveIcon color="primary" />}
              label={isPending ? 'Saving...' : 'Save'}
              variant="success"
            />
            <StyledIconButton
              onClick={handleCancel}
              icon={<CancelIcon color="secondary" />}
              label="Cancel"
              variant="secondary"
            />
          </Stack>
        )}
      </Stack>
      <Stack tokens={gap30} style={{ paddingTop: "20px" }}>
        <Stack tokens={gap20} horizontal>
          <Stack style={{ width: "200px" }}>
            <Text>
              Update your personal information here. Your data is kept
              confidential and secured
            </Text>
          </Stack>
          <Stack tokens={gap}>
            <Stack horizontal tokens={gap20}>
              {isEditing ? (
                <>
                  <TextField
                    label="First Name"
                    value={formData.firstName}
                    onChange={(e, v) => handleInputChange('firstName', v || '')}
                  />
                  <TextField
                    label="Last Name"
                    value={formData.lastName}
                    onChange={(e, v) => handleInputChange('lastName', v || '')}
                  />
                </>
              ) : (
                <>
                  <Label>{appUser?.firstName}</Label>
                  <Label>{appUser?.lastName}</Label>
                </>
              )}
            </Stack>
            <Stack style={{ width: "300px" }} tokens={gap}>
              {isEditing ? (
                <TextField
                  label="Date of Birth"
                  type="date"
                  value={formData.dob}
                  onChange={(e, v) => handleInputChange('dob', v || '')}
                />
              ) : (
                <Label>Birthday: {appUser?.dob || 'Not set'}</Label>
              )}
               
                <>
                  <TextField
                    label="Bio"
                    multiline
                    rows={3}
                    value={formData.bio}
                    onChange={(e, v) => handleInputChange('bio', v || '')}
                    placeholder="Tell us about yourself..."
                    readOnly={!isEditing}
                  />
                  <TextField
                    label="Occupation"
                    value={formData.occupation}
                    onChange={(e, v) => handleInputChange('occupation', v || '')}
                    placeholder="Your job title"
                    readOnly={!isEditing}
                  />
                  <TextField
                    label="Company"
                    value={formData.company}
                    onChange={(e, v) => handleInputChange('company', v || '')}
                    placeholder="Company name"
                    readOnly={!isEditing}
                  />
                  <TextField
                    label="Website"
                    value={formData.website}
                    onChange={(e, v) => handleInputChange('website', v || '')}
                    placeholder="https://yourwebsite.com"
                    readOnly={!isEditing}
                  />
                </>
              

            </Stack>
          </Stack>
        </Stack>


        <Stack horizontal tokens={gap20} verticalAlign="start">
          <Stack style={{ width: "200px" }}>
            <Label>Home Address</Label>
            <Text>Your residential address information</Text>
          </Stack>
          <Stack style={{ width: "300px" }} tokens={gap}>
            {isEditing ? (
              <>
                <TextField
                  label="Address Line 1"
                  value={formData.address.address1}
                  onChange={(e, v) => handleInputChange('address.address1', v || '')}
                  placeholder="Street address"
                />
                <TextField
                  label="Address Line 2"
                  value={formData.address.address2}
                  onChange={(e, v) => handleInputChange('address.address2', v || '')}
                  placeholder="Apartment, suite, etc. (optional)"
                />
                <Stack horizontal tokens={gap}>
                  <TextField
                    label="City"
                    value={formData.address.city}
                    onChange={(e, v) => handleInputChange('address.city', v || '')}
                  />
                  <TextField
                    label="State"
                    value={formData.address.state}
                    onChange={(e, v) => handleInputChange('address.state', v || '')}
                  />
                </Stack>
                <Stack horizontal tokens={gap}>
                  <TextField
                    label="ZIP Code"
                    value={formData.address.zip}
                    onChange={(e, v) => handleInputChange('address.zip', v || '')}
                  />
                  <TextField
                    label="Country"
                    value={formData.address.country}
                    onChange={(e, v) => handleInputChange('address.country', v || '')}
                  />
                  <TextField
                    label="Country"
                    value={formData.address.country}
                    onChange={(e, v) => handleInputChange('address.country', v || '')}
                  />
                </Stack>
              </>
            ) : (
              <Stack tokens={gap}>
                <Text>{appUser?.address?.address1}</Text>
                {appUser?.address?.address2 && <Text>{appUser?.address?.address2}</Text>}
                <Text>{appUser?.address?.city}, {appUser?.address?.state} {appUser?.address?.zip}</Text>
                <Text>{appUser?.address?.country}</Text>
              </Stack>
            )}
          </Stack>
        </Stack>

      </Stack>
      
      <Typography variant="h6" color="black" style={{ marginTop: "30px" }}>
        Security Settings
      </Typography>
      <Stack tokens={gap20} style={{ paddingTop: "20px" }}>
        <Stack horizontal tokens={gap20} verticalAlign="center">
          <Stack style={{ width: "200px" }}>
            <Label>Email Address</Label>
            <Text>{firebaseUser?.email}</Text>
          </Stack>
          <StyledIconButton
            onClick={() => setEmailDialog(true)}
            icon={<EmailIcon color="primary" />}
            label="Change Email"
          />
        </Stack>
        
        <Stack horizontal tokens={gap20} verticalAlign="center">
          <Stack style={{ width: "200px" }}>
            <Label>Phone Number</Label>
            <Text>{firebaseUser?.phoneNumber || 'Not set'}</Text>
          </Stack>
          <StyledIconButton
            onClick={() => setPhoneDialog(true)}
            icon={<PhoneIcon color="primary" />}
            label="Change Phone"
          />
        </Stack>
        
        <Stack horizontal tokens={gap20} verticalAlign="center">
          <Stack style={{ width: "200px" }}>
            <Label>Password</Label>
            <Text>••••••••</Text>
          </Stack>
          <StyledIconButton
            onClick={() => setPasswordDialog(true)}
            icon={<LockIcon color="primary" />}
            label="Change Password"
          />
        </Stack>
      </Stack>

      <Typography variant="h6" color="black" style={{ marginTop: "30px" }}>
        Payment Methods
      </Typography>
      <Stack>
        <FaCcMastercard color="black" style={{ fontSize: "32px" }} />
      </Stack>

      <EmailUpdateDialog 
        open={emailDialog} 
        onClose={() => setEmailDialog(false)}
        currentEmail={firebaseUser?.email || ''}
      />

      <PasswordUpdateDialog 
        open={passwordDialog} 
        onClose={() => setPasswordDialog(false)}
        currentEmail={firebaseUser?.email || ''}
      />

      <PhoneUpdateDialog 
        open={phoneDialog} 
        onClose={() => setPhoneDialog(false)}
        currentPhone={firebaseUser?.phoneNumber || undefined}
      />
    </Paper>
  );
}
