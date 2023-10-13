import { useParams } from 'react-router-dom';
import usePetApi from '../hooks/usePetApi';
import styled from '@emotion/styled';
import pet from '../images/pet.svg';
import info_pet from '../images/info_pet.svg';
import info_shelter from '../images/info_shelter.svg';
import { theme } from '../style/theme';
import AnimalImage from './base/AnimalImage';
import { AnimalBacterinTag, AnimalStatusTag, AnimalsterilizationTag, StorageKey, getAgeLabel, getBodyLabel, getColorLabel, getSexLabel, isAnimalSaved } from './convert';
import SwitchButton from './btn/SwitchButton';
import { useState } from 'react';

import { ThemeProvider } from '@emotion/react';
import SaveSvg from './Icons/SaveSvg';

const Box = styled.div`
 
  padding: 1.5em;
  background-color:#FEFEFE ;
  border-radius: .5em;
  width: 70vw;
  height: auto;
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  margin-bottom: 2.5em;
`;
const InfoWrapper = styled.div`
margin-top:1.6em ;
 position:relative;
 background-color: #D8F6DB;
 padding: .8em;
 width: 60vw;
  
`;
const StickerTop = styled.div`
width: 7.5em;
height: 1.7em;
transform: rotate(25.433deg);
flex-shrink: 0;
background: rgba(217, 217, 217, 0.60);
position:absolute ;
right:-1.5em;
  
`;
const StickerBottom = styled.div`
width: 7.5em;
height: 1.7em;
transform: rotate(25.433deg);
flex-shrink: 0;
background: rgba(217, 217, 217, 0.60);
position:absolute ;
left:-1.5em;
bottom: 0px;
  
`;

const Info = styled.div` 

  background-color: #D8F6DB;
  width:auto ;
  height: auto;
  border-radius:.5em ;
  display:flex ;
  flex-direction:row ;
  justify-content:start ;
  align-items:start ;

 
`;
const Shelter = styled.div` 

  background-color: #D8F6DB;
  width:auto ;
  height: auto;
  border-radius:.5em ;
  display:flex ;
  flex-direction:row ;
  justify-content:start ;
  align-items:start ;
 
`;
const InfoImgBlock = styled.div`
  margin: 2em;
  aspect-ratio: 1 / 1;
  width: max(20%,100px);
  display:flex ;
  align-self:center ;
  

`;
const ShelterIconBlock = styled.div`
    margin: 2em;
    width: max(20%,100px);
  align-self:center ;
  display:flex ;
  justify-content:center ;
  align-items:center ;
`;
const ShelterDataBlock = styled.div`

  width: 50%;
  height: auto;
`;

const ShelterSaveBlock = styled.div`

  width: 20%;
  height: auto;
  display:flex ;
  flex-direction:column ;
  align-items:center ;
  align-self:flex-end ;
`;

const InfoPetBlock = styled.div`
 
  width: 50%;
  height: auto;
`;
const InfoIconBlock = styled.div`
 

  width: 20%;
  align-self:center ;
  display:flex ;
  justify-content:center ;
  align-items:center ;
  
 
`;
const RowGroup = styled.div`
  height: auto;
  margin:1em  ;
`;
const Line = styled.div`
 border-top:white 1px solid ;
 margin:1em  ;
`;
const Field = styled.span`
  width: 100%;
  line-height: 16px;
  color: #000;
  font-size: .8em;
  font-family: Noto Sans TC;
  font-style: normal;
  font-weight: 900;
  line-height: 16px;

`;

