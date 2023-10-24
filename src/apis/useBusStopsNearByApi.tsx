import React, { useState, useEffect, useCallback, useReducer } from 'react';
import axios, { AxiosError } from 'axios';

import { nearby_mock_data } from '../utils/mocks/mock';
import { fetchNewToken } from './fetchNewToken';
import { PointType } from './struct';

interface BusStation {
  StationUID: string;
  StationID: string;
  StationName: NameType;
  StationPosition: PointType;
  StationAddress: string;
  Stops: StationStop[];
  LocationCityCode: string;
  Bearing: string;
  UpdateTime: string;
  VersionID: number
}

interface StationStop {
  //TODO
}

export interface BusStationResult {
  records: BusStation[];
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
  callAtInstall: boolean;
}

// Define action types
const FETCH_STARTED = 'FETCH_STARTED';
const FETCH_SUCCESS = 'FETCH_SUCCESS';
const FETCH_ERROR = 'FETCH_ERROR';

const initialState: BusStationResult = {
  records: [],
  total: 0,
  status: 0,
  isLoading: false,
};

const dataReducer = (
  state: BusStationResult,
  action: { type: string; payload?: any }
): BusStationResult => {
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

const useBusStopsNearByApi = (query: BusRequestParam): [BusStationResult, ({ filter }: { filter: string }) => void] => {
  const { callAtInstall } = query;
  const [token, setToken] = useState<string | null>(null);

  const [resData, dispatch] = useReducer(dataReducer, initialState);

  const fetchData = useCallback(({ filter }: { filter: string }) => {
    const fetchingData = async () => {
      const root_url = process.env.REACT_APP_API_URL;

      let url = `${root_url}/api/advanced/v2/Bus/Station/NearBy?%24top=30&%24spatialFilter=`;
      if (filter !== null) {
        url += filter;
      }

      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data: BusStation[] = response.data;
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
              fetchData({ filter: filter });
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
      const cityRoutesArray = JSON.parse(nearby_mock_data);
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
  }, [token]);

  useEffect(() => {
    if (!token) {
      fetchNewToken().then(({ token }) => {
        if (token) {
          setToken(token);
        }
      });
    }
  });

  return [resData, fetchData];
};

export default useBusStopsNearByApi;
