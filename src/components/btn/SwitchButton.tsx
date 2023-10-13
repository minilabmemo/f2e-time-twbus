import React, { useState } from 'react';

import { SerializedStyles, Theme, css, useTheme } from '@emotion/react';
import styled from '@emotion/styled';

type ButtonType = 'select' | 'save' | 'text';

interface SwitchButtonI {
  isActive: boolean;
  icon?: React.ReactNode;
  text?: string;
  btnType: ButtonType;
  onClick: () => void; // Add onClick prop
}
const buttonStyle = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  box-sizing: border-box;
  outline: none;
  font-size: .7em;
  padding: .7em;
  border-radius: 10px;
  width: auto;
  height: 40px;
  margin: 5px;

`;
const defaultStyle = (theme: Theme) => css`
  background-color: 'red';
  color: 'blue';
  box-shadow: 0px .2em .2em 0px #b5e5ff;
`;
const selectStyle = (theme: Theme) => css`
  background-color: ${theme.selectBtn ? theme.selectBtn.active.background : 'red'};
  color: ${theme.selectBtn ? theme.selectBtn.active.text : 'blue'};
  box-shadow: 0px .2em .2em 0px #b5e5ff;
`;
const selectInActiveStyle = (theme: Theme) => css`
  background-color: ${theme.selectBtn ? theme.selectBtn.inActive.background : 'red'};
  color: ${theme.selectBtn ? theme.selectBtn.inActive.text : 'blue'};
  box-shadow: 0px 0px 0px 0px #000;
`;

const saveStyle = (theme: Theme) => css`
  background-color: ${theme.selectBtn ? theme.saveBtn.active.background : 'red'};
  color: ${theme.selectBtn ? theme.saveBtn.active.text : 'blue'};
`;

const saveInActiveStyle = (theme: Theme) => css`
  background-color: ${theme.selectBtn ? theme.saveBtn.inActive.background : 'red'};
  color: ${theme.selectBtn ? theme.saveBtn.inActive.text : 'blue'};
  box-shadow: 0px 0px 0px 0px #000;
`;

const textFontStyle = css`
  text-align: center;
  font-size: 1em;

  font-style: normal;
  font-weight: 700;
  line-height: normal;
  padding: 8px 16px;
`;
const textStyle = (theme: Theme) => css`
  ${textFontStyle};
  background-color: ${theme.selectBtn ? theme.selectBtn.active.background : 'red'};
  color: ${theme.selectBtn ? theme.selectBtn.active.text : 'blue'};
  box-shadow: 0px .2em .2em 0px #b5e5ff;
  color: #fafafa;
`;
const textActiveStyle = (theme: Theme) => css`
  ${textFontStyle};
  background-color: ${theme.selectBtn ? theme.selectBtn.inActive.background : 'red'};
  color: ${theme.selectBtn ? theme.selectBtn.inActive.text : 'blue'};
  box-shadow: 0px 0px 0px 0px #000;
`;

const setStyle = (theme: Theme, btnType: ButtonType, isActive: boolean): SerializedStyles => {
  if (btnType === 'select') {
    if (isActive) {
      return selectStyle(theme);
    }
    return selectInActiveStyle(theme);
  }
  if (btnType === 'save') {
    if (isActive) {
      return saveStyle(theme);
    }
    return saveInActiveStyle(theme);
  }
  if (btnType === 'text') {
    if (isActive) {
      return textStyle(theme);
    }
    return textActiveStyle(theme);
  }
  return defaultStyle(theme);
};

interface SwitchButtonWrapperI {
  theme?: Theme;
  btnType: ButtonType;
  disabled: boolean;
}
const SwitchButtonWrapper = styled.div<SwitchButtonWrapperI>`
  ${buttonStyle};
  ${(props) => setStyle(props.theme, props.btnType, props.disabled)};
`;

const Text = styled.div<{ btnType: ButtonType }>`
  ${(props) => setTextPosStyle(props.btnType)};
`;
const defaultTextStyle = () => css`
  align-self: end;
  user-select: none;
  white-space: nowrap;
  margin-left: .2em;
`;
const onlyTextStyle = () => css`
  font-size:14px ;
  align-self: end;
  user-select: none;
  white-space: nowrap;
`;
const setTextPosStyle = (btnType: ButtonType): SerializedStyles => {
  if (btnType === 'text') {
    return onlyTextStyle();
  }
  return defaultTextStyle();
};

/**
 * `SwitchButton` 是一個按鈕,根據點擊顯示不同效果
 */
const SwitchButton = ({ isActive, onClick, icon, text, btnType }: SwitchButtonI) => {
  const getTheme = useTheme();
  return (
    <>
      {isActive ? (
        <SwitchButtonWrapper
          data-testid="switch-button"
          onClick={onClick}
          btnType={btnType}
          disabled>

          {icon && React.cloneElement(icon as React.ReactElement, { fill: getTheme.selectBtn.active.text })}
          {text && <Text btnType={btnType}>{text}</Text>}{/* Render iconActive if it is provided */}
        </SwitchButtonWrapper>
      ) : (
        <SwitchButtonWrapper
          data-testid="switch-button"
          onClick={onClick}
          btnType={btnType}
          disabled={false}>
          {icon && React.cloneElement(icon as React.ReactElement, { fill: getTheme.selectBtn.inActive.text })}
          {text && <Text btnType={btnType}>{text}</Text>}
        </SwitchButtonWrapper>
      )}
    </>
  );
};

SwitchButton.defaultProps = {};

export default SwitchButton;
