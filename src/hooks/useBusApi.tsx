import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios, { AxiosError } from 'axios';
interface BusRoute {
  RouteID: string;
  RouteName: OperatorName;
  DepartureStopNameZh: string,
  DepartureStopNameEn: string,
  DestinationStopNameZh: string,
  DestinationStopNameEn: string,


}

export interface BusRouteArray {
  records: BusRoute[];
  status: number | undefined;
  total: number;
  isLoading: boolean;
}

export interface OperatorName {
  Zh_tw: string;
  En: string;
}



interface BusRequestParam {
  City: string | undefined;

  callAtInstall: boolean;

}

// The useBusApi hook provides a reusable mechanism for fetching Bus data and managing the loading state in a React component.
//return data and useCallback function.
const useBusApi = (query: BusRequestParam): [BusRouteArray, () => void] => {
  const { City, callAtInstall } = query;

  const fetchData = useCallback(() => {


    const fetchingData = async () => {
      let url = "http:test"
      // let url = 'https://tdx.transportdata.tw/api/basic/v2/Bus/Route/City';
      if (City !== null) {
        url += `/${City}?%24select=RouteName%2CDepartureStopNameZh%2C%20DepartureStopNameEn%2C%20DestinationStopNameZh%2C%20DestinationStopNameEn&%24format=JSON`;
      }
      try {
        const response = await axios.get(url); // 请注意修改为你的API地址

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
          setResData((prevState) => ({
            ...prevState,
            status: responseStatus, // 获取 HTTP 错误状态码
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

  }, [City]);


  const [resData, setResData] = useState<BusRouteArray>({
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

  return [resData, fetchData] as [BusRouteArray, () => void];
};

export default useBusApi;