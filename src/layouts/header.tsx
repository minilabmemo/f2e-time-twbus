import React, { useEffect, useState } from 'react';
import logo from '../assets/images/logo.svg';
import icon_language from '../assets/images/icon_language.svg';
import close from '../assets/images/close.svg';
import { useLocation } from 'react-router-dom';
import { theme } from '../styles/theme';
import { ThemeProvider } from '@emotion/react';
import { NavLink } from 'react-router-dom';
import { LinkNames, URI_SAVE_DEFAULT } from '../utils/const';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';




export const NavLinks = ({ isLangZH, className }: { isLangZH: boolean, className: string }) => {
  return (
    <div className={className}>
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
  )
}
export const LanguageOptions = ({ isLangZH, className, setLangZH }: { isLangZH: boolean, className: string, setLangZH: (value: React.SetStateAction<boolean>) => void }) => {
  return (
    <div className={className}>

      <img src={icon_language} alt="icon_save" className="lang-icon icon" />

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
  )
}


export const Header = () => {
  const [isLangZH, setLangZH] = useState(true);
  let location = useLocation();
  const [isSmallOption, setSmallOption] = useState(false)
  useEffect(() => {//發生點擊 NavLink 就先關閉選單
    setSmallOption(false)
  }, [location])


  return (
    <ThemeProvider theme={theme}>
      <div className='header'>
        <div className='brand'>
          <NavLink to="/" className="home-link">
            <img src={logo} alt="logo" width={'162px'} height={'42px'} />
          </NavLink>
        </div>


        <NavLinks isLangZH={isLangZH} className="nav" />
        <LanguageOptions isLangZH={isLangZH} className="lang" setLangZH={setLangZH} />



        <div className='phone-options' onClick={() => { setSmallOption(!isSmallOption) }}>
          <FontAwesomeIcon icon={faBars} />
        </div>

        {isSmallOption && (
          <>
            <div className='bg-blur'></div>
            <div className='header-sidebar'>
              <div className='box'>
                <div className='brand sidebar'>
                  <NavLink to="/" className="home-link">
                    <img src={logo} alt="logo" />
                  </NavLink>
                </div>
                <div className='close-sidebar' onClick={() => { setSmallOption(!isSmallOption) }}>
                  <img src={close} alt="close" />
                </div>
              </div>

              <div>
                <NavLinks isLangZH={isLangZH} className="sidebar-nav" />
              </div>
              <LanguageOptions isLangZH={isLangZH} className="sidebar-lang" setLangZH={setLangZH} />
            </div>
          </>
        )}

      </div>
    </ThemeProvider >
  );
};
