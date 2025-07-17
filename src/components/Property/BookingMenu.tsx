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
import { Kottage } from "../../hooks";

interface IBookingMenuProps {
  kottage: Kottage;
}

export default function BookingMenu({ kottage }: IBookingMenuProps): JSX.Element {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [avgRating, setAvgRating] = useState<number>(0);
  const [weights, setWeights] = useState<number[]>([]);
  const [values, setValues] = useState<number[]>([]);
  

  
  const gap = { childrenGap: 10 };
  
  return (
    <>
      <Stack>
        <div className={PropertyStyles.price}>
          <Typography
            variant="h5"
            style={{
              justifyContent: "space-between",
              alignItems: "center",
              display: "flex",
              color: Colors.raspberry,
              paddingTop: "0px",
            }}
          >
            {kottage?.name}
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
              value={kottage?.rating}
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
            <a style={{ color: "blue" }} href="#reviews">
              (14 reviews)
            </a>
          </Stack>

          <div style={{ display: "flex", marginTop: "32px" }}>
            <InfoOutlined style={{ color: "red" }} />
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
            onSelectDate={(newValue: Date | null | undefined) => {
              setStartDate(newValue || undefined);
            }}
          />

          <DatePicker
            className={PropertyStyles.cal}
            label="Check-out"
            value={endDate}
            onSelectDate={(newValue: Date | null | undefined) => {
              setEndDate(newValue || undefined);
            }}
            minDate={startDate}
          />
          <TextField
            className={PropertyStyles.guest}
            placeholder="1"
            type="number"
            InputProps={{
              inputProps: { min: 1 },
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
            <b>Property # {kottage.id}</b>
          </Typography>
        </div>
      </Stack>
    </>
  );
}