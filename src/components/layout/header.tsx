import React, { useEffect, useState } from 'react';
import logo from '../../images/logo.svg';
import icon_language from '../../images/icon_language.svg';

import { theme } from '../../style/theme';
import { ThemeProvider } from '@emotion/react';
import { NavLink } from 'react-router-dom';
import { NawText } from '../const';



export const Header = () => {
  const [isBigScreen, setSmallScreen] = useState(false);
  const handleOnResize = () => {


    const nowWidth = document.documentElement.offsetWidth;
    if (nowWidth > 1500) {
      setSmallScreen(true)
    } else {
      setSmallScreen(false)
    }

  };

  useEffect(() => {
    handleOnResize();
    window.addEventListener('resize', handleOnResize);
    return () => {
      window.removeEventListener('resize', handleOnResize);
    };
  }, [isBigScreen]);

  return (
    <ThemeProvider theme={theme}>
      <div className='header'>
        <div className='brand'>
          <NavLink to="/" className="home-link">
            <img src={logo} alt="logo" width={'162px'} height={'42px'} />
          </NavLink>
        </div>

        <div className='nav'>
          <NavLink to="/about" className="nav-link">
            {isBigScreen ? NawText.about.text : NawText.about.short}
          </NavLink>

          <NavLink to="/find-pet" className="nav-link">
            {isBigScreen ? NawText.find.text : NawText.find.short}

          </NavLink>
          <NavLink to="/adopt" className="nav-link">

            {isBigScreen ? NawText.adopt.text : NawText.adopt.short}
          </NavLink>
          <NavLink to="/chart" className="nav-link">
            {isBigScreen ? NawText.chart.text : NawText.chart.short}
          </NavLink>
        </div>

        <div className="lang">

          <img width="20px" height="20px" src={icon_language} alt="icon_save" />
          <span >中文</span>｜<span >英文</span>

        </div>


      </div>
    </ThemeProvider >
  );
};
