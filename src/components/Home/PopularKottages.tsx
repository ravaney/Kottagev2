import { FontIcon, Label, Stack } from "@fluentui/react";
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Chip,
  Typography,
} from "@mui/material";
import React from "react";
import cards from "./cards.json";
import style from "../../styles/Kottages.module.css";
import PopularKottageStyle from "../../styles/PopularKottages.module.css";
import { AiFillHeart } from "react-icons/ai";
import { IoMdShareAlt } from "react-icons/io";
type Props = {};

function PopularKottages({}: Props) {
  const gap = { childrenGap: 10 };
  return (
    <Stack className={PopularKottageStyle.container}>
      <Stack horizontalAlign="start">
        <Label className={PopularKottageStyle.label}>Popular Kottages</Label>
      </Stack>
      <Stack
        horizontal
        horizontalAlign="start"
        tokens={gap}
        className={PopularKottageStyle.cardContainer}
        disableShrink
      >
        {cards.map((card, key) => (
          <Card className={PopularKottageStyle.card} key={key}>
            <CardMedia>
              <img
                src={card.url}
                alt="cabin"
                className={PopularKottageStyle.cardImage}
              />
            </CardMedia>
            <CardHeader
              title={card.region}
              className={PopularKottageStyle.cardHeader}
            />
            <CardContent className={PopularKottageStyle.cardContent}>
              <Typography>{card.text}</Typography>
            </CardContent>
            <CardActions className={PopularKottageStyle.cardActions}>
              <Chip
                color="info"
                label="$430.00"
                className={PopularKottageStyle.price}
              />
              <Stack horizontal tokens={gap}>
                <IoMdShareAlt className={style.share} />
                <AiFillHeart className={style.favourite} />
              </Stack>
            </CardActions>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
}

export default PopularKottages;
