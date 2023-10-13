import React, { useEffect, useState } from 'react';

import CarouselMUI from './base/CarouselMUI';


import styled from '@emotion/styled';



const CityBusHome = () => {
  const [isShown, setIsShown] = useState(false);

  return (
    <>
      <section onMouseEnter={() => setIsShown(true)} onMouseLeave={() => setIsShown(false)}
        style={{ width: "100%", height: "100%" }}>
        <CarouselMUI isShown={isShown} ></CarouselMUI>
      </section>




      <section></section>
    </>
  );
};

export default CityBusHome;
