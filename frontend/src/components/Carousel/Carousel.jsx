import React from 'react';
import Slider from 'react-slick';
import w1 from './w1.png';
import w2 from './w2.png';
import w3 from './w3.png';
import w4 from './w4.png';
import w5 from './w5.png';
import "./Carousel.css";


const Carousel = () => {
  // Slick settings with autoplay enabled
  const settings = {
    dots: true, // Show navigation dots
    infinite: true, // Loop through images
    speed: 500, // Transition speed in ms
    autoplay: true, // Enable autoplay
    autoplaySpeed: 2000, // Slide every 5 seconds
    slidesToShow: 1, // Show 1 slide at a time
    slidesToScroll: 1, // Scroll 1 slide at a time
    pauseOnHover:true,
  };

  return (
    <div className="carousel-container">
      <Slider {...settings}>
        <div>
          <img src={w1} alt="Image 1" />
        </div>
        <div>
          <img src={w2} alt="Image 2" />
        </div>
        <div>
          <img src={w3} alt="Image 3" />
        </div>
        <div>
          <img src={w4} alt="Image 4" />
        </div>
        <div>
          <img src={w5} alt="Image 5" />
        </div>
      </Slider>
    </div>
  );
};

export default Carousel;
