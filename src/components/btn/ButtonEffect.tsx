import React, { useState } from 'react';
import './ButtonRippleEffect.css';
import styled from '@emotion/styled';

interface Ripple {
  left: number;
  top: number;
  size: number;
}

interface SearchButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  touchRipple?: boolean;
}

interface ButtonEffectProps extends SearchButtonProps {
  isLoading: boolean;
}

const Button = styled.div<{ isLoading: boolean }>`
  user-select: none;
  cursor: ${({ isLoading }) => (isLoading ? 'default' : 'pointer')};
  box-sizing: border-box;
  width: auto;
  height: 40px;
  background-color: ${({ theme }) => {
    return theme.searchBtn.background;
  }};
  color: ${({ theme }) => {
    return theme.searchBtn.text;
  }};
  font-size: .8em;
  margin: 5px;
  padding: .6em ;
  border: 0;
  border-radius: 4px;
  display: inline-flex;
  flex-direction: row;
  justify-content: center;
  align-items: end;
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
  transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  pointer-events: ${({ isLoading }) => (isLoading ? 'none' : 'auto')};

  ㄍ &:hover {
    background-color: #1565c0;
    box-shadow: 3px 3px 3px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);
  }
`;

const ButtonEffect: React.FC<ButtonEffectProps> = ({ onClick, children, touchRipple, isLoading }) => {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (touchRipple) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const size = Math.max(rect.width, rect.height);

      const newRipple: Ripple = {
        left: x - size / 2,
        top: y - size / 2,
        size: size,
      };

      setRipples([...ripples, newRipple]);

      setTimeout(() => {
        setRipples((prevRipples) => prevRipples.filter((ripple) => ripple !== newRipple));
      }, 600);
    }

    if (!isLoading) {
      onClick();
    }
  };

  return (
    <Button className="search-button-with-ripple" onClick={handleClick} isLoading={isLoading}>
      <div className="ripple-container">
        {ripples.map((ripple, index) => (
          <span
            key={index}
            className="ripple-effect"
            style={{
              left: ripple.left,
              top: ripple.top,
              width: ripple.size,
              height: ripple.size,
            }}></span>
        ))}
        {children}
      </div>
    </Button>
  );
};

ButtonEffect.defaultProps = {
  touchRipple: true,
  isLoading: false,
};

export default ButtonEffect;
