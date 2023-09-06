import { Card, CardMedia, CardContent, CardActionArea } from "@mui/material";
import cardStyles from "../../styles/ShowCabins.module.css";
import cards from "./cards.json";
import { Label, Stack } from "@fluentui/react";

const ShowCabins = () => {
  return (
    <Stack
      horizontalAlign="start"
      style={{
        borderRadius: "20px",
        padding: "20px 40px",
      }}
    >
      <Label styles={{ root: { fontSize: "20px", fontWeight: "bold" } }}>
        Portland is Trending
      </Label>{" "}
      <Stack
        horizontalAlign="space-evenly"
        horizontal
        style={{ width: "100%", overflow: "hidden" }}
        tokens={{ childrenGap: 2 }}
      >
        <img
          style={{ objectFit: "cover" }}
          src={"/swift river.jpg"}
          width="300px"
          height="600px"
        />
        <img
          style={{ objectFit: "cover" }}
          src={"/frenchman.jpg"}
          width="300px"
          height="600px"
        />
        <img
          style={{ objectFit: "cover" }}
          src={"/Port_antonio2.jpg"}
          width="300px"
          height="600px"
        />
        <img
          style={{ objectFit: "cover" }}
          src={"/Geejam1.jpg"}
          width="300px"
          height="600px"
        />
        <img
          style={{ objectFit: "cover" }}
          src={"/Geejam2.jpg"}
          width="300px"
          height="600px"
        />
      </Stack>
    </Stack>
  );
};

export default ShowCabins;
