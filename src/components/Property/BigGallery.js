import galleryStyles from "../../styles/BigGallery.module.css";
import Carousel from "react-bootstrap/Carousel";

const BigGallery = ({ images }) => {
  return (
    <div style={{ position: 'relative' }}>
      <Carousel
        interval={8000}
        controls="false"
      >
        {images.map((image) => (
          <Carousel.Item key={image}>
            <img src={image} className={galleryStyles.img} />
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default BigGallery;
