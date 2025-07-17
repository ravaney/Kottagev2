import { Stack } from "@fluentui/react";
import React from "react";
import BigGallery from "./BigGallery";
import PropertyNav from "./PropertyNav";
import AboutProperty from "./AboutProperty";
import Policy from "./Policy";
import BookingMenu from "./BookingMenu";
import Reviews from "./Reviews";
import { Kottage } from "../../hooks";
import { useLocation } from "react-router-dom";




function ViewKottages() {
  //get the kottage from the useLocation hook or props
  const kottage = useLocation().state?.kottage as Kottage;
  const gap = { childrenGap: 10 };
  return (
    <Stack
      horizontal
      horizontalAlign="space-between"
      style={{ padding: "40px" }}
      tokens={gap}
    >
      <Stack style={{ width: "80%" }}>
        <BigGallery />
        <PropertyNav />
        <AboutProperty />
        <Policy />
        <Reviews />
      </Stack>
      <BookingMenu kottage={kottage} />
    </Stack>
  );
}

export default ViewKottages;
