import { Stack, Label, TextField, PrimaryButton } from "@fluentui/react";
import React, { useState } from "react";
import { createAccountAsync } from "../../state/thunks";
import { useFilePicker } from "use-file-picker";
import { useAppDispatch } from "../../state/hooks";
import { useUserState } from "../../state/userSlice";
import { IAddress, IInitUser } from "../../../public/QuickType";
import { redirect } from "react-router-dom";

export default function CreateAccount() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [image, setImage] = useState<File[]>();
  const [phoneNumber, setPhoneNumber] = useState<number>();
  const [address, setAddress] = useState<IAddress>();
  const { accountCreationError } = useUserState();
  const dispatch = useAppDispatch();

  const [openFileSelector, setOpnFileSelector] = useFilePicker({
    multiple: false,
    accept: "image/*",
    onFilesSuccessfulySelected: ({ plainFiles }: any) => {
      setImage(plainFiles);
    },
  });

  const handleCreateAccount = () => {
    console.log("Creating Account");
    dispatch(
      createAccountAsync({
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
        address,
        image,
      } as IInitUser)
    );
  };

  const gap = { childrenGap: 10 };

  return (
    <Stack horizontalAlign="center" verticalAlign="center" tokens={gap}>
      <img src="/logoType.png" alt="logo" height={50} width={100} />

      <Label>Create Account</Label>

      <PrimaryButton onClick={openFileSelector}>Upload Image</PrimaryButton>

      <TextField
        required
        type="text"
        label="First Name"
        value={firstName}
        onChange={(e, v) => setFirstName(v as string)}
      />
      <TextField
        required
        type="text"
        label="Last Name"
        value={lastName}
        onChange={(e, v) => setLastName(v as string)}
      />
      <TextField
        required
        type="tel"
        label="Phone Number"
        onChange={(e, v) => setPhoneNumber((v as unknown) as number)}
      />
      <TextField
        required
        type="text"
        label="Address"
        value={address?.address1}
        onChange={(e, v) => setAddress((v as unknown) as IAddress)}
      />

      <TextField
        required
        type="email"
        label="Email"
        value={email}
        onChange={(e, v) => setEmail(v as string)}
      />
      <TextField
        required
        type="password"
        label="Password"
        value={password}
        onChange={(e, v) => setPassword(v as string)}
      />
      <TextField
        required
        value={confirmPassword}
        onChange={(e, v) => setConfirmPassword(v as string)}
        type="password"
        label="Confirm Password"
        errorMessage={
          password !== confirmPassword ? "Passwords do not match" : ""
        }
      />
      <PrimaryButton text="Create Account" onClick={handleCreateAccount} />
      <div style={{ color: "red" }}>{accountCreationError}</div>
    </Stack>
  );
}
