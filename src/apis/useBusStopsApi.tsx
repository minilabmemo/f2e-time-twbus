import { useEffect, useCallback, useReducer, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { DisplayStopOfRoute_mock, EstimatedTimeOfArrival_mock } from '../utils/mocks/mock';
import { fetchNewToken } from './fetchNewToken';

export interface BusStopsResult {
  results: Results | null;
  status: number | undefined;
  error?: string | undefined;
  total: number;
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

export interface Stop {
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

export interface BusN1EstimateTime {
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

// Define action types
const FETCH_STARTED = 'FETCH_STARTED';
const FETCH_SUCCESS = 'FETCH_SUCCESS';
const FETCH_ERROR = 'FETCH_ERROR';

const initialState: BusStopsResult = {
  results: null,
  status: 0,
  total: 0,
  isLoading: false,
  error: undefined,
};

const dataReducer = (
  state: BusStopsResult,
  action: { type: string; payload?: any }
): BusStopsResult => {
  switch (action.type) {
    case FETCH_STARTED:
      return {
        ...state,
        isLoading: true,
      };
    case FETCH_SUCCESS:
      return {
        ...state,
        results: action.payload.results,
        status: action.payload.status,
        total: action.payload.total,
        isLoading: false,
        error: action.payload.error,
      };
    case FETCH_ERROR:
      return {
        ...state,
        status: action.payload.status,
        isLoading: false,
        error: action.payload.error,
      };
    default:
      return state;
  }
};

const useBusStopsApi = (query: BusRequestParam): [BusStopsResult, () => void] => {
  const { City, Route, callAtInstall } = query;
  const [token, setToken] = useState<string | null>(null);
  const [resData, dispatch] = useReducer(dataReducer, initialState);

  const fetchData = useCallback(() => {
    const fetchingData = async () => {
      const root_url = process.env.REACT_APP_API_URL;
      let DisplayStopOfRoute_URL = `${root_url}/api/basic/v2/Bus/DisplayStopOfRoute/City`;
      let EstimatedTimeOfArrival_URL = `${root_url}/api/basic/v2/Bus/EstimatedTimeOfArrival/City`;

      if (City !== null && Route != null) {
        DisplayStopOfRoute_URL += `/${City}/${Route}?%24format=JSON`;
        EstimatedTimeOfArrival_URL += `/${City}/${Route}?%24format=JSON`;
      }

      try {
        const [response1, response2] = await Promise.all([
          axios.get(DisplayStopOfRoute_URL, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get(EstimatedTimeOfArrival_URL, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        const results: Results = {
          BusStopOfRoutes: response1.data,
          BusN1EstimateTimes: response2.data,
        };

        dispatch({
          type: FETCH_SUCCESS,
          payload: {
            results,
            status: 200,
            total: response1.data.length,
            error: undefined,
          },
        });
      } catch (error) {
        console.error('Error fetching data:', error);

        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError;
          const responseStatus = axiosError.response ? axiosError.response.status : 0;
          const responseMessage = axiosError.response ? axiosError.response.data : "";

          if (responseStatus === 401) {
            const { token, error } = await fetchNewToken();
            if (token) {
              setToken(token);
              fetchData();
            } else {
              console.error('Error fetching new token:', error);
              dispatch({
                type: FETCH_ERROR,
                payload: {
                  status: responseStatus,
                  error: axiosError.message + JSON.stringify(responseMessage),
                },
              });
            }
          } else {
            dispatch({
              type: FETCH_ERROR,
              payload: {
                status: responseStatus,
                error: axiosError.message + JSON.stringify(responseMessage),
              },
            });
          }
        }
      }
    };

    dispatch({ type: FETCH_STARTED });

    const isMockData = process.env.REACT_APP_MOCK_DATA === "true";

    if (isMockData) {
      console.warn('Mock data return, only use in development.');
      dispatch({
        type: FETCH_SUCCESS,
        payload: {
          results: {
            BusStopOfRoutes: JSON.parse(DisplayStopOfRoute_mock),
            BusN1EstimateTimes: JSON.parse(EstimatedTimeOfArrival_mock),
          },
          status: 200,
          total: JSON.parse(DisplayStopOfRoute_mock).length,
          error: undefined,
        },
      });
    }

    if (!isMockData) {
      fetchingData();
    }
  }, [City, Route, token]);

  useEffect(() => {
    if (!token) {
      fetchNewToken().then(({ token }) => {
        if (token) {
          setToken(token);
        }
      });
    } else if (callAtInstall) {
      fetchData();
    }
  }, [callAtInstall, fetchData, token]);

  return [resData, fetchData] as [BusStopsResult, () => void];
};

export default useBusStopsApi;
