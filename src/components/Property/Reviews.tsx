import {
  Label,
  Stack,
  Text,
  TextField,
  merge,
  mergeStyleSets,
} from "@fluentui/react";
import React from "react";
import { Reviews as ReviewsIcon } from "@mui/icons-material";
import { Colors } from "../constants";
import { Rating, styled } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
const reviews = {
  reviews: [
    { comment: "This place is great!", id: 1, name: "John Doe", rating: 5 },
    {
      id: 2,
      name: "Jane Doe",
      rating: 4,
      comment:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lobortis elementum nibh tellus molestie nunc non blandit massa enim. Adipiscing vitae proin sagittis nisl rhoncus mattis rhoncus urna neque.",
    },
  ],
};

const style = mergeStyleSets({
  label: { color: Colors.blue, whiteSpace: "nowrap" },
  icon: { color: Colors.raspberry },
  review: { textAlign: "right", alignItems: "right", justifyContent: "right" },
  commentBox: { width: "100%" },
  container: {
    width: "100%",
    boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.75)",
    borderRadius: "5px",
    padding: "5px",
  },
});
const StyledRating = styled(Rating)({
  "& .MuiRating-iconFilled": {
    color: Colors.raspberry,
  },
  "& .MuiRating-iconHover": {
    color: Colors.raspberry,
  },
});

const gap10 = { childrenGap: 10 };

function Reviews() {
  return (
    <Stack
      id="reviews"
      style={{ backgroundColor: "white", padding: "20px" }}
      tokens={gap10}
    >
      <Label>Reviews</Label>
      {reviews.reviews.map((review) => {
        return (
          <Stack
            horizontal
            key={review.id}
            verticalAlign="center"
            tokens={gap10}
            className={style.container}
          >
            <ReviewsIcon className={style.icon} />
            <Label className={style.label}>{review.name}</Label>
            <Stack className={style.commentBox}>
              <Text>{review.comment}</Text>
              <StyledRating
                className={style.review}
                name="review-rating"
                readOnly
                value={review.rating}
                icon={<FavoriteIcon />}
                emptyIcon={<FavoriteBorderIcon />}
              />
            </Stack>
          </Stack>
        );
      })}
    </Stack>
  );
}

export default Reviews;