const Save = styled.div`
  user-select: none;
  width :fit-content ;
`;
const SaveText = styled.div`
  margin-bottom:.5em ;
  text-align:center ;
  color: #494949;
  font-family: 'Noto Sans TC';
  font-size: .8em;
  font-style: normal;
  font-weight: 700;
  line-height: 16px; /* 100% */
`;
function PetDetailsPage() {
  // 使用 `id` 获取宠物的详细信息，并在页面中呈现
  const { id } = useParams();
  const [petData, fetchData] = usePetApi({
    isDog: false,
    isCat: false,
    isBird: false,
    isOthers: false,
    isSexF: false,
    isSexM: false,
    animalID: id ? id : null,
    keyWordRef: null,
    areaRef: null,
    animalIDs: null,
    callAtInstall: true,
  });
  interface InfoProps {
    animal_id: string;
    animal_subid: string;
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
    //動物尋獲地(文字敘述)
    animal_foundplace: string;
    //動物的實際所在地
    animal_place: string;
    //地址
    shelter_address: string;
    //連絡電話
    shelter_tel: string;
    //開放認養時間(起)
    animal_opendate: string;
    //開放認養時間(迄)
    animal_closeddate: string;
    //動物資料異動時間
    animal_update: string;
    //動物資料建立時間
    animal_createtime: string;
    //資料更新時間
    cDate: string;
    //資料備註(文字敘述)
    animal_remark: string;
  }


  const AnimalInfo = ({ album_file, animal_id, animal_subid, animal_Variety, animal_kind, animal_age, animal_sex, animal_color, animal_bodytype,
    animal_bacterin, animal_sterilization,
    animal_foundplace, shelter_name, shelter_address, shelter_tel, animal_place, animal_status,
    animal_opendate, animal_closeddate, animal_update, animal_createtime, cDate, animal_remark
  }: InfoProps) => {
    const ageLabel = getAgeLabel(animal_age);
    const sexLabel = getSexLabel(animal_sex)
    const colorLabel = getColorLabel(animal_color);
    const bodyLabel = getBodyLabel(animal_bodytype);

    //TODO save onSave tidy
    const [isSaved, setIsSaved] = useState(isAnimalSaved(animal_id));

    const onSave = (animal_id: string, isSaved: boolean) => {
      //TODO limit 20
      const savedAnimalIDs = localStorage.getItem(StorageKey) || '';
      const existingAnimalIDs = new Set(savedAnimalIDs.split(',').filter(Boolean));
      if (!isSaved) {
        console.log("🚀 ~ file: Card.tsx:445 ~ onSave ~ isSaved:", isSaved)
        if (!existingAnimalIDs.has(String(animal_id))) {
          existingAnimalIDs.add(animal_id);
          const updatedAnimalIDs = Array.from(existingAnimalIDs);
          localStorage.setItem(StorageKey, updatedAnimalIDs.join(','));

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
    const SaveIcon = <SaveSvg width="24px" height="24px" />;
    return (
      <ThemeProvider theme={theme}>

        <InfoWrapper>
          <StickerTop />
          <StickerBottom />
          <Info className='info'>
            <InfoImgBlock>
              <AnimalImage album_file={album_file}></AnimalImage>
            </InfoImgBlock>
            <InfoPetBlock className='info_pet_block'>
              <RowGroup>
                <Field>
                  動物編號<span className="field-value">{animal_id}</span>
                  區域編號<span className="field-value">{animal_subid}</span>
                </Field>
              </RowGroup>
              <RowGroup>
                <Field>
                  動物品種<span className="field-value">{animal_Variety}</span>
                  動物種類<span className="field-value">{animal_kind}</span>
                </Field>
              </RowGroup>
              <Line />
              <RowGroup>
                <Field>
                  年紀<span className="field-value">{ageLabel}</span>
                  性別<span className="field-value">{sexLabel}</span>
                </Field>
              </RowGroup>
              <RowGroup>
                <Field>
                  毛色<span className="field-value">{colorLabel}</span>
                  體型<span className="field-value">{bodyLabel}</span>
                </Field>
              </RowGroup>
              <Line />
              <RowGroup>
                <Field>
                  疫苗狀態<span className="field-value"><AnimalBacterinTag animal_bacterin={animal_bacterin} show /></span>
                  絕育狀態<span className="field-value"><AnimalsterilizationTag animal_sterilization={animal_sterilization} show /></span>
                </Field>
              </RowGroup>
              <RowGroup>
                <Field>

                  動物尋獲地<span className="field-value">{animal_foundplace}</span>
                </Field>
              </RowGroup>
              <Line />
            </InfoPetBlock>
            <InfoIconBlock className='info_img_block'>  <img width="100%" height="160px" src={info_pet} alt="info_pet" />

            </InfoIconBlock>
          </Info >
          <Shelter className='shelter'>
            <ShelterIconBlock className='shelter_img_block'>  <img width="100%" height="160px" src={info_shelter} alt="info_shelter" /></ShelterIconBlock>
            <ShelterDataBlock className='shelter_data_block'>
              <RowGroup>
                <Field>
                  動物所屬收容所名稱<span className="field-value">{shelter_name}</span>
                </Field>
              </RowGroup>
              <RowGroup>
                <Field>
                  地址<span className="field-value">{shelter_address}</span>
                </Field>
              </RowGroup>
              <RowGroup>
                <Field>
                  聯絡電話<span className="field-value">{shelter_tel}</span>
                </Field>
              </RowGroup>
              <RowGroup>
                <Field>
                  動物的實際所在地<span className="field-value">{animal_place}</span>
                </Field>
              </RowGroup>
              <Line />
              <RowGroup>
                <Field>
                  動物狀態<span className="field-value"><AnimalStatusTag animal_status={animal_status} /></span>
                </Field>
              </RowGroup>
              <RowGroup>
                <Field>
                  開放認養時間(起)<span className="field-value">{animal_opendate}</span>
                  開放認養時間(迄)<span className="field-value">{animal_closeddate}</span>
                </Field>
              </RowGroup>
              <RowGroup>
                <Field>
                  資料異動時間<span className="field-value">{animal_update}</span>
                  資料建立時間<span className="field-value">{animal_createtime}</span>
                </Field>
              </RowGroup>
              <RowGroup>
                <Field>
                  資料更新時間<span className="field-value">{cDate}</span>

                </Field>
              </RowGroup>
              <RowGroup>
                <Field>
                  資料備註<span className="field-value">{animal_remark}</span>

                </Field>
              </RowGroup>

            </ShelterDataBlock>
            <ShelterSaveBlock>
              <Save >
                <SaveText>收藏</SaveText>
                <SwitchButton isActive={isSaved} onClick={() => onSave(animal_id, isSaved)} icon={SaveIcon} btnType={'save'} />
              </Save>

            </ShelterSaveBlock>
          </Shelter>


        </InfoWrapper>
      </ThemeProvider>
    );
  };

  return (

    <Box>
      <div className='title-box'>
        <img style={{ width: "2em", height: "2em" }} src={pet} alt="pet" />
        <span className="title-text">流浪動物資訊</span>

      </div>
      <div>
        {petData.records.length > 0 ? (
          <AnimalInfo
            animal_id={petData.records[0].animal_id}
            animal_subid={petData.records[0].animal_subid}
            album_file={petData.records[0].album_file}
            animal_sterilization={petData.records[0].animal_sterilization}
            animal_bacterin={petData.records[0].animal_bacterin}
            animal_kind={petData.records[0].animal_kind}
            animal_Variety={petData.records[0].animal_Variety}
            animal_sex={petData.records[0].animal_sex}
            animal_age={petData.records[0].animal_age}
            animal_bodytype={petData.records[0].animal_bodytype}
            animal_color={petData.records[0].animal_colour}
            animal_status={petData.records[0].animal_status}
            shelter_name={petData.records[0].shelter_name}
            animal_foundplace={petData.records[0].animal_foundplace}
            shelter_address={petData.records[0].shelter_address}
            shelter_tel={petData.records[0].shelter_tel}
            animal_place={petData.records[0].animal_place}
            animal_opendate={petData.records[0].animal_opendate}
            animal_closeddate={petData.records[0].animal_closeddate}
            animal_update={petData.records[0].animal_update}
            animal_createtime={petData.records[0].animal_createtime}
            cDate={petData.records[0].cDate}
            animal_remark={petData.records[0].animal_remark} />
        ) : (
          'Not Found'
        )}

      </div>
    </Box>



  );
}


export default PetDetailsPage;