import { useState, useEffect, useCallback, useReducer } from 'react';
import axios, { AxiosError } from 'axios';

import { cityRoutes_mock_data } from '../utils/mocks/mock';
import { fetchNewToken } from './fetchNewToken';

export interface BusRoute {
  RouteUID: string;
  RouteID: string;
  RouteName: NameType;
  DepartureStopNameZh: string;
  DepartureStopNameEn: string;
  DestinationStopNameZh: string;
  DestinationStopNameEn: string;
  City: string;
}

export interface BusRouteResult {
  records: BusRoute[];
  status: number | undefined;
  error?: string | undefined;
  total: number;
  isLoading: boolean;
}

interface NameType {
  Zh_tw: string;
  En: string;
}

interface BusRequestParam {
  City: string | undefined;
  routeUID?: string | undefined;//ex contains(RouteUID,'TPE10132') 
  callAtInstall: boolean;
}

// Define action types
const FETCH_STARTED = 'FETCH_STARTED';
const FETCH_SUCCESS = 'FETCH_SUCCESS';
const FETCH_ERROR = 'FETCH_ERROR';

const initialState: BusRouteResult = {
  records: [],
  total: 0,
  status: 0,
  isLoading: false,
};

const dataReducer = (
  state: BusRouteResult,
  action: { type: string; payload?: any }
): BusRouteResult => {
  switch (action.type) {
    case FETCH_STARTED:
      return {
        ...state,
        isLoading: true,
      };
    case FETCH_SUCCESS:
      return {
        ...state,
        records: action.payload.records,
        total: action.payload.total,
        status: action.payload.status,
        isLoading: false,
        error: undefined,
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

const useBusCityApi = (query: BusRequestParam): [BusRouteResult, () => void] => {
  const { City, routeUID, callAtInstall } = query;
  const [token, setToken] = useState<string | null>(null);

  const [resData, dispatch] = useReducer(dataReducer, initialState);

  const fetchData = useCallback(() => {
    const fetchingData = async () => {
      const root_url = process.env.REACT_APP_API_URL;
      let url = `${root_url}/api/basic/v2/Bus/Route/City`;
      //EX: https://tdx.transportdata.tw/api/basic/v2/Bus/Route/City/Taipei?&%24filter=contains(RouteUID%2C%27TPE10132%27)&%24format=JSON
      if (City !== null) {
        url += `/${City}?%24select=RouteName%2CDepartureStopNameZh%2C%20DepartureStopNameEn%2C%20DestinationStopNameZh%2C%20DestinationStopNameEn%2C%20City%2C%20RouteUID`;
      }
      if (routeUID != null) {
        const filter = `contains(RouteUID,'${routeUID}')`
        url += `&%24filter=${filter}`
      }
      url += "&format=JSON"


      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data: BusRoute[] = response.data;
        const status = response.status;

        dispatch({
          type: FETCH_SUCCESS,
          payload: {
            records: data,
            total: data.length,
            status,
          },
        });
      } catch (error) {
        console.error('Error fetching data:', error);

        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError;
          const responseStatus = axiosError.response ? axiosError.response.status : 0;
          console.error('Error fetching data responseStatus:', responseStatus);

          if (responseStatus === 401) {
            const { token, error } = await fetchNewToken();
            if (token) {
              setToken(token);
              fetchData();
            } else {
              console.error('Error fetching new token:', error);
              console.error('axiosError.response:', axiosError.response?.data);

              dispatch({
                type: FETCH_ERROR,
                payload: {
                  status: responseStatus,
                  error: axiosError.message,
                },
              });
            }
          } else {
            dispatch({
              type: FETCH_ERROR,
              payload: {
                status: responseStatus,
                error: axiosError.message,
              },
            });
          }
        }
      }
    };

    dispatch({ type: FETCH_STARTED });

    const isMockData = process.env.REACT_APP_MOCK_DATA === 'true';
    if (isMockData) {
      console.warn('Mock data return, only use in development.');
      const cityRoutesArray = JSON.parse(cityRoutes_mock_data);
      dispatch({
        type: FETCH_SUCCESS,
        payload: {
          records: cityRoutesArray,
          total: cityRoutesArray.length,
          status: 200,
        },
      });
    }

    if (!isMockData) {
      fetchingData();
    }
  }, [City, token, routeUID]);

  useEffect(() => {
    if (callAtInstall) {
      if (!token) {
        fetchNewToken().then(({ token }) => {
          if (token) {
            setToken(token);
          }
        });
      }
      fetchData();
    }
  }, [callAtInstall, fetchData, token]);

  return [resData, fetchData];
};

export default useBusCityApi;
