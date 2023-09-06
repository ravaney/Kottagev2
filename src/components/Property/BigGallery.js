import galleryStyles from "../../styles/BigGallery.module.css";
import Carousel from "react-bootstrap/Carousel";

const BigGallery = () => {
  const images = [
    {
      url:
        "https://www.vilondo.com/wp-content/uploads/2018/11/bali-villa-m-02.jpg",
    },
    {
      url:
        "https://i.pinimg.com/originals/5f/ea/2f/5fea2ffdca0121a2d8d7e7dc080a046f.jpg",
    },
  ];
  return (
    <>
      <Carousel
        interval={8000}
        controls="false"
        className={galleryStyles.carousel}
      >
        {images.map((image) => (
          <Carousel.Item key={image.url}>
            <img src={image.url} className={galleryStyles.img} />
          </Carousel.Item>
        ))}
      </Carousel>
    </>
  );
};

export default BigGallery;
