import { mergeStyleSets } from "@fluentui/react";
import React, { useState } from "react";
import { FcNext, FcPrevious } from "react-icons/fc";
type Props = {
  images: string[];
};

const style = mergeStyleSets({
  next: {
    top: "50%",
    right: "0",
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.2)",
    border: "none",
    boxShadow: "1px 1px 1px 1px rgba(0,0,0,0.2)",
  },
  prev: {
    top: "50%",
    left: "0",
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.2)",
    border: "none",
    boxShadow: "1px 1px 1px 1px rgba(0,0,0,0.2)",
  },
});

function SlideShow({ images }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    // Calculate the index of the next slide, looping back to the first slide if necessary
    setCurrentIndex((currentIndex) => (currentIndex + 1) % images.length);
  };
  const prevSlide = () => {
    //use images.length to calculate the index of the previous slide, looping back to the last slide if necessary
    setCurrentIndex((currentIndex) =>
      currentIndex === 0 ? images.length - 1 : currentIndex - 1
    );
  };

  return (
    <div style={{ position: "relative" }}>
      <img
        src={images?.[currentIndex]}
        style={{ objectFit: "cover" }}
        alt="cabin"
        width="100%"
        height="200px"
      />
      {images.length > 1 && (
        <>
          <button onClick={prevSlide} className={style.prev}>
            <FcPrevious />
          </button>
          <button onClick={nextSlide} className={style.next}>
            <FcNext />
          </button>
        </>
      )}
    </div>
  );
}

export default SlideShow;
