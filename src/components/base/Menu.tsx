import React, { useEffect, useState, useCallback } from 'react';

import { placementStyleMap } from './placementStyleMap'
import styled, { keyframes } from 'styled-components';
import Portal from '../Portal';

interface MenuProps {
  children?: React.ReactNode,
  overlay?: any,
  placement: string,
  $isOpen: boolean,
  onClick?: any,
  onClose: any,


}


interface OverlayWrapperProps {
  childrensize: {
    width: number,
    height: number
  },
  gap?: number,
  position: {
    top: number,
    left: number,
  }
  $isOpen: boolean,
  placement: string,
}


const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
`;
const OverlayWrapper = styled.div<OverlayWrapperProps>`
  
  position: absolute;
  z-index: 999;
  top: ${(props) => props.position.top}px;
  left: ${(props) => props.position.left}px;
  background: white;
  border-radius: 4px;
 
  box-shadow: 0 3px 6px -4px rgb(0 0 0 / 12%), 0 6px 16px 0 rgb(0 0 0 / 8%), 0 9px 28px 8px rgb(0 0 0 / 5%);
  animation: ${(props) => (props.$isOpen ? fadeIn : fadeOut)} .3s ease-in-out forwards;
  display:${(props) => (props.$isOpen ? 'flex' : 'none')} ;
  flex-direction:column ;
  justify-content:start ;
  ${(props: OverlayWrapperProps) => placementStyleMap[props.placement] || placementStyleMap.top};


`;



/**
 * `Menu` 是一個可打開的菜單，當 [children] 點擊時，會顯示[overlay] 在其 [children] 的相對位置， [children]/[overlay] 樣式照傳入顯示。
 */
const Menu = ({
  children, placement, overlay,
  onClick, onClose, $isOpen,
}: MenuProps) => {
  const childrenRef = React.useRef() as React.MutableRefObject<HTMLInputElement>;
  const [childrensize, setChildrenSize] = useState({
    width: 0,
    height: 0,
  });
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
  });

  const handleOnResize = () => {
    setChildrenSize({
      width: childrenRef.current.offsetWidth,
      height: childrenRef.current.offsetHeight,
    });
    setPosition({
      top: childrenRef.current.getBoundingClientRect().top + window.scrollY, /*加上捲軸現在高度 避免在不同位置點擊而跑上方去 */
      left: childrenRef.current.getBoundingClientRect().left,


    });

  };
  const getAttributeFromEventHierarchy = (event: Event, attr: string): string | null => {
    let temp: HTMLElement | null = event.target as HTMLElement;

    while (temp) {
      const dataId = temp.getAttribute(attr);
      if (dataId) {
        return dataId;
      }
      temp = temp.parentElement;
    }

    return null;
  };
  const handleOnClick = useCallback((event: any) => {  //TODO any?
    const dropdownId = getAttributeFromEventHierarchy(event, 'data-dropdown-id');
    if (!dropdownId) {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('click', handleOnClick);
    return () => {
      document.removeEventListener('click', handleOnClick);
    };
  }, [handleOnClick]);


  useEffect(() => {
    handleOnResize();
    window.addEventListener('resize', handleOnResize);
    return () => {
      window.removeEventListener('resize', handleOnResize);
    };
  }, []);
  return (
    <>
      <span
        ref={childrenRef}
        data-dropdown-id="dropdown"
        onClick={onClick}
      >
        {children}
      </span>
      <Portal customRootId="dropdown-root">
        <OverlayWrapper className="overlay-wrapper"
          data-dropdown-id="dropdown"
          $isOpen={$isOpen}
          position={position}
          placement={placement}
          childrensize={childrensize}
          gap={12}

        >
          {overlay}
        </OverlayWrapper>
      </Portal>
    </>
  );
};



Menu.defaultProps = {

  placement: 'top',
  $isOpen: false,
};

export default Menu;