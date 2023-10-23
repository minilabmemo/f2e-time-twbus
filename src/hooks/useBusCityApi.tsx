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
  const isMockData = process.env.REACT_APP_MOCK_DATA === "true";
  const { City, callAtInstall } = query;
  const fetchData = useCallback(() => {

    const fetchingData = async () => {
      const root_url = process.env.REACT_APP_API_URL
      let url = `${root_url}/api/basic/v2/Bus/Route/City`;
      if (City !== null) {
        url += `/${City}?%24select=RouteName%2CDepartureStopNameZh%2C%20DepartureStopNameEn%2C%20DestinationStopNameZh%2C%20DestinationStopNameEn%2C%20City&%24format=JSON`;
      }
      try {
        if (isMockData) {
          console.warn('Mock data return, only use in develop.');
          const cityRoutesArray = JSON.parse(cityRoutes_mock_data);
          setResData({
            records: cityRoutesArray,
            status: 200,
            total: cityRoutesArray.length,
            isLoading: false,
          });



        } else {
          const response = await axios.get(url);

          const data: BusRoute[] = response.data;
          const status = response.status;

          setResData({
            records: data,
            status: status,
            total: data.length,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        if (axios.isAxiosError(error)) { // 检查是否为 Axios 错误对象
          const axiosError = error as AxiosError; // 使用类型断言将 error 声明为 AxiosError 类型
          const responseStatus = axiosError.response ? axiosError.response.status : 0; // 使用条件语句获取 status 属性
          console.error('Error fetching data responseStatus:', responseStatus);

          setResData((prevState) => ({
            ...prevState,
            status: responseStatus, // 获取 HTTP 错误状态码
            error: axiosError.message,
            isLoading: false,
          }));

        }
      }

    };

    setResData((prevState) => ({
      ...prevState,
      isLoading: true,
    }));

    fetchingData();

  }, [City, isMockData]);


  const [resData, setResData] = useState<BusRouteResult>({
    records: [],
    total: 0,
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

export default useBusCityApi;