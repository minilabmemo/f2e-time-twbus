import React, { useEffect, useState } from 'react';
import main from '../images/home_main.svg';
import carbon_bus from '../images/carbon_bus.svg';
const CityBusHome = () => {


  return (
    <>
      <section className="main">
        <img className="city-icon" src={main} alt="main_photo" width={'100%'} />
        <div className="main-text">
          <div >taiwan bus+</div>
          <div >台 灣 公 車 動 態</div>
          <div >時 刻 查 詢 系 統</div>
        </div>
      </section>

      <section className="cities">
        <div className="city-card city-color-1">
          <img className="city-icon" src={carbon_bus} alt="carbon_bus" />
          <div className="city-name">台北市 / 新北市</div>
          <div className="city-name-en"> Taipei / New Taipei</div>
        </div>

        <div className="city-card city-color-2">
          <img className="city-icon" src={carbon_bus} alt="carbon_bus" />
          <div className="city-name">桃園市</div>
          <div className="city-name-en">Taoyuan</div>
        </div>
        <div className="city-card city-color-3">
          <img className="city-icon" src={carbon_bus} alt="carbon_bus" />
          <div className="city-name">台中市</div>
          <div className="city-name-en">Taichung</div>
        </div>
        <div className="city-card city-color-4">
          <img className="city-icon" src={carbon_bus} alt="carbon_bus" />
          <div className="city-name">台南市</div>
          <div className="city-name-en">Tainan</div>
        </div>
        <div className="city-card city-color-5">
          <img className="city-icon" src={carbon_bus} alt="carbon_bus" />
          <div className="city-name">高雄市</div>
          <div className="city-name-en"> 高雄市</div>
        </div>
        <div className="city-card city-color-6">
          <img className="city-icon" src={carbon_bus} alt="carbon_bus" />
          <div className="city-name">其他地區</div>
          <div className="city-name-en">Other City</div>
        </div>
      </section>
    </>
  );
};

export default CityBusHome;
