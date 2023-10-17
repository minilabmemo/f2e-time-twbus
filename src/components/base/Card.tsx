import React, { useState } from 'react';
import { theme } from '../../style/theme';

import { ThemeProvider, useTheme } from '@emotion/react';

import styled from '@emotion/styled';

import SwitchButton from '../btn/SwitchButton';

import { AnimalBacterinTag, AnimalsterilizationTag, getAgeLabel, getBodyLabel, getColorLabel, getSexLabel, isAnimalSaved } from '../convert';
import { StorageKey, URI_PET_FIND_PREFIX } from '../../utils/const';
import { Link } from 'react-router-dom';
import SaveSvg from '../Icons/SaveSvg';
import OpenSvg from '../Icons/OpenSvg';
interface CardProps {
  animal_id: string;
  /*是否絕育[T | F | N](是、否、未輸入)*/
  animal_sterilization: string;
  // 是否施打狂犬病疫苗[T | F | N](是、否、未輸入)
  animal_bacterin: string;

  // 動物品種
  animal_Variety: string;
  // 動物的類型[貓 | 狗 | 鳥 ...]
  animal_kind: string;
  // 動物性別[M | F | N](公、母、未輸入)
  animal_sex: string;
  // 動物年紀[CHILD | ADULT](幼年、成年)
  animal_age: string;
  // 動物體型[SMALL | MEDIUM | BIG](小型、中型、大型)
  animal_bodytype: string;
  // 動物毛色[黑色 | 灰色 | 白色... ]
  animal_color: string;
  // 動物狀態 [NONE | OPEN | ADOPTED | OTHER | DEAD] (未公告、開放認養、已認養、其他、死亡)
  animal_status: string;
  //動物所屬收容所名稱
  shelter_name: string;
  //圖片名稱
  album_file: string;
}

const Container = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  box-sizing: border-box;
  width: 280px;
  height: 450px;
  margin: .8em .5em;
  border-radius: .5em;

  &:before {
    content: '';
    background-position: center center;
    background-size: cover;
    /* 加入一層濾鏡在上 */
    border-radius: .5em;
    width: 280px;
    height: 450px;
    box-sizing: border-box;
    position: absolute;
    z-index: 1;
    /* 加入效果 */
    background: rgba(255, 255, 255, 0.5);
    box-shadow: 0px 4px 6px 3px rgba(255, 255, 255, 0.55) inset;
  }
  &:hover {
    box-shadow: 3px 3px 3px 0 rgba(233, 233, 233, 1);
    transform: translateY(-5px);
    opacity: 0.8;
    border-radius: .5em;
  }
`;

const MainBlock = styled.div`
  user-select: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #5ac1f9;
  width: 280px;
  height: 250px;
  border-radius: .5em .5em 0 0;
`;
const Photo = styled.div`
  position: relative;
  z-index: 2;
  left: 0px;
  top: 0px;
  aspect-ratio: 1 / 1;
  width: 200px;
  height: 200px;
`;
const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: scale-down;
  filter: drop-shadow(3px 3px 3px rgba(0, 0, 0, 0.25));
`;
const EmptyPhoto = styled.div`
  width: 100%;
  height: 100%;
  background-color: #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const EmptyPhotoText = styled.p`
  color: #fff;
  font-size: 16px;
 
`;
const WarnPhotoText = styled.p`
  color: #f53939;
  font-size: 16px;
`;
const Save = styled.span`
  user-select: none;
  position: absolute;
  right: 10px;
  top: 10px;
  z-index: 3;
`;

const OpenTag = styled.div`
  z-index: 3;
  user-select: none;
  position: absolute;
  right: -40px;
  top: -25px;
  background-color: #ffbd59;
  color: black;
  width: 80px;
  height:24px ;
  line-height: 24px; /*same to height for height-center*/
  font-family: 'Noto Sans TC Black';
  font-size: 14px;
  font-weight: 900;
  text-align: center;
`;



const TextFrontBlock = styled.div`
  position: absolute;
  top: calc(250px + 20px);
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: white;
  box-sizing: border-box;
  width: 220px;
  height: 145px;
  border-radius: 0 0 .5em .5em;
