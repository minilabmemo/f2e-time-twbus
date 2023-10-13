import React, { useRef, useEffect, useState } from 'react';


import styled, { RuleSet, css, keyframes } from 'styled-components';
import Portal from '../Portal';
// import { useColor } from 'hooks/useColor';


interface TooltipPropsTypes {
  // 客製化樣式
  className?: string,
  // 是否出現箭頭
  showArrow?: boolean,
  // 出現位置
  placement: placementKeys,
  //主題配色
  themeColor?: string,
  //提示文字
  content?: React.ReactNode,
  //滑到子元件 要出現提示文字
  children?: React.ReactNode,
  gap?: number | 0,
  color?: string,
}

type placementKeys = string | 'top' | 'top-left' | 'top-right' | 'bottom' | 'bottom-left' | 'bottom-right' | 'left-top' | 'left' | 'left-bottom' | 'right-top' | 'right' | 'right-bottom';


interface TooltipPropsWapperTypes {
  childrenSize: {
    width: number,
    height: number
  },
  gap?: number | 0,
  color?: string,
  position?: {
    top: number | 0,
    left: number | 0,
  }
  isVisible: boolean,
  placement: string,
  children?: React.ReactNode,

  themeColor?: string | null,
  content?: React.ReactNode,
  showArrow?: boolean | null,
  className?: string,
}


const topStyle = css`
   transform: translate(
    calc(${(props: TooltipPropsWapperTypes) => props.childrenSize.width / 2}px - 50%),
    calc(-100% - ${(props: TooltipPropsWapperTypes) => props.gap}px)
  );
  .tooltip__arrow {
    position: absolute;
    left: 50%;
    transform: translate(-50%, 40%);
  }
  .tooltip__arrow-content {
    width: 8px;
    height: 8px;
    transform: rotate(45deg);
    background: ${(props: TooltipPropsWapperTypes) => props.color};
    
  }
`;



const topLeftStyle = css`

  transform: translate(
    0px,
    calc(-100%-${(props: TooltipPropsWapperTypes) => (props.gap ? props.gap : 10)}px)
  );
  .tooltip__arrow {
    position: absolute;
    left: 12px;
    transform: translate(0%, 40%);
  }
`;

const topRightStyle = css`
  transform: translate(
    calc(-100% + ${(props: TooltipPropsWapperTypes) => props.childrenSize ? (props.childrenSize ? props.childrenSize.width : 50) : 10}px),
    calc(-100% - ${(props: TooltipPropsWapperTypes) => (props.gap ? props.gap : 10)}px)
  );
  .tooltip__arrow {
    position: absolute;
    right: 12px;
    transform: translate(0%, 40%);
  }
`;

const bottomStyle = css`
  transform: translate(
    calc(${(props: TooltipPropsWapperTypes) => (props.childrenSize ? props.childrenSize.width : 50) / 2}px - 50%),
    ${(props: TooltipPropsWapperTypes) => (props.childrenSize ? props.childrenSize.height : 50) + (props.gap ? props.gap : 10)}px
  );
  .tooltip__arrow {
    position: absolute;
    top: 0px;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

const bottomLeftStyle = css`
  transform: translate(
    0px,
    ${(props: TooltipPropsWapperTypes) => (props.childrenSize ? props.childrenSize.height : 50) + (props.gap ? props.gap : 10)}px
  );
  .tooltip__arrow {
    position: absolute;
    top: 0px;
    left: 12px;
    transform: translate(0%, -50%);
  }
`;

const bottomRightStyle = css`
  transform: translate(
    calc(-100% + ${(props: TooltipPropsWapperTypes) => (props.childrenSize ? props.childrenSize.width : 50)}px),
    ${(props: TooltipPropsWapperTypes) => (props.childrenSize ? props.childrenSize.height : 50) + (props.gap ? props.gap : 10)}px
  );
  .tooltip__arrow {
    position: absolute;
    top: 0px;
    right: 12px;
    transform: translate(0%, -50%);
  }
`;

const rightTopStyle = css`
  transform: translate(
    ${(props: TooltipPropsWapperTypes) => (props.childrenSize ? props.childrenSize.width : 50) + (props.gap ? props.gap : 10)}px,
    0px
  );
  .tooltip__arrow {
    position: absolute;
    top: 12px;
    left: 0px;
    transform: translate(-50%, 0%);
  }
`;

const rightBottomStyle = css`
  transform: translate(
    ${(props: TooltipPropsWapperTypes) => (props.childrenSize ? props.childrenSize.width : 50) + (props.gap ? props.gap : 10)}px,
    calc(-100% + ${(props: TooltipPropsWapperTypes) => (props.childrenSize ? props.childrenSize.height : 50)}px)
  );
  .tooltip__arrow {
    position: absolute;
    bottom: 12px;
    left: 0px;
    transform: translate(-50%, 0%);
  }
`;

const leftBottomStyle = css`
  transform: translate(
    calc(-100% - ${(props: TooltipPropsWapperTypes) => (props.gap ? props.gap : 10)}px),
    calc(-100% + ${(props: TooltipPropsWapperTypes) => (props.childrenSize ? props.childrenSize.height : 50)}px)
  );
  .tooltip__arrow {
    position: absolute;
    bottom: 12px;
    right: 0px;
    transform: translate(50%, 0%);
  }
