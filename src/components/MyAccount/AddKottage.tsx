import { PrimaryButton, Stack } from "@fluentui/react";
import { TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Kottage } from "../../state/propertySlice";
import { useAppDispatch } from "../../state/hooks";
import { addImagesAsync, addPropertyAsync } from "../../state/thunks";
import { v4 as uuidv4 } from "uuid";
import ImagePicker from "../ImagePicker";
type Props = {};

function AddKottage({}: Props) {
  const [kottage, setKottage] = useState({} as Kottage);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const [id, setId] = useState<string>("");
  useEffect(() => {
    setId(uuidv4());
  }, []);

  const gap = { childrenGap: 10 };
  const dispatch = useAppDispatch();

  const handleAddKottage = () => {
    console.log("hello");
    console.log(kottage);
    try {
      const property = { ...kottage, id: id };
      dispatch(addPropertyAsync({ property, Files: selectedImages }));
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Stack>
      <h1>Add Kottage</h1>
      <Stack style={{ width: "500px" }} tokens={gap}>
        <ImagePicker
          setSelectedImages={setSelectedImages}
          selectedImages={selectedImages}
        />
        <TextField
          label="Name"
          value={kottage.name}
          onChange={(e) =>
            setKottage((prev) => ({ ...prev, name: e.target.value }))
          }
        />
        <TextField
          label="Description"
          value={kottage.description}
          onChange={(e) =>
            setKottage((prev) => ({ ...prev, description: e.target.value }))
          }
        />
        <TextField
          label="Location"
          value={kottage.location}
          onChange={(e) =>
            setKottage((prev) => ({ ...prev, location: e.target.value }))
          }
        />
        <TextField
          label="Price"
          type="number"
          value={kottage.price}
          onChange={(e) =>
            setKottage((prev) => ({
              ...prev,
              price: parseInt(e.target.value.trim()),
            }))
          }
          inputProps={{ min: 0 }}
        />
        {/* <TextField
          label="Address"
          value={kottage.address}
          onChange={(e) =>
            setKottage((prev) => ({ ...prev, Address: e.target.value }))
          }
        /> */}
        <TextField
          label="Rooms"
          type="number"
          value={kottage.rooms}
          onChange={(e) =>
            setKottage((prev) => ({
              ...prev,
              rooms: parseInt(e.target.value.trim()),
            }))
          }
          inputProps={{ min: 0 }}
        />
        <TextField
          label="Bathrooms"
          type="number"
          value={kottage.bathrooms}
          onChange={(e) =>
            setKottage((prev) => ({
              ...prev,
              bathrooms: parseInt(e.target.value.trim()),
            }))
          }
          inputProps={{ min: 0 }}
        />
        <TextField
          label="Beds"
          type="number"
          value={kottage.beds}
          onChange={(e) =>
            setKottage((prev) => ({
              ...prev,
              beds: parseInt(e.target.value.trim()),
            }))
          }
          inputProps={{ min: 0 }}
        />
        <TextField
          label="Guests"
          type="number"
          value={kottage.guests}
          onChange={(e) =>
            setKottage((prev) => ({
              ...prev,
              guests: parseInt(e.target.value.trim()),
            }))
          }
          inputProps={{ min: 0 }}
        />
        <TextField
          label="Phone"
          type="phone"
          value={kottage.phone}
          onChange={(e) =>
            setKottage((prev) => ({ ...prev, phone: e.target.value }))
          }
        />
        <PrimaryButton onClick={handleAddKottage} text="Add Kottage" />
      </Stack>
    </Stack>
  );
}

export default AddKottage;
