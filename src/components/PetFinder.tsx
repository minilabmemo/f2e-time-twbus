import React, { useEffect, useState } from 'react';
import Menu from './base/Menu';
import MenuItem from './base/MenuItem';
import CarouselMUI from './base/CarouselMUI';
import { ThemeProvider } from '@emotion/react';
import { theme } from '../style/theme';

import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { taiwanDistrictsF } from './twDistricts';

import SwitchButton from './btn/SwitchButton';
import ButtonEffect from './btn/ButtonEffect';


import pet from '../images/pet.svg';
import pet_notFound from '../images/petNotFound.png';
import Card from './base/Card';
import Pagination from './base/Pagination';
import usePetApi from '../hooks/usePetApi';
import Loading from './base/Loading';

import CatSvg from './Icons/CatSvg';
import DogSvg from './Icons/DogSvg';
import BirdSvg from './Icons/BirdSvg';
import OthersPetSvg from './Icons/OthersPetSvg';
import { NavLink } from 'react-router-dom';


const SearchLabel = styled.label`
  display: block;
  font-size: 1em;
  color: ${(props) => {
    return props.theme.typeColor;
  }};
  margin: .8em .1em;
  height: 1.2em;
`;

const SelectLocation = styled.input`
  display: inline-block;
  text-overflow: ellipsis;
  background: transparent;
 
  outline: none;
  height: 25px;
  width: ${(props) => {
    const value = props.value;
    if (typeof value === 'string') {
      return `${value.length + 3 * 1}em`;
    }
    return 'auto';
  }};
  text-align:center ;
  max-width: 200px;
  background-color: ${({ theme }) => {
    return theme.selectBtn.active.background;
  }};
  color: ${({ theme }) => {
    return theme.selectBtn.active.text;
  }};
  font-size: .8em;
  padding: .6em .5em;
  margin: .2em;
  border: none;
  border-radius: .5em;

  box-shadow: 0px .2em .2em 0px #b5e5ff;
`;

const KeywordInput = styled.input`
  box-sizing: border-box;
  background: transparent;
  outline: none;
  width: 200px;
  max-width: 100%;
  background-color: ${({ theme }) => {
    return theme.secondColor;
  }};
  color: ${({ theme }) => {
    return theme.primeColor;
  }};
  font-size: .8em;
  padding: .6em 1em;
  margin: 5px;
  height: 40px;
  border: 0;
  ::placeholder {
    color: ${({ theme }) => {
    return theme.placeholderColor;
  }};
    opacity: 1; /* Firefox */
  }
  border-radius:.5em ;
`;




const SearchArea = styled.div`
  height: auto;
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: start;
  flex-wrap:wrap ;
  margin-top: 1.3em;
  margin-left: 2.5em;
`;
const FieldGroup = styled.div`
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: start;
  margin: 0px .5em;
  width: auto;
`;

const TypeGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: start;
  flex-wrap:wrap ;
`;

const QueryBox = styled.div`
  padding: 1em;
  padding-bottom: 1.2em;
  border: 1px solid #144480;
  border-radius: .5em;
  width: auto;
  height: auto;
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  margin: 2.5em auto;
`;
const ResultBox = styled.div`
  border-radius: .5em;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  flex-wrap:wrap ;
  margin: auto;
  padding:  0;
  
`;
const defaultHeight = '500px';
const Result = styled.div<{ isDataFound: boolean }>`
  position: relative;
  height: ${(props) => (props.isDataFound ? 'auto' : defaultHeight)};
  margin: 0 auto;
  padding:  0;
  width:min(75vw,1200px) ;
  display: grid;
  gap: 8px;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
