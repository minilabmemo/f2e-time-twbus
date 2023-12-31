import React, { useEffect, useState } from 'react';
import main from '../../images//home_main_phone.svg';
import BusSvg from '../../components/Icons/BusSvg';
import { IconColors } from '../../utils/color';
import { NavLink } from 'react-router-dom';
const CityBusHome = () => {


  return (
    <>
      <section className="home-main">
        <div className='photo_wrap'>
          <div className="main-text">
            <div >taiwan bus+</div>
            <div >台 灣 公 車 動 態</div>
            <div >時 刻 查 詢 系 統</div>
          </div>
        </div>

        {/* TBD */}

      </section>

      <section className="home-cities">

        <NavLink to={`/search/zh/Taipei`} className="city-card city-color-black city-link">

          <div className="city-icon"> <BusSvg fill={IconColors.blackFont} /></div>

          <div className="city-name">台北市 </div>
          <div className="city-name-en"> Taipei </div>

        </NavLink>

        <NavLink to={`/search/zh/Taoyuan`} className="city-card city-color-blue city-link">
          <div className="city-icon"> <BusSvg fill={IconColors.blueFont} /></div>
          <div className="city-name">桃園市</div>
          <div className="city-name-en">Taoyuan</div>
        </NavLink>
        <NavLink to={`/search/zh/Taichung`} className="city-card city-color-pink city-link">
          <div className="city-icon"> <BusSvg fill={IconColors.pinkFont} /></div>
          <div className="city-name">台中市</div>
          <div className="city-name-en">Taichung</div>
        </NavLink>
        <NavLink to={`/search/zh/Tainan`} className="city-card city-color-cyan city-link">
          <div className="city-icon"> <BusSvg fill={IconColors.cyanFont} /></div>
          <div className="city-name">台南市</div>
          <div className="city-name-en">Tainan</div>
        </NavLink>
        <NavLink to={`/search/zh/Kaohsiung`} className="city-card city-color-blue-light city-link">
          <div className="city-icon"> <BusSvg fill={IconColors.blueLightFont} /></div>
          <div className="city-name">高雄市</div>
          <div className="city-name-en"> Kaohsiung</div>
        </NavLink>
        <NavLink to={`/search/zh/cities`} className="city-card city-color-blue-dark city-link">
          <div className="city-icon"> <BusSvg fill={IconColors.blueDarkFont} /></div>
          <div className="city-name">其他地區</div>
          <div className="city-name-en">Other City</div>
        </NavLink>
      </section>


    </>
  );
};

export default CityBusHome;