`;

const leftTopStyle = css`
  transform: translate(
    calc(-100% - ${(props: TooltipPropsWapperTypes) => (props.gap ? props.gap : 10)}px),
    0px
  );
  .tooltip__arrow {
    position: absolute;
    top: 12px;
    right: 0px;
    transform: translate(50%, 0%);
  }
`;

const leftStyle = css`
  transform: translate(
    calc(-100% - ${(props: TooltipPropsWapperTypes) => (props.gap ? props.gap : 10)}px),
    calc(-50% + ${(props: TooltipPropsWapperTypes) => (props.childrenSize ? props.childrenSize.height : 50) / 2}px)
  );
  .tooltip__arrow {
    position: absolute;
    top: 50%;
    right: 0px;
    transform: translate(50%, -50%);
  }
`;

const rightStyle = css`
  transform: translate(
    ${(props: TooltipPropsWapperTypes) => props.childrenSize ? (props.childrenSize ? props.childrenSize.width : 50) : 50 + ((props.gap ? props.gap : 10) ? (props.gap ? props.gap : 10) : 10)}px,
    calc(-50% + ${(props: TooltipPropsWapperTypes) => (props.childrenSize ? (props.childrenSize ? props.childrenSize.height : 50) : 50) / 2}px)
  );
  .tooltip__arrow {
    position: absolute;
    top: 50%;
    left: 0px;
    transform: translate(-50%, -50%);
  }
`;



type placementStyleMapType = {
  [key: placementKeys | 'top-left']: RuleSet<TooltipPropsWapperTypes>;
};

const placementStyleMap: placementStyleMapType = {
  top: topStyle,
  'top-left': topLeftStyle,
  'top-right': topRightStyle,
  'bottom-left': bottomLeftStyle,
  'bottom-right': bottomRightStyle,
  bottom: bottomStyle,
  'right-top': rightTopStyle,
  'left-top': leftTopStyle,
  'right-bottom': rightBottomStyle,
  'left-bottom': leftBottomStyle,
  left: leftStyle,
  right: rightStyle,
};

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


const TooltipWrapper = styled.div<TooltipPropsWapperTypes>`
  position: absolute;
  z-index: 999;
  top: ${(props) => props.position ? props.position.top : 0}px;
  left: ${(props) => props.position ? props.position.left : 0}px;
  background: ${(props) => props.color};
  color: white;
  padding: 8px;
  border-radius: 4px;
  box-shadow: 0 3px 6px-4px rgb(0 0 0/12%), 0 6px 16px 0 rgb(0 0 0/8%), 0 9px 28px 8px rgb(0 0 0/5%);
  animation: ${(props) => (props.isVisible ? fadeIn : fadeOut)} .3s ease-in-out forwards;
  ${(props) => placementStyleMap[props.placement] || placementStyleMap.top}
  .tooltip__arrow-content {
  width: 8px;
  height: 8px;
  transform: rotate(45deg);
  background: ${(props) => props.color};
}
`;

/**
 * `Tooltip` 是一個文字彈出提醒元件，當 active 狀態時，會顯示對該子元件描述的文字。
 */
const Tooltip = ({
  children,
  placement,
  themeColor,
  content,
  showArrow,
  className,
  ...props
}: TooltipPropsTypes) => {
  const [isVisible, setIsVisible] = useState(false);
  const childrenRef = React.useRef() as React.MutableRefObject<HTMLInputElement>;
  const [childrenSize, setChildrenSize] = useState({
    width: 0,
    height: 0,
  });
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
  });

  const color = themeColor;

  const handleOnResize = () => {
    setChildrenSize({
      width: childrenRef.current.offsetWidth,
      height: childrenRef.current.offsetHeight,
    }

    )
    setPosition({
      top: childrenRef.current.getBoundingClientRect().top,
      left: childrenRef.current.getBoundingClientRect().left,
    });
  };

  useEffect(() => {
    handleOnResize();
    window.addEventListener('resize', handleOnResize);
    return () => {
      window.removeEventListener('resize', handleOnResize);
    };
  }, [position]);

  return (
    <>
      <span
        ref={childrenRef}
        onMouseOver={() => { setIsVisible(true); console.log("true"); }}
        onMouseLeave={() => { setIsVisible(false); console.log("false"); }}
      >
        {children}
      </span >
      <Portal customRootId="tooltip">
        <TooltipWrapper
          isVisible={isVisible}
          position={position}
          placement={placement}
          childrenSize={childrenSize}
          gap={12}
          color={color}
          className={className}
          {...props}
        >

          {content}
          {showArrow && (
            <div className="tooltip__arrow">
              <div className="tooltip__arrow-content" />
            </div>
          )}
        </TooltipWrapper>
      </Portal >
    </>
  );
};



Tooltip.defaultProps = {
  themeColor: '#c72f2f',
  placement: 'top',
  showArrow: true,
  className: '',
};

export default Tooltip;