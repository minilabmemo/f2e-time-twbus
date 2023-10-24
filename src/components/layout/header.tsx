import React, { useEffect, useState } from 'react';
import logo from '../../images/logo.svg';
import icon_language from '../../images/icon_language.svg';

import { theme } from '../../style/theme';
import { ThemeProvider } from '@emotion/react';
import { NavLink } from 'react-router-dom';
import { LinkNames } from '../../utils/const';



export const Header = () => {
  const [isLangZH, setLangZH] = useState(true);


  return (
    <ThemeProvider theme={theme}>
      <div className='header'>
        <div className='brand'>
          <NavLink to="/" className="home-link">
            <img src={logo} alt="logo" width={'162px'} height={'42px'} />
          </NavLink>
        </div>


        <div className='nav'>
          <NavLink to="/nearby" className="nav-link">
            {isLangZH ? LinkNames.about.text : LinkNames.about.short}
          </NavLink>

          <NavLink to="/find-pet" className="nav-link">
            {isLangZH ? LinkNames.find.text : LinkNames.find.short}

          </NavLink>

          <NavLink to={`/search/zh/cities`} className="nav-link">
            {isLangZH ? LinkNames.search.zh : LinkNames.search.en}
          </NavLink>
          <NavLink to="/chart" className="nav-link">
            {isLangZH ? LinkNames.chart.text : LinkNames.chart.short}
          </NavLink>
        </div>

        <div className="lang">

          <img width="20px" height="20px" src={icon_language} alt="icon_save" />

          {/* TODO need by web URL*/}
          {isLangZH ?
            (<div onClick={() => setLangZH(!isLangZH)}>
              <span className="active"> 中文</span>｜<span >英文</span></div>)
            :
            (
              <div onClick={() => setLangZH(!isLangZH)}>
                <span > 中文</span>｜<span className="active" >英文</span>
              </div>)
          }

        </div>


      </div>
    </ThemeProvider >
  );
};
