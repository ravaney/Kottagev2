import React from "react";
import { Label, Modal, PrimaryButton, Stack, TextField } from "@fluentui/react";
import { Colors } from "../constants";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import { IconButton } from "@mui/material";
import { useAuth } from "../../hooks";

export default function Address() {
  const { firebaseUser } = useAuth();
  const [show, setShow] = React.useState(false);

  const handleClose = () => setShow(false);
  return (
    <>
      <IconButton onClick={() => setShow(true)}>
        <ContactMailIcon color="primary" />
        <Label style={{ cursor: "pointer", padding: "5px" }}>
          Change Address
        </Label>
      </IconButton>

      <Modal
        isOpen={show}
        onDismiss={handleClose}
        isBlocking={false}
        allowTouchBodyScroll={true}
        styles={{
          main: {
            width: "400px",
            borderRadius: "10px",
          },
        }}
      >
        <Stack
          horizontalAlign="center"
          style={{ width: "100%", backgroundColor: Colors.powderBlue }}
        >
          <Label>Update Address</Label>
        </Stack>
        <Stack style={{ padding: "20px" }}>
          {/* <TextField label="Address" placeholder={user?.address?.address1} />
          <TextField label="Address 2" placeholder={user?.address?.address2} />
          <TextField label="City" placeholder={user?.address?.city} />
          <TextField label="State" placeholder={user?.address?.state} />
          <TextField label="Zip Code" placeholder={user?.address?.zip} />
          <TextField
            label="Post Code"
            placeholder={user?.address?.postalCode}
          />
          <TextField label="Country" placeholder={user?.address?.country} /> */}
          <PrimaryButton text="Save" />
        </Stack>
      </Modal>
    </>
  );
}
