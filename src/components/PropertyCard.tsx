import React, { useEffect } from "react";
import { Kottage } from "../state/propertySlice";
import {
  FontIcon,
  IconButton,
  Label,
  PrimaryButton,
  Stack,
  mergeStyleSets,
} from "@fluentui/react";
import {
  CardHeader,
  Avatar,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Card,
  Rating,
  styled,
} from "@mui/material";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import styles from "../styles/Kottages.module.css";
import SlideShow from "./SlideShow";
import { Colors } from "./constants";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
type Props = {
  property: Kottage;
};

const style = mergeStyleSets({
  description: {
    height: 50,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  button: { border: "none", backgroundColor: "red", color: "red" },
  actions: { bottom: 0 },
  icon: { fontSize: "1rem", cursor: "pointer" },
  link: { color: Colors.raspberry, textDecoration: "none" },
});

const StyledRating = styled(Rating)({
  "& .MuiRating-iconFilled": {
    color: Colors.raspberry,
  },
  "& .MuiRating-iconHover": {
    color: Colors.raspberry,
  },
});

export default function PropertyCard({ property }: Props) {
  const images = property?.images;

  const imageArray =
    images && Object.values(images).map((image) => image as string);
  console.log(imageArray);

  if (!property) return <div>loading...</div>;

  return (
    <Stack
      verticalAlign="center"
      horizontalAlign="center"
      style={{ position: "relative" }}
    >
      <Card sx={{ width: 300, height: 400, backgroundColor: Colors.offWhite }}>
        <CardMedia>
          <SlideShow images={imageArray as string[]} />
        </CardMedia>
        <CardContent sx={{ padding: "8px 8px 0px 8px" }}>
          <CardHeader
            sx={{
              padding: "0px",
              borderRadius: "5px",
              borderBottom: "1px solid lightgray",
            }}
            title={property.name}
            subheader={`City - ${property.location}`}
            // avatar={<Avatar src={auth?.currentUser?.photoURL as string} />}
          />
          <Typography
            variant="body2"
            color="text.secondary"
            className={style.description}
          >
            {property.description}
          </Typography>
        </CardContent>
        <CardActions
          sx={{
            bottom: 0,
            position: "absolute",
            width: "100%",
          }}
        >
          <Stack
            verticalAlign="center"
            horizontalAlign="space-between"
            style={{ width: "100%" }}
          >
            <Stack horizontal horizontalAlign="space-between">
              <StyledRating
                name="read-only"
                readOnly
                value={4}
                icon={<FavoriteIcon />}
                emptyIcon={<FavoriteBorderIcon />}
              />
              <Link to="/" className={style.link}>
                View 25 reviews
              </Link>
            </Stack>
            <Label>Starting at ${property.price}.00 per night</Label>
            <PrimaryButton text="Reserve" />
          </Stack>
        </CardActions>
      </Card>
    </Stack>
  );
}