`;

const TextBackBlock = styled.div`
  position: relative;
  z-index: -1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 5px solid #5ac1f9;
  background-color: white;
  box-sizing: border-box;
  width: 280px;
  height: 200px;
  border-radius: 0 0 .5em .5em;
  padding: 19px 43px;
  box-shadow: inset 0px 0px 4px 0 rgba(0, 0, 0, 0.55);
`;
const TagGroup = styled.div`
  width: 100%;
  height: auto;
`;

const TextTypeGroup = styled.div`
  width: 100%;
  height: 1.5em;
  margin-top: 8px;
`;
const Kind = styled.div`
  color: #e9e9e9;
  text-shadow: 3px 3px 3px 0px rgba(243, 243, 243, 0.55);
  font-size: 40px;
  font-family: 'Noto Sans TC';
  font-weight: 700;
  position: absolute;
  right: -15px;
  top: 3px;
`;




const TextBodyGroup = styled.div`
  margin-top: 8px;
  width: 100%;
  height: 50px;
  font-family: 'Noto Sans TC';
  font-size: 16px;
  font-weight: 500;
`;
const RowGroup = styled.div`
  height: 50%;
`;

const Field = styled.span`
  width: 100px;

  line-height: 16px;
  color: #000;
  font-size: 12px;
  font-family: Noto Sans TC;
  font-style: normal;
  font-weight: 900;
  line-height: 16px;
  /*超出範圍呈現省略符號 */
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const FieldPrefix = styled.span`
  font-size: 20px;
  font-family: 'Noto Sans TC';
  font-weight: 900;
  line-height: 16px;
  margin-right: 2px;
`;

const FieldValue = styled.span`
  color: #175fbf;
  font-size: 16px;
  font-family: 'Noto Sans TC';
  font-weight: 700;
  line-height: 16px;
  margin-left: 8px;
`;

