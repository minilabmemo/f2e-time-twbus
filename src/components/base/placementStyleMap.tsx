import styled, { RuleSet, css, keyframes } from 'styled-components';


const topStyle = css`
   transform: translate(
    calc(${(props: TooltipPropsWapperTypes) => props.childrensize.width / 2}px - 50%),
    calc(-100% - ${(props: TooltipPropsWapperTypes) => (props.gap ? props.gap : 10)}px)
  );
  .tooltip__arrow {
    position: absolute;
    left: 50%;
    transform: translate(-50%, 40%);
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
    calc(-100% + ${(props: TooltipPropsWapperTypes) => props.childrensize ? (props.childrensize ? props.childrensize.width : 50) : 10}px),
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
    calc(${(props: TooltipPropsWapperTypes) => (props.childrensize ? props.childrensize.width : 50) / 2}px - 50%),
    ${(props: TooltipPropsWapperTypes) => (props.childrensize ? props.childrensize.height : 50) + (props.gap ? props.gap : 10)}px
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
    ${(props: TooltipPropsWapperTypes) => (props.childrensize ? props.childrensize.height : 50) + (props.gap ? props.gap : 10)}px
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
    calc(-100% + ${(props: TooltipPropsWapperTypes) => (props.childrensize ? props.childrensize.width : 50)}px),
    ${(props: TooltipPropsWapperTypes) => (props.childrensize ? props.childrensize.height : 50) + (props.gap ? props.gap : 10)}px
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
    ${(props: TooltipPropsWapperTypes) => (props.childrensize ? props.childrensize.width : 50) + (props.gap ? props.gap : 10)}px,
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
    ${(props: TooltipPropsWapperTypes) => (props.childrensize ? props.childrensize.width : 50) + (props.gap ? props.gap : 10)}px,
    calc(-100% + ${(props: TooltipPropsWapperTypes) => (props.childrensize ? props.childrensize.height : 50)}px)
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
    calc(-100% + ${(props: TooltipPropsWapperTypes) => (props.childrensize ? props.childrensize.height : 50)}px)
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
    calc(-50% + ${(props: TooltipPropsWapperTypes) => (props.childrensize ? props.childrensize.height : 50) / 2}px)
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
    ${(props: TooltipPropsWapperTypes) => props.childrensize ? (props.childrensize ? props.childrensize.width : 50) : 50 + ((props.gap ? props.gap : 10) ? (props.gap ? props.gap : 10) : 10)}px,
    calc(-50% + ${(props: TooltipPropsWapperTypes) => (props.childrensize ? (props.childrensize ? props.childrensize.height : 50) : 50) / 2}px)
  );
  .tooltip__arrow {
    position: absolute;
    top: 50%;
    left: 0px;
    transform: translate(-50%, -50%);
  }
`;



type placementKeys = string | 'top' | 'top-left' | 'top-right' | 'bottom' | 'bottom-left' | 'bottom-right' | 'left-top' | 'left' | 'left-bottom' | 'right-top' | 'right' | 'right-bottom';


type placementStyleMapType = {
  [key: placementKeys | 'top-left']: RuleSet<TooltipPropsWapperTypes>;
};

export const placementStyleMap: placementStyleMapType = {
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


interface TooltipPropsWapperTypes {
  childrensize: {
    width: number,
    height: number
  },
  gap?: number,
  position: {
    top: number | 0,
    left: number | 0,
  },

}

