import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios, { AxiosError } from 'axios';

import { cityRoutes_mock_data } from '../utils/mocks/mock';
interface BusRoute {
  RouteID: string;
  RouteName: NameType;
  DepartureStopNameZh: string,
  DepartureStopNameEn: string,
  DestinationStopNameZh: string,
  DestinationStopNameEn: string,
  City: string;
}

export interface BusRouteResult {
  records: BusRoute[];
  status: number | undefined;
  error?: string | undefined;
  total: number;
  isLoading: boolean;
}

export interface NameType {
  Zh_tw: string;
  En: string;
}



interface BusRequestParam {
  City: string | undefined;

  callAtInstall: boolean;

}

const useBusCityApi = (query: BusRequestParam): [BusRouteResult, () => void] => {

  const { City, callAtInstall } = query;
  const [token, setToken] = useState<string | null>(null); // 初始化为null

  const fetchData = useCallback(() => {

    const fetchingData = async () => {
      const root_url = process.env.REACT_APP_API_URL
      let url = `${root_url}/api/basic/v2/Bus/Route/City`;
      if (City !== null) {
        url += `/${City}?%24select=RouteName%2CDepartureStopNameZh%2C%20DepartureStopNameEn%2C%20DestinationStopNameZh%2C%20DestinationStopNameEn%2C%20City&%24format=JSON`;
      }
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data: BusRoute[] = response.data;
        const status = response.status;

        setResData({
          records: data,
          status: status,
          total: data.length,
          isLoading: false,
        });

      } catch (error) {
        console.error('Error fetching data:', error);
        if (axios.isAxiosError(error)) { // 检查是否为 Axios 错误对象
          const axiosError = error as AxiosError; // 使用类型断言将 error 声明为 AxiosError 类型
          const responseStatus = axiosError.response ? axiosError.response.status : 0; // 使用条件语句获取 status 属性
          console.error('Error fetching data responseStatus:', responseStatus);
          if (responseStatus === 401) {
            const newToken = await fetchNewToken();
            if (newToken) {
              setToken(newToken);
              fetchData();
            } else {
              console.error('Error fetching new token.');
            }
          } else {
            setResData((prevState) => ({
              ...prevState,
              status: responseStatus,
              error: axiosError.message,
              isLoading: false,
            }));
          }

        }
      }

    };

    setResData((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
    const isMockData = process.env.REACT_APP_MOCK_DATA === "true";
    if (isMockData) {
      console.warn('Mock data return, only use in develop.');
      const cityRoutesArray = JSON.parse(cityRoutes_mock_data);
      setResData({
        records: cityRoutesArray,
        status: 200,
        total: cityRoutesArray.length,
        isLoading: false,
      });
    }
    if (!isMockData) {
      fetchingData();
    }

  }, [City, token]);
  const fetchNewToken = async () => {
    try {
      const clientID = process.env.REACT_APP_API_CLIENT_ID;
      const clientSecret = process.env.REACT_APP_API_CLIENT_SECRET;
      const root_url = process.env.REACT_APP_API_URL

      let url = `${root_url}/auth/realms/TDXConnect/protocol/openid-connect/token`;
      const tokenResponse = await axios.post(url, {
        grant_type: 'client_credentials',
        client_id: clientID,
        client_secret: clientSecret,
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const newToken = tokenResponse.data.access_token;
      return newToken;
    } catch (error) {
      console.error('Error fetching new token:', error);
      const axiosError = error as AxiosError; // 使用类型断言将 error 声明为 AxiosError 类型
      const responseStatus = axiosError.response ? axiosError.response.status : 0; // 使用条件语句获取 status 属性
      console.error('axiosError.response:', axiosError.response?.data);
      setResData((prevState) => ({
        ...prevState,
        status: responseStatus,
        error: axiosError.message,
        isLoading: false,
      }));
      return null;
    }
  };

  const [resData, setResData] = useState<BusRouteResult>({
    records: [],
    total: 0,
    status: 0,
    isLoading: false,
  });

  useEffect(() => {
    if (!token) {
      fetchNewToken().then((newToken) => {
        if (newToken) {
          setToken(newToken);
        }
      });
    } else if (callAtInstall) {
      fetchData();
    }
  }, [callAtInstall, fetchData, token]);

  return [resData, fetchData] as [BusRouteResult, () => void];
};

export default useBusCityApi;