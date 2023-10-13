import React, { useState } from 'react';

import styled, { css } from 'styled-components';
import { petShelterIds } from '../twDistricts';
interface MenuItemProps {
  item: string;
  subItems: string[] | undefined;
  onSelect?: any;
}

const itemStyle = css`
  display: inline-flex;
  align-items: center;
  height: 38px;
  padding: 6px 12px;
  box-sizing: border-box;
  cursor: pointer;
  color: black;

  &:hover {
    background: #e7f4f9;
  }
`;

const MenuWrapper = styled.div`
  position: relative;
  top: 0px;
  left: 0px;
  ${itemStyle};
  &.items:first-child {
    font-weight: 900;
  }
`;

const ItemsWrapper = styled.div<ItemsWrapperProps>`
  padding: 0 5px;
  background-color: white;
  flex-direction: column;
  font-size: .8em;
  font-family: 'Noto Sans TC';
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  border-radius: 4px;
  position: absolute;
  z-index: 999;
  top: ${(props) => props.position.top}px;
  left: ${(props) => props.position.left}px;
  box-shadow: 0 3px 6px -4px rgb(0 0 0 / 12%), 0 6px 16px 0 rgb(0 0 0 / 8%), 0 9px 28px 8px rgb(0 0 0 / 5%);
`;

interface ItemsWrapperProps {
  position: {
    top: number;
    left: number;
  };
}

interface ItemProps {
  $isFirstItem: boolean;
}

const ItemDiv = styled.div<ItemProps>`
  width: 100%;
  white-space: nowrap;
  ${itemStyle};
  font-weight: ${(props) => (props.$isFirstItem ? '900' : '500')};
`;

const ItemArea = styled.span`
  font-size: .6em;
  font-family: 'Noto Sans TC';
  font-style: normal;

  line-height: 24px;
  margin-left: 8px;
  color: #494949;
`;
const Item = ({ item, onClick, $isFirstItem }: { item: string; onClick: any; $isFirstItem: boolean }) => {
  const shelter = petShelterIds.find((shelter) => shelter.name === item);

  const shelterArea = shelter ? `${shelter.area}` : '';
  return (
    <ItemDiv key={item} onClick={onClick} className="item" $isFirstItem={$isFirstItem}>
      {item}
      <ItemArea>{shelterArea}</ItemArea>
    </ItemDiv>
  );
};
/**
 * `MenuItem` 是一個單一菜單項目,移到上方會在旁顯示其子項目
 */
const MenuItem = ({ item, subItems, onSelect }: MenuItemProps) => {
  const itemRef = React.useRef() as React.MutableRefObject<HTMLInputElement>;

  const [position, setPosition] = useState({
    top: 0,
    left: 0,
  });

  const handleOnHover = () => {
    setPosition({
      top: itemRef.current.offsetHeight * 0.2,
      left: itemRef.current.offsetWidth,
    });
    setIsHover(true);
  };

  const [isHover, setIsHover] = useState<boolean>(false);

  return (
    <>
      <MenuWrapper
        key={item}
        ref={itemRef}
        onMouseEnter={() => {
          handleOnHover();
        }}
        onMouseLeave={() => {
          setIsHover(false);
        }}>
        {item}
        {isHover && (
          <ItemsWrapper position={position} className="items">
            <>
              {subItems &&
                subItems.map((item, index) => <Item key={item} onClick={() => onSelect(item)} item={item} $isFirstItem={index === 0}></Item>)}
            </>
          </ItemsWrapper>
        )}
      </MenuWrapper>
    </>
  );
};

// MenuItem.defaultProps = {
//   themeColor: '#c72f2f',
//   placement: 'top'
// };

export default MenuItem;
