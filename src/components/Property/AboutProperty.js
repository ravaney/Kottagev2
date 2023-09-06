import { Typography } from "@mui/material";
import SmokingRoomsIcon from "@mui/icons-material/SmokingRooms";
import SmokeFreeIcon from "@mui/icons-material/SmokeFree";
import propertyInfo from "../../../src/styles/PropertyInfo.module.css";
import { Stack, Text } from "@fluentui/react";
import { MdPets } from "react-icons/md";
import { FaBed } from "react-icons/fa";
import { MdBathtub } from "react-icons/md";
export default function AboutProperty() {
  //create a property object to test the component
  const property = {
    Id: 1,
    Name: "Villa Velha",
    Type: "House",
    Rooms: 2,
    Bathrooms: 1,
    Pets: true,
    Smoking: false,
    Patio: true,
    LivingRoom: true,
    Description:
      "Lorem ipsum dolor sit amet c  onsectetur adipisicing elit. Quos blanditiis tenetur unde suscipit, quam beatae rerum inventore consectetur, neque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti? Eum quasi quidem quibusdam.",
    address: "123 Test Street",
    reviews: [
      "This place is great!",
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lobortis elementum nibh tellus molestie nunc non blandit massa enim. Adipiscing vitae proin sagittis nisl rhoncus mattis rhoncus urna neque.",
    ],
  };

  const pushPin = {
    center: { address: property?.address },
    options: {
      title: property?.Name,
    },
  };

  return (
    <Stack id="about" style={{ padding: "0px 20px" }}>
      <Typography style={{ marginBottom: "10px" }} variant="h4">
        About this Property
      </Typography>
      <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 10 }}>
        <FaBed />
        {property?.Rooms}
        <MdBathtub />
        {property?.Bathrooms}
        {property?.Smoking == true ? <SmokingRoomsIcon /> : <SmokeFreeIcon />}
        {property?.Pets == true ? <MdPets /> : null}
      </Stack>

      <Text>{property?.Description}</Text>
    </Stack>
  );
}
