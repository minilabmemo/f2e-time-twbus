import React, { useState, useEffect, useCallback, useRef } from 'react';
import { petCityIds, petShelterIds } from '../components/twDistricts';
interface PetRecord {
  //動物的流水編號
  animal_id: string;
  //動物的區域編號
  animal_subid: string;
  //動物所屬縣市代碼
  animal_area_pkid: string;
  //動物所屬收容所代碼
  animal_shelter_pkid: string;
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
  // 動物毛色[黑色 | 灰色 | 白色... ] //*API寫錯animal_colour vs animal_color
  animal_colour: string;
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

export interface PetRequestData {
  records: PetRecord[];
  total: number;
  isLoading: boolean;
}


interface PetRequestQuery {
  isDog: boolean;
  isCat: boolean;
  isBird: boolean;
  isOthers: boolean;
  isSexF: boolean;
  isSexM: boolean;
  animalID: string | null;
  //if param is null, it won't affect the filtering 
  keyWordRef: React.MutableRefObject<HTMLInputElement> | null;
  areaRef: React.MutableRefObject<HTMLInputElement> | null;
  animalIDs: string | null;
  //if true useEffort will call fetchData
  callAtInstall: boolean;

}

// The usePetApi hook provides a reusable mechanism for fetching pet data and managing the loading state in a React component.
//return data and useCallback function.
const usePetApi = (query: PetRequestQuery): [PetRequestData, () => void] => {

  const { isDog, isCat, isBird, isSexF, isSexM, isOthers, animalID, animalIDs, keyWordRef, areaRef, callAtInstall } = query;
  function sleep(time: number): Promise<{ records: PetRecord[] }> {
    return new Promise((resolve) => setTimeout(() => resolve({ records: [] }), time));
  }
  const MAX_CALLS_PER_SECOND = 10;
  const CALL_INTERVAL = 1000; // 1 second in milliseconds
  const callCountRef = useRef(0);
  const lastCallTimestampRef = useRef(0);
  const canFetchData = useCallback(() => {
    const now = Date.now();
    if (now - lastCallTimestampRef.current >= CALL_INTERVAL) {
      callCountRef.current = 1;
      lastCallTimestampRef.current = now;
      return true;
    } else if (callCountRef.current < MAX_CALLS_PER_SECOND) {
      callCountRef.current += 1;
      lastCallTimestampRef.current = now;
      return true;
    }

    return false;
  }, []);
  const fetchDataByKind = (
    sex: string | null,
    kind: string,
    cityID: string,
    shelterID: string,
    animalID: string | null,
  ): Promise<{ records: PetRecord[] }> => {
    const startTime = performance.now();
    let url = 'https://data.coa.gov.tw/Service/OpenData/TransService.aspx?UnitId=QcbUEzN6E6DL';
    if (sex !== null) {
      url += `&animal_sex=${sex}`;
    }
    if (animalID !== null) {
      url += `&animal_id=${animalID}`;
    }
    url += `&animal_area_pkid=${cityID}`;
    url += `&animal_kind=${kind}`;

    //shelterID cannot be empty
    if (shelterID !== '') {
      url += `&animal_shelter_pkid=${shelterID}`;
    }
    return fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const endTime = performance.now();
        const responseTime = endTime - startTime; //TODO & check stauts

        const records: PetRecord[] = data;


        let errImgPrefix = 'https://asms.coa.gov.tw/'; //SSL issue?
        records.forEach((record) => {
          if (record.album_file.includes(errImgPrefix)) {
            record.album_file = 'ErrImg';
          }
        });

        return {
          records,
        };
      });
  };

  const fetchData = useCallback(() => {
    if (!canFetchData()) {
      console.log("Cannot fetch data at the moment. Too many requests.");
      console.warn("Cannot fetch data at the moment. Too many requests.");
      return;
    }

    const fetchingData = async () => {

      let records: PetRecord[] = [];

      const selectLocation = areaRef ? areaRef.current.value : '';
      const city = petCityIds.find((city) => city.name === selectLocation);
      const cityID = city ? `${city.id}` : '';

      const shelter = petShelterIds.find((shelter) => shelter.name === selectLocation);
      const shelterID = shelter ? `${shelter.id}` : '';
      const promises = [];
      if (isDog && isSexF) {
        promises.push(fetchDataByKind('F', '狗', cityID, shelterID, animalID));
      }
      if (isDog && isSexM) {
        promises.push(fetchDataByKind('M', '狗', cityID, shelterID, animalID));
      }
      if (isDog && !isSexF && !isSexM) {
        promises.push(fetchDataByKind(null, '狗', cityID, shelterID, animalID));
      }

      if (isCat && isSexF) {
        promises.push(fetchDataByKind('F', '貓', cityID, shelterID, animalID));
      }
      if (isCat && isSexM) {
        promises.push(fetchDataByKind('M', '貓', cityID, shelterID, animalID));
      }
      if (isCat && !isSexF && !isSexM) {
        promises.push(fetchDataByKind(null, '貓', cityID, shelterID, animalID));
      }

      if (isBird && isSexF) {
        promises.push(fetchDataByKind('F', '鳥', cityID, shelterID, animalID));
      }
      if (isBird && isSexM) {
        promises.push(fetchDataByKind('M', '鳥', cityID, shelterID, animalID));
      }
      if (isBird && !isSexF && !isSexM) {
        promises.push(fetchDataByKind(null, '鳥', cityID, shelterID, animalID));
      }

      if (isOthers && isSexF) {
        promises.push(fetchDataByKind('F', '其他', cityID, shelterID, animalID));
      }
      if (isOthers && isSexM) {
        promises.push(fetchDataByKind('M', '其他', cityID, shelterID, animalID));
      }
      if (isOthers && !isSexF && !isSexM) {
        promises.push(fetchDataByKind(null, '其他', cityID, shelterID, animalID));
      }

      // promises.push(sleep(60000));//debug use
      if (promises.length > 0) {
        const results = await Promise.all(promises);
        records = results.flatMap((result) => result.records);
      } else {
        if (isSexF) {
          promises.push(fetchDataByKind('F', '', cityID, shelterID, animalID));
        }
        if (isSexM) {
          promises.push(fetchDataByKind('M', '', cityID, shelterID, animalID));
        }
        if (!isSexF && !isSexM) {
          promises.push(fetchDataByKind(null, '', cityID, shelterID, animalID));
        }


        const results = await Promise.all(promises);

        records = results.flatMap((result) => result.records);
      }


      // Apply filters based on the keyword and animalIDs
      let filteredRecords = records;
      const keyword = keyWordRef ? keyWordRef.current.value : '';

      if (keyword !== '') {
        filteredRecords = filteredRecords.filter(
          (record) =>
            record.animal_Variety.includes(keyword) ||
            record.animal_kind.includes(keyword) ||
            record.animal_colour.includes(keyword)
        );
      }

      const animalIDAary = animalIDs ? animalIDs.split(',') : [];

      if (animalIDAary && animalIDAary.length > 0) {
        filteredRecords = filteredRecords.filter((record) => animalIDAary.includes(String(record.animal_id)));
      }

      if (animalIDs === '') { //TODO not request
        filteredRecords = []
      }


      setResData({
        records: filteredRecords,
        total: filteredRecords.length,
        isLoading: false,
      });

    };

    setResData((prevState) => ({
      ...prevState,
      isLoading: true,
    }));

    fetchingData();

  }, [canFetchData, areaRef, isDog, isSexF, isSexM, isCat, isBird, isOthers, keyWordRef, animalIDs, animalID]);


  const [resData, setResData] = useState<PetRequestData>({
    records: [],
    total: 0,
    isLoading: false,
  });
  useEffect(() => {
    if (callAtInstall) {
      fetchData();
    }
  }, [callAtInstall, fetchData]);


  return [resData, fetchData] as [PetRequestData, () => void];
};

export default usePetApi;