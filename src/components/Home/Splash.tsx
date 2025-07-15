import { Stack } from "@fluentui/react";
import React from "react";
import { SearchBar } from "./SearchBar";
import PopularKottages from "./PopularKottages";
import TrendingRegion from "./TrendingRegion";
import { Typography } from "@mui/material";

export const Splash = () => {
  //create a function to navigate to the different pages using Link from next.js
  const gap = { childrenGap: 10 };
  return (
    <>
      <Stack
        verticalAlign="center"
        horizontalAlign="start"
        style={{ height: "80vh", padding: "40px", position: "relative" }}
        tokens={gap}
      >
        <img
          src="/swift river.jpg"
          alt="cabin"
          style={{
            objectFit: "cover",
            width: "100%",
            height: "100%",
            filter: "brightness(80%)",
          }}
        />
        <Stack verticalAlign="start">
          <Typography
            variant="h2"
            style={{
              position: "absolute",
              top: "60%",
              marginLeft: "20px",
              color: "white",
            }}
          >
            welcome to yaad
          </Typography>
          <div
            style={{
              position: "absolute",
              top: "70%",
              marginLeft: "20px",
              color: "white",
            }}
          >
            <SearchBar />
          </div>
        </Stack>
      </Stack>
      <PopularKottages />
      <TrendingRegion />
    </>
  );
};
export default Splash;
