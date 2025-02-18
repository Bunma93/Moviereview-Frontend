import React from 'react';
import { Carousel } from 'antd';

const contentStyle = {
  height: '200px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79',
};

const CoverPageCarousel = () => (
  <Carousel autoplay>
    <div>
      <div style={contentStyle}>
        123
      </div>
    </div>
    <div>
      <h3 style={contentStyle}>2</h3>
    </div>
    <div>
      <h3 style={contentStyle}>3</h3>
    </div>
    <div>
      <h3 style={contentStyle}>4</h3>
    </div>
  </Carousel>
);
export default CoverPageCarousel;