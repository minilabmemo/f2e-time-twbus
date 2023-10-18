
import { NavLink, useParams } from 'react-router-dom';
import { ActionType, Dict, LangType, URI_SEARCH, URI_SEARCH_DEFAULT, itemI, keyboardRouteList } from '../utils/const';
import { faHeart, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';
import { cityData, getCityNameOrValue } from '../utils/cities';
import useBusApi, { BusRouteResult } from '../hooks/useBusCityApi';
import SaveSvg from '../components/Icons/SaveSvg';


export const BusRouteStops = () => {


  const SaveIcon = <SaveSvg width="21px" height="21px" />;



  const inputRef = useRef<HTMLInputElement>(null);
  const { lang, city, route } = useParams();

  console.log(lang, city, route);//TODO lang
  function calculateSearchURL({ lang, city }: { lang: string | undefined, city: string | undefined }) {
    lang = lang || 'defaultLang';
    city = city || 'defaultCity';
    return URI_SEARCH.replace(':lang', lang).replace(':city', city);
  }

  let callAtInstall = true;
  if (city === URI_SEARCH_DEFAULT) {
    callAtInstall = false;
  }
  const [result, fetchData] = useBusApi({ City: city, callAtInstall: callAtInstall });



  const [cityKeyboard, setCityKeyboard] = useState(false)

  const [routes, setRoutes] = useState(result)

  // 当 result 发生变化时，更新 routes
  useEffect(() => {
    setRoutes(result);
  }, [result]);




  function RoutesResult({ routes }: { routes: BusRouteResult }) {
    return (
      <div className='result-routes'>
        {(routes.status === 404) ? <div className='err-404'> 找不到資料，請稍後再試。</div>
          : ''}
        {(routes.total === 0) ? <div className='err-404'> 無此路線，請輸入其他關鍵字。</div>
          : ''}
        {(routes.status === 200) && (
          <div>
            {routes.records.map((item, index) => (
              <div key={index}>
                <div
                  className='route'
                // onClick={() => handleButtonClick(item)}
                >
                  <div className="route-info" >
                    <div className='route-name'> {lang === LangType.en ? (item.RouteName.En) : (item.RouteName.Zh_tw)} </div>
                    <div className='route-direction'>
                      {lang === LangType.en ? (`${item.DepartureStopNameEn} - ${item.DestinationStopNameEn}`) : (`${item.DepartureStopNameZh} - ${item.DestinationStopNameZh}`)}

                    </div>
                  </div>
                  <div className="route-action" >
                    <div className='save-icon'>{SaveIcon}</div>
                    <div className='route-city'> {getCityNameOrValue(item.City, lang)}</div>
                  </div>
                </div>

                <div className='gray-line'></div>
              </div>
            ))}

          </div>
        )}


      </div>
    );
  }

  //TODO 這邊只有查詢起點終點 應該要有中間的站名才是
  function filterRecords({ input, data }: { input: string, data: BusRouteResult }) {
    const filteredRecords = data.records.filter((record) => {

      const { RouteName, DepartureStopNameZh, DestinationStopNameZh } = record; //TODO lang
      return (
        RouteName.Zh_tw.includes(input) ||
        DepartureStopNameZh.includes(input) ||
        DestinationStopNameZh.includes(input)
      );
    });



    return {
      records: filteredRecords,
      status: data.status,
      total: filteredRecords.length, // 更新总记录数
      isLoading: data.isLoading,
    };
  }

  return (
    <div className='search'>
      <section className='search-header'>
        <div className='breadcrumb'> 首頁/ {getCityNameOrValue(city, lang)}/{route}</div>

        <div className='timetable'>{Dict.timetable[lang as keyof typeof Dict.timetable]}</div>
      </section>

      <section className='search-main'>
        <div className='sidebar'>
          <NavLink to={calculateSearchURL({ lang, city, })} className="route-link">
            返回搜尋
          </NavLink >
          <RoutesResult routes={routes} />


        </div>
        <div className='result-map'></div>

      </section>

    </ div>
  );
};


