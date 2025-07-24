import React from "react";
import Carousel from "react-bootstrap/Carousel";

const BookCarousel = () => {
  return (
    <div className="container mt-4">
      <Carousel>
        <Carousel.Item>
          <img
            className="d-block w-100"
            style={{ height: "400px", objectFit: "cover" }}
            src="https://www.rd.com/wp-content/uploads/2024/09/Quotes-About-Reading-Thatll-Inspire-You-to-Open-a-Book_GettyImages-1700683583_ASedit_4.jpg?fit=700,700"
            alt="First slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            style={{ height: "400px", objectFit: "cover" }}
            src="https://www.rd.com/wp-content/uploads/2024/09/Quotes-About-Reading-Thatll-Inspire-You-to-Open-a-Book_GettyImages-1700683583_ASedit_3.jpg?fit=700,700"
            alt="Second slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            style={{ height: "400px", objectFit: "cover" }}
            src="https://www.rd.com/wp-content/uploads/2024/09/Quotes-About-Reading-Thatll-Inspire-You-to-Open-a-Book_GettyImages-1700683583_ASedit_1.jpg?fit=700,700"
            alt="Third slide"
          />
        </Carousel.Item>
      </Carousel>
    </div>
  );
};

export default BookCarousel;
