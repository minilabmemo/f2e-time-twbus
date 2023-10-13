
import styled from '@emotion/styled';
import pet from '../images/pet.svg';
import usePetApi from '../hooks/usePetApi';
import Card from './base/Card';
import Loading from './base/Loading';
import { StorageKey, savedAnimalsMax } from './const';
import React, { useEffect, useState } from 'react';
import icon_save from '../images/icon_save.svg';
import info from '../images/info.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';


const ResultBox = styled.div`
  padding: 1.5em;
  border-radius: .5em;
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
`;
const defaultHeight = '40em';
const Result = styled.div<{ isDataFound: boolean }>`
  width: 100;
  height: ${(props) => (props.isDataFound ? 'auto' : defaultHeight)};
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  align-items: start;
  justify-content: start;
  flex-wrap: wrap;
  position: relative;
`;
const InfoIcon = <img style={{ width: "1.5em", height: "1.5em" }} src={info} alt="info" />;

const Stores = () => {
  const resultRef = React.useRef() as React.MutableRefObject<HTMLInputElement>;

  const [animalIDs, setAnimalIDs] = useState(localStorage.getItem(StorageKey) ?? '');
  const [petData, fetchData] = usePetApi({
    isDog: false,
    isCat: false,
    isBird: false,
    isOthers: false,
    isSexF: false,
    isSexM: false,
    animalID: null,
    keyWordRef: null,
    areaRef: null,
    animalIDs: animalIDs,
    callAtInstall: true,
  });




  const isDataFound = (petData.records.length > 0) ? true : false;
  const resultBoxHeight = resultRef.current ? `${resultRef.current.offsetHeight}px` : '';


  const onRefresh = () => {
    setAnimalIDs(localStorage.getItem(StorageKey) ?? '');
    fetchData();
  };

  return (
    <>


      <div className='title-box' >
        <img style={{ width: "2em", height: "2em" }} src={pet} alt="pet" />



      </div>
      <div className="save-hint-box">
        {InfoIcon}
        <div className="hint-text">提醒您，本頁面是根據您在寵物找尋時點擊喜歡 <img width="20px" height="20px" src={icon_save} alt="icon_save" /> 的<b>浪浪暫存區</b>，紀錄僅暫時存於瀏覽器紀錄中，如要永久保存<b>請自行列印本頁或紀錄</b>，本站無永久保存功能。</div>
      </div>
      {/* TODO 下拉說明 會因為你清除瀏覽器紀錄而消失 本平台不服儲存責任 */}



    </ >
  );
};



export default Stores;