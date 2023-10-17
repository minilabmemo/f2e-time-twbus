
import construct_img from '../images/construct_img.png';
export const savedAnimalsMax = 20;

export const LinkNames = {
  about: { text: "附近站牌", short: "Nearby" },
  find: { text: "路線規劃", short: "Route Plan" },
  search: { zh: "站點查詢", en: "Site Query" },
  chart: { text: "我的收藏 ", short: "My Collection" },
};
export const Dict = {
  about: { text: "附近站牌", short: "Nearby" },
  find: { text: "路線規劃", short: "Route Plan" },
  home: { zh: "首頁", en: "home" },
  timetable: { zh: "時刻表 ", en: "Time Table" },
};

export const IconColors = {
  blackFont: "#283C43",
  pinkFont: "#D08181",
  blueFont: "#3591C5",
  cyanFont: "#7FC0C5",
  blueLightFont: "#5E9BAE",
  blueDarkFont: "#52797C",
}


export const URI_SEARCH_DEFAULT = "cities"






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
export const keyboardList: itemI[] = [
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