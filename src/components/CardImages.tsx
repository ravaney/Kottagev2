import React from "react";
import Carousel from "react-bootstrap/Carousel";

type CarouselProps = {};

export const CardImages = ({}: CarouselProps) => {
  const items = [
    {
      key: "carole",
      id: "carole",
      content: (
        <img src="https://fabricweb.azureedge.net/fabric-website/assets/images/avatar/CarolePoland.jpg" />
      ),
    },
    {
      key: "elvia",
      id: "elvia",
      content: (
        <img src="https://fabricweb.azureedge.net/fabric-website/assets/images/avatar/ElviaAtkins.jpg" />
      ),
    },
  ];
  return (
    <Carousel
      interval={1000}
      fade
      touch={true}
      indicators={false}
      wrap={true}
      slide={true}
      controls={false}
    >
      {items.map((item) => (
        <Carousel.Item
          style={{ display: "block", width: "250px" }}
          key={item.key}
        >
          {item.content}
        </Carousel.Item>
      ))}
    </Carousel>
  );
};
