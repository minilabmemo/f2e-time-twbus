import React, { useEffect, useState } from 'react';
import main from '../images/home_main.svg';

const CityBusHome = () => {


  return (
    <>
      <section className="main">
        <img src={main} alt="main_photo" width={'100%'} />
        <div className="main-text">
          <div >taiwan bus+</div>
          <div >台 灣 公 車 動 態</div>
          <div >時 刻 查 詢 系 統</div>
        </div>
      </section>




      <section></section>
    </>
  );
};

export default CityBusHome;
