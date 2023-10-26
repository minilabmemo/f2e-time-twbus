
import construct_img from '../images/construct_img.png';


export const LinkNames = {
  nearby: { zh: "附近站牌", en: "Nearby" },
  search: { zh: "站點查詢", en: "Site Query" },
  save: { zh: "我的收藏 ", en: "My Collection" },
};
export const Dict = {

  home: { zh: "首頁", en: "home" },
  timetable: { zh: "時刻表 ", en: "Time Table" },
};




export const URI_NEARBY_DEFAULT = "nearby"
export const URI_SEARCH_DEFAULT = "cities"
export const URI_SAVE_DEFAULT = "save/:lang"
export const URI_SEARCH = "/search/:lang/:city"

// export const URI_STOPS = "/:lang/stops?city=:city&route=:route" //這樣寫比對不到 No routes matched location  //FIXME
export const URI_STOPS = "/:lang/:city/:route"
export function calculateStopsURL({ lang, city, route }: { lang: string, city: string, route: string }) {
  return URI_STOPS.replace(':lang', lang).replace(':city', city).replace(':route', route);
}

export const StorageKey = "savedAnimalIDs";

export const URI_PET_FIND_PREFIX = "find-pet";
export const ConstructPhoto = <img width="50%" height="50%" src={construct_img} alt="construct_img" />;


export const ActionType = {
  delete: 'delete' as 'delete',
  clear: 'clear' as 'clear',

};
export interface itemI {
  zh: string;
  attr: string;
  action?: keyof typeof ActionType | undefined;
}
export const keyboardRouteList: itemI[] = [
  { zh: '紅', attr: 'btn btn-red' },
  { zh: '藍', attr: 'btn btn-blue' },
  { zh: '1', attr: 'btn btn-gray' },
  { zh: '2', attr: 'btn btn-gray' },
  { zh: '3', attr: 'btn btn-gray' },
  { zh: '綠', attr: 'btn btn-green' },
  { zh: '棕', attr: 'btn btn-brown' },
  { zh: '4', attr: 'btn btn-gray' },
  { zh: '5', attr: 'btn btn-gray' },
  { zh: '6', attr: 'btn btn-gray' },
  { zh: '橘', attr: 'btn btn-orange' },
  { zh: '小', attr: 'btn btn-yellow' },
  { zh: '7', attr: 'btn btn-gray' },
  { zh: '8', attr: 'btn btn-gray' },
  { zh: '9', attr: 'btn btn-gray' },
  { zh: '幹線', attr: 'btn btn-main-line' },
  { zh: '更多', attr: 'btn btn-black' },
  { zh: 'c', attr: 'btn btn-c', action: 'delete' },
  { zh: '0', attr: 'btn btn-0' },
  { zh: '清除', attr: 'btn btn-x', action: 'clear' },
];


export const LangType = {
  zh: 'zh' as 'zh',
  en: 'en' as 'en',

};


export const StatusColorType = {
  red: 'red' as 'red',
  blue: 'blue' as 'blue',
  gray: 'gray' as 'gray',

};

// estimateTime 到站時間預估(秒) [當StopStatus値為2~4或PlateNumb値為 - 1時，EstimateTime値為null; 當StopStatus値為1時， EstimateTime値多數為null，僅部分路線因有固定發車時間，故EstimateTime有値; 當StopStatus値為0時，EstimateTime有値。]
//車輛狀態備註 : [0:'正常',1:'尚未發車',2:'交管不停靠',3:'末班車已過',4:'今日未營運']StopStatus: number;
export function statusDefine(status: number, estimateTime: number | null) {
  if (status === 1) {
    return ['尚未發車', StatusColorType.gray];
  }
  if (status === 2) {
    return ['交管不停靠', StatusColorType.gray];
  }
  if (status === 3) {
    return ['末班車已過', StatusColorType.gray];
  }
  if (status === 4) {
    return ['今日未營運', StatusColorType.gray];
  }

  if (estimateTime === null) {
    console.log("無資訊資料需確認", estimateTime, " ,status", status)
    return ['無資訊', StatusColorType.gray];
  }
  if (typeof estimateTime === 'number') {
    if (estimateTime < 60) {
      // return [`進站中 ${estimateTime}秒`, "red"];  
      return [`進站中`, StatusColorType.red];  //60秒內顯示進站中
    }

    if (estimateTime >= 60 && estimateTime < 3600) {
      const minutes = Math.floor(estimateTime / 60);

      const seconds = estimateTime % 60;
      if (minutes === 1) { //兩分鐘內顯示 即將進站
        // return [` 即將進站 ${minutes}分${seconds}秒`, "red"];
        return [` 即將進站`, StatusColorType.red];
      }
      return [`${minutes}分${seconds}秒`, StatusColorType.blue];
    }

    if (estimateTime >= 3600) {
      const hours = Math.floor(estimateTime / 3600);
      const remainingSeconds = estimateTime % 3600;
      const minutes = Math.floor(remainingSeconds / 60);
      const seconds = remainingSeconds % 60;
      return [`${hours}小時${minutes}分${seconds}秒`, StatusColorType.blue];
    }
  }
  return ['未知', StatusColorType.gray];
}

