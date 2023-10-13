import CatSvg from "./Icons/CatSvg";
import DogSvg from "./Icons/DogSvg";
import Tag from "./base/Tag";
import { useTheme } from '@emotion/react';

export const savedAnimalsMax = 20;
export const save_text = '寵物收藏區';
export const StorageKey = "savedAnimalIDs";

export const URI_PET_FIND_PREFIX = "find-pet";


// check id in localStorage
export const isAnimalSaved = (animal_id: string) => {
  const savedAnimalIDs = localStorage.getItem(StorageKey) || '';
  const existingAnimalIDs = new Set(savedAnimalIDs.split(',').filter(Boolean));
  return existingAnimalIDs.has(String(animal_id));
};


export function getAgeLabel(animal_age: string): string {
  if (animal_age === 'CHILD') {
    return '幼年';
  } else if (animal_age === 'ADULT') {
    return '成年';
  } else {
    return '未知';
  }
}

export function getSexLabel(animal_sex: string): string {

  if (animal_sex === 'F') {
    return '母';
  } else if (animal_sex === 'M') {
    return '公';
  } else {
    return '無';
  }
}
export function getColorLabel(animal_color: string): string {

  if (animal_color === '') {
    return '無填寫';
  } else {
    return animal_color;
  }
}
export function getBodyLabel(animal_bodytype: string): string {

  if (animal_bodytype === 'SMALL') {
    return '小';
  } else if (animal_bodytype === 'MEDIUM') {
    return '中';
  } else if (animal_bodytype === 'BIG') {
    return '大';
  } else {
    return '無';
  }
}



// 是否施打狂犬病疫苗[T | F | N](是、否、未輸入)
export const AnimalBacterinTag = ({ animal_bacterin, show }: { animal_bacterin: string, show: boolean }) => {
  return (
    <>
      {animal_bacterin === 'T' ? (
        <Tag text="已打疫苗" tagType="primary" />
      ) : animal_bacterin === 'N' ? (
        <Tag text="未打疫苗" tagType="warning" />
      ) : show ? (
        <Tag text="未輸入" tagType="default" />
      ) : (
        <Tag text="未輸入疫苗狀態" />
      )}
    </>
  );
};


// /*是否絕育[T | F | N](是、否、未輸入)*/
export const AnimalsterilizationTag = ({ animal_sterilization, show }: { animal_sterilization: string, show: boolean }) => {
  return (
    <>
      {animal_sterilization === 'T' ? (
        <Tag text="已絕育" tagType="primary" />
      ) : animal_sterilization === 'N' ? (
        <Tag text="未絕育" tagType="warning" />
      ) : show ? (
        <Tag text="未輸入" tagType="default" />
      ) : (
        <Tag text="未輸入疫苗狀態" />
      )
      }
    </>
  );
};

//動物狀態 [NONE | OPEN | ADOPTED | OTHER | DEAD] (未公告、開放認養、已認養、其他、死亡)
export const AnimalStatusTag = ({ animal_status }: { animal_status: string }) => {
  const getStatusInfo = (status: string): { text: string; tagType: 'primary' | 'warning' | 'success' | 'danger' | 'default' | undefined; } => {
    switch (status) {
      case 'NONE':
        return { text: '未公告', tagType: 'default' };
      case 'OPEN':
        return { text: '開放認養', tagType: 'warning' };
      case 'ADOPTED':
        return { text: '已認養', tagType: 'success' };
      case 'OTHER':
        return { text: '其他', tagType: 'default' };
      case 'DEAD':
        return { text: '死亡', tagType: 'danger' };
      default:
        return { text: '未知狀態', tagType: 'default' };
    }
  };

  const { text, tagType } = getStatusInfo(animal_status);

  return (
    <>
      <Tag text={text} tagType={tagType} />
    </>
  );
};





export const DogIcon = ({ percent }: { percent: number }) => {
  const getTheme = useTheme();
  let selectedIcon = <DogSvg width="2.1em" height="2.1em" fill={getTheme.successColor} />;

  if (percent > 100) {
    selectedIcon = <DogSvg width="2.1em" height="2.1em" fill={getTheme.dangerColor} />;;
  } else if (percent > 50) {
    selectedIcon = <DogSvg width="2.1em" height="2.1em" fill={getTheme.primeColor} />;;
  } else if (percent === 0) {
    selectedIcon = <DogSvg width="2.1em" height="2.1em" fill={getTheme.defaultColor} />;;
  }

  return <span style={{ margin: "8px" }}>{selectedIcon}</span>;
};

export const CatIcon = ({ percent }: { percent: number }) => {
  const getTheme = useTheme();
  let selectedIcon = <CatSvg width="2.1em" height="2.1em" fill={getTheme.successColor} />;

  if (percent > 100) {
    selectedIcon = <CatSvg width="2.1em" height="2.1em" fill={getTheme.dangerColor} />;
  } else if (percent > 50) {
    selectedIcon = <CatSvg width="2.1em" height="2.1em" fill={getTheme.primeColor} />;
  } else if (percent === 0) {
    selectedIcon = <CatSvg width="2.1em" height="2.1em" fill={getTheme.defaultColor} />;;
  }


  return <span style={{ margin: "8px" }} > {selectedIcon}</ span>;
};

