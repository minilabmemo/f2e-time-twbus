import { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import { DisplayStopOfRoute_mock, EstimatedTimeOfArrival_mock } from '../utils/mocks/mock';

export interface BusStopsResult {
  results: Results | null;
  status: number | undefined;
  isLoading: boolean;
}

interface Results {
  BusStopOfRoutes: BusStopOfRoute[];
  BusN1EstimateTimes: BusN1EstimateTime[];
}

interface BusStopOfRoute {
  //路線唯一識別代碼，規則為 {業管機關簡碼} + {RouteID}，其中 {業管機關簡碼} 可於Authority API中的AuthorityCode欄位查詢
  RouteUID: string,
  // 地區既用中之路線代碼(為原資料內碼)
  RouteID: string;
  //路線名稱
  RouteName: NameType;
  // 去返程 : [0:'去程',1:'返程',2:'迴圈',255:'未知']
  Direction: number,
  //所有經過站牌
  Stops: Stop[],
  //站牌權管所屬縣市(相當於市區公車API的City參數)[若為公路/國道客運路線則為空值]
  City: string;
}

interface NameType {
  Zh_tw: string;
  En: string;
}
interface Stop {
  StopUID: string;
  StopName: NameType;
  StopPosition: PointType;
}

interface PointType {
  //位置經度(WGS84)
  PositionLon: number;
  //位置緯度(WGS84)
  PositionLat: number;
  //地理空間編碼
  GeoHash: string;
}

interface BusN1EstimateTime {
  //車牌號碼 [値為値為-1時，表示目前該站位無車輛行駛]
  PlateNumb: string,
  //站牌唯一識別代碼，規則為 {業管機關簡碼} + {StopID}，其中 {業管機關簡碼} 可於Authority API中的AuthorityCode欄位查詢
  StopUID: string;
  // 地區既用中之站牌代碼(為原資料內碼)
  StopID: string;
  //站牌名
  StopName: NameType;
  //路線唯一識別代碼，規則為 {業管機關代碼} + {RouteID}，其中 {業管機關代碼} 可於Authority API中的AuthorityCode欄位查詢
  RouteUID: string;
  //地區既用中之路線代碼(為原資料內碼)
  RouteID: string;
  //去返程(該方向指的是此車牌車輛目前所在路線的去返程方向，非指站站牌所在路線的去返程方向，使用時請加值業者多加注意) : [0:'去程',1:'返程',2:'迴圈',255:'未知']
  Direction: number;
  //到站時間預估(秒) [當StopStatus値為2~4或PlateNumb値為 - 1時，EstimateTime値為null; 當StopStatus値為1時， EstimateTime値多數為null，僅部分路線因有固定發車時間，故EstimateTime有値; 當StopStatus値為0時，EstimateTime有値。]
  EstimateTime: number | null;
  //車輛狀態備註 : [0:'正常',1:'尚未發車',2:'交管不停靠',3:'末班車已過',4:'今日未營運']
  StopStatus: number;
  //本平台資料更新時間(ISO8601格式:yyyy-MM-ddTHH:mm:sszzz)
  UpdateTime: string;

}

interface BusRequestParam {
  City: string | undefined;
  // 繁體中文路線名稱，如'307'
  Route: string | undefined;
  callAtInstall: boolean;
}

// The useBusStopsApi hook provides a reusable mechanism for fetching Bus data and managing the loading state in a React component.
//return data and useCallback function.
const useBusStopsApi = (query: BusRequestParam): [BusStopsResult, () => void] => {
  const mock = process.env.REACT_APP_MOCK_DATA;
  const root_url = process.env.REACT_APP_API_URL
  const { City, Route, callAtInstall } = query;
  console.error('mock' + mock);
  const fetchData = useCallback(() => {


    const fetchingData = async () => {
      if (mock) {
        console.error('Mock data return, only use in develop.');
        setResData({
          results: { BusStopOfRoutes: JSON.parse(DisplayStopOfRoute_mock), BusN1EstimateTimes: JSON.parse(EstimatedTimeOfArrival_mock) },
          status: 200,
          isLoading: false,
        });

      }
      if (!mock) {
        let DisplayStopOfRoute_URL = `${root_url}/api/basic/v2/Bus/DisplayStopOfRoute/City`;
        let EstimatedTimeOfArrival_URL = `${root_url}/api/basic/v2/Bus/EstimatedTimeOfArrival/City`;

        if (City !== null && Route != null) {
          DisplayStopOfRoute_URL += `/${City}/${Route}?%24top=30&%24format=JSON`;
          EstimatedTimeOfArrival_URL += `/${City}/${Route}?%24top=30&%24format=JSON`;
        }
        const request1 = axios.get(DisplayStopOfRoute_URL);
        const request2 = axios.get(EstimatedTimeOfArrival_URL);


        Promise.all([request1, request2])
          .then((responses) => {
            setResData({
              results: { BusStopOfRoutes: responses[0].data, BusN1EstimateTimes: responses[1].data },
              status: 200,
              isLoading: false,
            });
          })


          .catch((error) => {
            console.error("useBusRouteApi API请求失败", error);
            if (axios.isAxiosError(error)) {
              const axiosError = error as AxiosError;
              const responseStatus = axiosError.response ? axiosError.response.status : 0;
              setResData((prevState) => ({
                ...prevState,
                status: responseStatus,
                isLoading: false,
              }));

            }
          });
      }

    };

    setResData((prevState) => ({
      ...prevState,
      isLoading: true,
    }));

    fetchingData();

  }, [City, Route]);


  const [resData, setResData] = useState<BusStopsResult>({
    results: null,
    status: 0,
    isLoading: false,
  });

  useEffect(() => {
    if (callAtInstall) {
      fetchData();
    }
  }, [callAtInstall, fetchData]);

  return [resData, fetchData] as [BusStopsResult, () => void];
};

export default useBusStopsApi;