import { Label, PrimaryButton, Stack, TextField } from "@fluentui/react";
// Also available from @uifabric/icons (7 and earlier) and @fluentui/font-icons-mdl2 (8+)

import React, { useState } from "react";
import { loginAsync } from "../../state/thunks";
import { useAppDispatch } from "../../state/hooks";
import { useUserState } from "../../state/userSlice";
import { Link, redirect, useLocation, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();
  const { loginError, user } = useUserState();

  const gap = { childrenGap: 10 };
  const dispatch = useAppDispatch();
  const handleSignIn = () => {
    dispatch(loginAsync({ email, password })).then(() => {
      //redirect to home page after login is successful
      if (location.state?.from) {
        navigate(location.state.from);
      } else {
        navigate("/");
      }
    });
  };

  return (
    <Stack
      verticalAlign="center"
      horizontalAlign="center"
      style={{ margin: "0px" }}
      tokens={gap}
    >
      <img src="/logoType.png" alt="logo" height={50} width={100} />
      <Label>Welcome Back! {user?.email}</Label>
      <TextField
        onChange={(e, v) => setEmail(v as string)}
        type="email"
        value={email}
        placeholder="Email"
      />
      <TextField
        onChange={(e, v) => setPassword(v as string)}
        value={password}
        type="password"
        placeholder="Password"
        errorMessage={loginError}
      />

      {/* <PrimaryButton text="Sign Out" onClick={handleSignOut} /> */}

      <PrimaryButton text="Sign In" onClick={handleSignIn} />
      <Link to="#">I forgot my password</Link>
    </Stack>
  );
}
