import React, { useEffect, useState } from 'react';
import brand from '../images/brand.svg';
import icon_save from '../images/icon_save.svg';
import styled from '@emotion/styled';
import { theme } from '../style/theme';
import { ThemeProvider } from '@emotion/react';
import { NavLink } from 'react-router-dom';
import { NawText, save_text } from './const';

const HeaderBar = styled.div`
  font-size: .9em;
  line-height: 26px;
  letter-spacing: normal;
  text-align: left;
  color: ${(props) => {
    return props.theme.primeColor;
  }};

  width: 90%;
  margin: 0 auto;
  padding-top: 2.5em;
  height: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: relative;
  flex-wrap:wrap ;
`;




const Store = styled.div`

  right: 5px;
  background-color: ${(props) => {
    return props.theme.secondColor;
  }};
 

`;
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
      <HeaderBar data-testid="header-component">
        <div className='brand'>
          <NavLink to="/" className="home-link">
            <img src={brand} alt="brand" />
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

        <Store className="store">
          <NavLink to="/stores" className="store-link">
            <img width="20px" height="20px" src={icon_save} alt="icon_save" />
            <span >{save_text}</span>
          </NavLink>
        </Store>


      </HeaderBar>
    </ThemeProvider >
  );
};
