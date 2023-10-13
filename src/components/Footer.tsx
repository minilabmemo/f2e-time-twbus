import React from 'react';
import styled from '@emotion/styled';
import { theme } from '../style/theme';
import { ThemeProvider } from '@emotion/react';

const FooterWrapper = styled.div`
  font-family: Noto Sans TC Black;
  font-size: .8em;
  font-weight: 900;
  line-height: 23px;
  letter-spacing: 0em;
  text-align: center;
  color: ${(props) => {
    return props.theme.descColor;
  }};
  width: 80%;
  margin: 30px auto;
  height: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: relative;
`;

export const Footer = () => {
  return (
    <ThemeProvider theme={theme}>
      <FooterWrapper>

        聯絡信箱 : minilabmemo+petfinder@gmail.com <br />
        Pet Finder TW@2023
      </FooterWrapper>
    </ThemeProvider>
  );
};