const ShelterGroup = styled.div`
  margin-top: 16px;
  width: 100%;
  height: 24px;
  color: #175fbf;
  font-size: 16px;
  font-family: 'Noto Sans TC';
  font-weight: 700;
  /*超出範圍呈現省略符號 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const AnimalSexInfo = ({ animal_sex }: { animal_sex: string }) => {
  const sexLabel = getSexLabel(animal_sex)

  return (
    <>
      <FieldPrefix>S</FieldPrefix>性別
      <FieldValue style={{ marginRight: '24px' }}>{sexLabel}</FieldValue>
    </>
  );
};

const AnimalAgeInfo = ({ animal_age }: { animal_age: string }) => {
  const ageLabel = getAgeLabel(animal_age);

  return (
    <>
      <FieldPrefix>A</FieldPrefix>年紀
      <FieldValue>{ageLabel}</FieldValue>
    </>
  );
};

const AnimalColorInfo = ({ animal_color }: { animal_color: string }) => {
  const colorLabel = getColorLabel(animal_color);
  return (
    <>
      <FieldPrefix>C</FieldPrefix>毛色<FieldValue>{colorLabel}</FieldValue>
    </>
  );
};

//動物體型[SMALL | MEDIUM | BIG](小型、中型、大型)
const AnimalBodyInfo = ({ animal_bodytype }: { animal_bodytype: string }) => {
  const bodyLabel = getBodyLabel(animal_bodytype);

  return (
    <>
      <FieldPrefix>B</FieldPrefix>體型<FieldValue style={{ marginRight: '24px' }}>{bodyLabel} </FieldValue>
    </>
  );
};




interface AnimalImageProps {
  imageUrl: string;
}

const AnimalImage: React.FC<AnimalImageProps> = ({ imageUrl }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    console.log('ImageError:' + imageUrl);
    setImageError(true);
  };

  return (
    <>
      {imageError ? (
        <EmptyPhoto>
          <WarnPhotoText>圖片讀取失敗</WarnPhotoText>
        </EmptyPhoto>
      ) : (
        <Img src={imageUrl} alt="AnimalImage" onError={handleImageError} />
      )}
    </>
  );
};
const ShelterInfos = ({ animal_status, shelter_name }: { animal_status: string, shelter_name: string }) => {

  const getTheme = useTheme();
  const OpenIcon = <OpenSvg width="20px" height="20px" fill={getTheme.orangeColor} />;
  const OpenNotIcon = <OpenSvg width="20px" height="20px" fill={getTheme.sectionColor} />;

  return (
    <ShelterGroup>
      {animal_status === 'OPEN' ? (
        <>
          {OpenIcon} <OpenTag>開放認養中</OpenTag>
        </>
      ) : (
        <>{OpenNotIcon}</>
      )}
      <span >{shelter_name}</span>
    </ShelterGroup>
  );
};
/**
 * `Card` 是一個類型按鈕,根據點擊顯示不同效果
 */
const Card = ({
  animal_id,
  album_file,
  animal_sterilization,
  animal_bacterin,
  animal_Variety,
  animal_kind,
  animal_sex,
  animal_age,
  animal_bodytype,
  animal_color,
  animal_status,
  shelter_name,

}: CardProps) => {

  const [isSaved, setIsSaved] = useState(isAnimalSaved(animal_id));


  const SaveIcon = <SaveSvg width="24px" height="24px" />;

  const onSave = (animal_id: string, isSaved: boolean) => {
    const savedAnimalIDs = localStorage.getItem(StorageKey) || '';
    const existingAnimalIDs = new Set(savedAnimalIDs.split(',').filter(Boolean));
    if (!isSaved) {
      if (!existingAnimalIDs.has(String(animal_id))) {
        if (existingAnimalIDs.size < 20) {
          existingAnimalIDs.add(animal_id);
          const updatedAnimalIDs = Array.from(existingAnimalIDs);
          localStorage.setItem(StorageKey, updatedAnimalIDs.join(','));
        } else {
          alert("已達到最大儲存數量限制（20個）。無法再新增更多。");
          return;
        }

      }
    } else {

      existingAnimalIDs.delete(String(animal_id));
      const updatedAnimalIDs = Array.from(existingAnimalIDs);
      if (updatedAnimalIDs.length === 0) {
        localStorage.removeItem(StorageKey); // Remove the entire localStorage if updatedAnimalIDs is empty
      } else {
        localStorage.setItem(StorageKey, updatedAnimalIDs.join(','));

      }
    }


    setIsSaved(!isSaved);
  };


  return (
    <ThemeProvider theme={theme}>

      <Container className="card">
        <Save >
          <SwitchButton isActive={isSaved} onClick={() => onSave(animal_id, isSaved)} icon={SaveIcon} btnType={'save'} />
        </Save>
        <Link to={`/${URI_PET_FIND_PREFIX}/${animal_id}`} target="_blank" className='pet-link'>
          <MainBlock>
            <Photo>
              {album_file ? (
                <AnimalImage imageUrl={album_file}></AnimalImage>
              ) : (
                <EmptyPhoto>
                  <EmptyPhotoText>無提供圖片</EmptyPhotoText>
                </EmptyPhoto>
              )}

            </Photo>
          </MainBlock>

          <TextBackBlock />

          <TextFrontBlock className="text-grp">
            <TagGroup>
              <AnimalBacterinTag animal_bacterin={animal_bacterin} show={false} />
              <AnimalsterilizationTag animal_sterilization={animal_sterilization} show={false} />
            </TagGroup>

            <TextTypeGroup>
              {animal_kind && <Kind>{animal_kind}</Kind>}
              <span className="animal-ID" > {animal_id}</span>
              {animal_Variety && <span className='animal-Variety'>{animal_Variety}</span>}


            </TextTypeGroup>
            <TextBodyGroup>
              <RowGroup>
                <Field>
                  <AnimalSexInfo animal_sex={animal_sex} />
                </Field>
                <Field>
                  <AnimalAgeInfo animal_age={animal_age} />
                </Field>
              </RowGroup>
              <RowGroup>
                <Field>
                  <AnimalBodyInfo animal_bodytype={animal_bodytype}></AnimalBodyInfo>
                </Field>
                <Field>
                  <AnimalColorInfo animal_color={animal_color}></AnimalColorInfo>
                </Field>
              </RowGroup>
            </TextBodyGroup>
            <ShelterInfos animal_status={animal_status} shelter_name={shelter_name}></ShelterInfos>

          </TextFrontBlock>
        </Link>
      </Container>
    </ThemeProvider >
  );
};

Card.defaultProps = {};

export default Card;
