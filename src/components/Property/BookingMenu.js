import {
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Rating,
} from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";
import { useState } from "react";
import React from "react";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import PropertyStyles from "../../styles/PropertyInfo.module.css";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { DatePicker, Stack } from "@fluentui/react";
import { Colors } from "../constants";

export default function BookingMenu() {
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [avgRating, setAvgRating] = useState(0);
  const [weights, setWeights] = useState([]);
  const [values, setValues] = useState([]);
  const ratings = {
    1: "Very Poor",
    2: "Poor+",
    3: "Ok",
    4: "Good",
    5: "Excellent!",
  };

  const property = {
    Id: 1,
    Name: "Test Property",
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
  };
  const gap = { childrenGap: 10 };
  return (
    <>
      <Stack>
        <div className={PropertyStyles.price}>
          <Typography
            variant="h5"
            style={{
              justifyContent: "space-between",
              // textAlign: "center",
              alignItems: "center",
              display: "flex",
              color: Colors.raspberry,
              paddingTop: "0px",
            }}
          >
            {property?.Name}
            <IconButton
              aria-label="save to favourites"
              style={{ margin: "0% 0% 0% 0%", color: Colors.raspberry }}
            >
              <FavoriteBorderIcon fontSize="large" />
            </IconButton>
          </Typography>

          <Typography>
            <span style={{ fontSize: "32px" }}>$300</span>{" "}
            <span style={{ lineHeight: "50%", fontSize: "14px" }}>
              avg/night
            </span>
          </Typography>
          <Stack horizontal horizontalAlign="start" tokens={gap}>
            <Rating
              name="controlled"
              value={property?.Rating}
              defaultValue={4}
              readOnly
              precision={1}
              icon={
                <FavoriteIcon
                  fontSize="inherit"
                  style={{ color: Colors.raspberry }}
                />
              }
              emptyIcon={<FavoriteIcon fontSize="inherit" />}
            />
            <a style={{ color: "blue" }}>(14 reviews)</a>
          </Stack>

          <div style={{ display: "flex", marginTop: "32px" }}>
            <InfoOutlined style={{ color: "red" }} />
            {/* <UseAnimations animation={alertOctagon} size={40} /> */}
            <span style={{ fontSize: "16px" }}>
              Add dates for total pricing
            </span>
          </div>
        </div>
        <div className={PropertyStyles.calContainer}>
          <DatePicker
            className={PropertyStyles.cal}
            label="Check-in"
            value={startDate}
            onChange={(newValue) => {
              setStartDate(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
          />

          <DatePicker
            className={PropertyStyles.cal}
            label="Check-out"
            openTo="day"
            value={endDate}
            onChange={(newValue) => {
              setEndDate(newValue);
            }}
            minDate={startDate}
            renderInput={(params) => <TextField {...params} />}
          />
          <TextField
            className={PropertyStyles.guest}
            //   label="Guests"
            placeholder="1"
            type="number"
            InputProps={{
              min: 1,
              startAdornment: (
                <InputAdornment position="start">
                  <PeopleAltIcon />
                  <Typography>Guests</Typography>
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div className={PropertyStyles.searchContainer}>
          <IconButton
            aria-label="Check Availability button"
            className={PropertyStyles.searchButton}
          >
            Book property
          </IconButton>
          <div className={PropertyStyles.note}>
            <Typography
              style={{
                fontSize: ".875rem",
                display: "flex",
                // margin: "0px 0px 16px 0px",
              }}
            >
              <HelpCenterIcon style={{ color: "red" }} />
              <span>
                <b>Free cancellation</b> up to{" "}
                <span style={{ color: "blue" }}>14 days before check-in</span>
              </span>
            </Typography>
          </div>
          <div
            style={{
              borderTop: "1px solid grey",
              borderBottom: "1px solid grey",
              padding: "16px",
              display: "flex",
            }}
          >
            <Typography className={PropertyStyles.contact}>
              Contact host
            </Typography>
          </div>
          <Typography className={PropertyStyles.property}>
            <b>Property # {property.Id}</b>
          </Typography>
        </div>
      </Stack>
    </>
  );
}
