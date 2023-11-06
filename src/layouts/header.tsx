import React, { useEffect, useState } from 'react';
import logo from '../assets/images/logo.svg';
import icon_language from '../assets/images/icon_language.svg';
import close from '../assets/images/close.svg';
import { useLocation } from 'react-router-dom';
import { theme } from '../styles/theme';
import { ThemeProvider } from '@emotion/react';
import { NavLink } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { LangStrings } from '../utils/i18n';





export const NavLinks = ({ className }: { isLangZH: boolean, className: string }) => {
  const { t, i18n } = useTranslation();

  return (
    <div className={className}>
      <NavLink to="/nearby" className="nav-link">
        {t('header.nearby')}
      </NavLink>



      <NavLink to={`/search/${i18n.language}/cities`} className="nav-link">
        {t('header.search')}
      </NavLink>
      <NavLink to={`/save/${i18n.language}`} className="nav-link">
        {t('header.save')}
      </NavLink>
    </div>
  )
}
export const LanguageOptions = ({ isLangZH, className, setLang }: { isLangZH: boolean, className: string, setLang: any }) => {

  let location = useLocation();
  function calculateStopsURL() {
    const oldLang = isLangZH ? "zh" : "en";
    const newLang = isLangZH ? "en" : "zh";
    return location.pathname.replace(oldLang, newLang);
  }
  return (
    <NavLink to={calculateStopsURL()} className="link" >
      <div className={className}>

        <img src={icon_language} alt="icon_save" className="lang-icon icon" />

        {/* TODO need by web URL*/}
        {isLangZH ?
          (<div onClick={() => setLang(LangStrings.en)}>
            <span className="active"> 中文</span>｜<span >英文</span></div>)
          :
          (
            <div onClick={() => setLang(LangStrings.zh)}>
              <span > 中文</span>｜<span className="active" >英文</span>
            </div>)
        }

      </div>
    </NavLink>
  )
}


export const Header = () => {
  const { i18n } = useTranslation();
  const [lang, setLang] = useState(null);
  useEffect(() => {
    if (lang !== null) i18n.changeLanguage(lang);
  }, [i18n, lang]);
  const isLangZH = (i18n.language === LangStrings.zh) ? true : false
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
        <LanguageOptions isLangZH={isLangZH} className="lang" setLang={setLang} />



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
              <LanguageOptions isLangZH={isLangZH} className="sidebar-lang" setLang={setLang} />
            </div>
          </>
        )}

      </div>
    </ThemeProvider >
  );
};