`;


const PetFinder = () => {
  const [isShown, setIsShown] = useState(false);
  const [isDog, setIsDog] = useState(true);
  const [isCat, setIsCat] = useState(false);
  const [isBird, setIsBird] = useState(false);
  const [isOthers, setIsOthers] = useState(false);
  const [isSexF, setIsSexF] = useState(false);
  const [isSexM, setIsSexM] = useState(false);


  const [$isOpen, setIsOpen] = useState<boolean>(false);
  const [areaName, setAreaName] = useState<string>(taiwanDistrictsF[0].cityName);
  const areaRef = React.useRef() as React.MutableRefObject<HTMLInputElement>;
  const keyWordRef = React.useRef() as React.MutableRefObject<HTMLInputElement>;

  const resultTitleRef = React.useRef() as React.MutableRefObject<HTMLInputElement>;
  const resultRef = React.useRef() as React.MutableRefObject<HTMLInputElement>;

  const DogIcon = <DogSvg width="2.1em" height="2.1em" />;
  const CatIcon = <CatSvg width="2.1em" height="2.1em" />;
  const BirdIcon = <BirdSvg width="2.1em" height="2.1em" />;
  const OthersIcon = <OthersPetSvg width="2.1em" height="2.1em" />;


  const PetNotFoundImg = () => {
    return (
      <span style={{ width: '100%', marginTop: '16px', backgroundColor: '#E0F4FF' }}>
        <img width="500px" height="500px" style={{ display: 'block', margin: 'auto' }} src={pet_notFound} alt="pet_notFound" />
      </span>
    );
  };
  const [petData, fetchData] = usePetApi({
    isDog: isDog,
    isCat: isCat,
    isBird: isBird,
    isOthers: isOthers,
    isSexF: isSexF,
    isSexM: isSexM,
    keyWordRef: keyWordRef,
    areaRef: areaRef,
    animalID: null,
    animalIDs: null,
    callAtInstall: false,
  });

  const isDataFound = (petData.records.length > 0) ? true : false;
  const resultBoxHeight = resultRef.current ? `${resultRef.current.offsetHeight}px` : '';
  const [isFirstLanding, setFirstLanding] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = petData.total; // 總數
  const itemsPerPage = 12; // 每頁數量
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage; // 起始索引
  const endIndex = startIndex + itemsPerPage; // 结束索引

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };
  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {


    //針對下一頁的圖片先做預載入
    const preloadImages = () => {
      const startIndex = currentPage * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;

      for (let i = startIndex; i < endIndex; i++) {
        const item = petData.records[i];
        if (item && item.album_file) {
          const image = new Image();
          image.src = item.album_file;
        }
      }
    };

    preloadImages();

  }, [currentPage, petData]);

  const onSearch = () => {
    setCurrentPage(1); //change to start at page 1
    fetchData();
    setFirstLanding(false);
  };

  return (
    <>
      <section onMouseEnter={() => setIsShown(true)} onMouseLeave={() => setIsShown(false)}
        style={{ width: "100%", height: "100%" }}>
        <CarouselMUI isShown={isShown} ></CarouselMUI>
      </section>

      <QueryBox className='query-box'>
        <div className='title-box'>
          <img style={{ width: "2em", height: "2em" }} src={pet} alt="pet" />

          <span className="title-text">查詢條件</span>

        </div>
        <div className='query-hint'>本資料根據農委會資料開放平台-動物認領養資料呈現，資料呈現有誤或缺失等問題？，<NavLink to="/about">快來告訴我！</NavLink></div>

        <SearchArea>
          <ThemeProvider theme={theme}>
            <FieldGroup>
              <div style={{ width: 'auto' }}>
                <SearchLabel htmlFor="area">地區</SearchLabel>
                <Menu
                  $isOpen={$isOpen}
                  onClick={() => setIsOpen(true)}
                  onClose={() => setIsOpen(false)}
                  placement={'bottom'}
                  overlay={
                    <>
                      {taiwanDistrictsF.map((location, i) => (
                        <MenuItem key={i} item={location.cityName} subItems={location.shelters} onSelect={setAreaName} />
                      ))}
                    </>
                  }>
                  <SelectLocation ref={areaRef} value={areaName} readOnly />
                </Menu>
              </div>
            </FieldGroup>
            <FieldGroup>
              <SearchLabel htmlFor="animalType">種類</SearchLabel>
              <TypeGroup>
                <SwitchButton
                  isActive={isDog}
                  onClick={() => setIsDog(!isDog)}
                  text={'狗'}
                  icon={DogIcon}

                  btnType={'select'}
                />
                <SwitchButton
                  isActive={isCat}
                  onClick={() => setIsCat(!isCat)}
                  text={'貓'}
                  icon={CatIcon}

                  btnType={'select'}
                />
                <SwitchButton
                  isActive={isBird}
                  onClick={() => setIsBird(!isBird)}
                  text={'鳥'}
                  icon={BirdIcon}

                  btnType={'select'}
                />
                <SwitchButton
                  isActive={isOthers}
                  onClick={() => setIsOthers(!isOthers)}
                  text={'其他'}
                  icon={OthersIcon}

                  btnType={'select'}
                />
              </TypeGroup>
            </FieldGroup>
            <FieldGroup>
              <SearchLabel htmlFor="animalSex">性別</SearchLabel>
              <TypeGroup>
                <SwitchButton isActive={isSexM} onClick={() => setIsSexM(!isSexM)} text={'公'} btnType={'text'} />
                <SwitchButton isActive={isSexF} onClick={() => setIsSexF(!isSexF)} text={'母'} btnType={'text'} />
              </TypeGroup>
            </FieldGroup>
            <FieldGroup>
              <SearchLabel>關鍵字</SearchLabel>
              <KeywordInput ref={keyWordRef} placeholder="例如：虎斑, 柴犬" />
            </FieldGroup>
            <FieldGroup>
              <SearchLabel className="alignBlock"></SearchLabel>
              <ButtonEffect onClick={() => onSearch()} isLoading={petData.isLoading}>
                <FontAwesomeIcon icon={faMagnifyingGlass} style={{ fontSize: '1.2em', width: "1.5em", height: "1.2em" }} />
                <span style={{ marginLeft: '.2em' }}>搜尋</span>
              </ButtonEffect>
            </FieldGroup>
          </ThemeProvider>
        </SearchArea>
      </QueryBox>

      {!isFirstLanding && (
        <ResultBox>
          <div ref={resultTitleRef} className='title-box'>

            <img style={{ width: "2em", height: "2em" }} src={pet} alt="pet" />
            <span className="title-text">查詢結果</span>
            <span className="total-text">總筆數</span> <span className="number-text">{petData.total}</span>
          </div>

          <Result isDataFound={isDataFound} ref={resultRef}>
            {!isDataFound && !petData.isLoading && <PetNotFoundImg />}
            {petData.isLoading && <Loading LoadHeight={resultBoxHeight} />}

            {petData.records.slice(startIndex, endIndex).map((item, index) => (

              <Card
                key={item.animal_id}
                animal_id={item.animal_id}
                album_file={item.album_file}
                animal_sterilization={item.animal_sterilization}
                animal_bacterin={item.animal_bacterin}
                animal_kind={item.animal_kind}
                animal_Variety={item.animal_Variety}
                animal_sex={item.animal_sex}
                animal_age={item.animal_age}
                animal_bodytype={item.animal_bodytype}
                animal_color={item.animal_colour}
                animal_status={item.animal_status}
                shelter_name={item.shelter_name}

              />

            ))}
          </Result>

          {isDataFound && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onNextPage={handleNextPage}
              onPreviousPage={handlePreviousPage}
              onPageClick={handlePageClick}
              clickFocusRef={resultTitleRef}
            />
          )}
        </ResultBox>
      )}
      <section></section>
    </>
  );
};

export default PetFinder;
