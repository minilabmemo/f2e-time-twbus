import React, { useEffect, useState } from 'react';
import logo from '../images/logo.svg';
import icon_language from '../images/icon_language.svg';

import { theme } from '../styles/theme';
import { ThemeProvider } from '@emotion/react';
import { NavLink } from 'react-router-dom';
import { LinkNames, URI_SAVE_DEFAULT } from '../utils/const';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';



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
            {isLangZH ? LinkNames.nearby.zh : LinkNames.nearby.en}
          </NavLink>



          <NavLink to={`/search/zh/cities`} className="nav-link">
            {isLangZH ? LinkNames.search.zh : LinkNames.search.en}
          </NavLink>
          <NavLink to={`/save/zh`} className="nav-link">
            {isLangZH ? LinkNames.save.zh : LinkNames.save.en}
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


        <div className='phone-options'>
          <FontAwesomeIcon icon={faBars} />
        </div>

      </div>
    </ThemeProvider >
  );
};
