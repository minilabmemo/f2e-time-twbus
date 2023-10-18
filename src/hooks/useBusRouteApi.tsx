import { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError } from 'axios';

export interface BusRouteResult {
  results: Results | null;
  status: number | undefined;
  isLoading: boolean;
}

export interface Results {
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


}

interface BusRequestParam {
  City: string | undefined;
  // 繁體中文路線名稱，如'307'
  Route: string | undefined;
  callAtInstall: boolean;
}

// The useBusRouteApi hook provides a reusable mechanism for fetching Bus data and managing the loading state in a React component.
//return data and useCallback function.
const useBusRouteApi = (query: BusRequestParam): [BusRouteResult, () => void] => {
  const { City, callAtInstall } = query;

  const fetchData = useCallback(() => {


    const fetchingData = async () => {
      let url = "";
      // let url = 'https://tdx.transportdata.tw/api/basic/v2/Bus/Route/City';
      if (City !== null) {
        url += `/${City}?%24select=RouteName%2CDepartureStopNameZh%2C%20DepartureStopNameEn%2C%20DestinationStopNameZh%2C%20DestinationStopNameEn%2C%20City&%24format=JSON`;
      }
      const request1 = axios.get("API_ENDPOINT_1");
      const request2 = axios.get("API_ENDPOINT_2");

      // 使用Promise.all等待两个请求完成
      Promise.all([request1, request2])
        .then((responses) => {
          // 将结果存储在result对象中
          // setResult({ res1: responses[0].data, res2: responses[1].data });
          setResData({
            results: { BusStopOfRoutes: responses[0].data, BusN1EstimateTimes: responses[1].data },
            status: 200,
            isLoading: false,
          });
        })
        .catch((error) => {
          console.error("useBusRouteApi API请求失败", error);
          if (axios.isAxiosError(error)) { // 检查是否为 Axios 错误对象
            const axiosError = error as AxiosError; // 使用类型断言将 error 声明为 AxiosError 类型
            const responseStatus = axiosError.response ? axiosError.response.status : 0; // 使用条件语句获取 status 属性
            setResData((prevState) => ({
              ...prevState,
              status: responseStatus, // 获取 HTTP 错误状态码
              isLoading: false,
            }));

          }
        });


    };

    setResData((prevState) => ({
      ...prevState,
      isLoading: true,
    }));

    fetchingData();

  }, [City]);


  const [resData, setResData] = useState<BusRouteResult>({
    results: null,
    status: 0,
    isLoading: false,
  });

  useEffect(() => {
    if (callAtInstall) {
      fetchData();
    }
  }, [callAtInstall, fetchData]);

  return [resData, fetchData] as [BusRouteResult, () => void];
};

export default useBusRouteApi;