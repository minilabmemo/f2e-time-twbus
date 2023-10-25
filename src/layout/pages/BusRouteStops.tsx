
import { NavLink, useParams } from 'react-router-dom';
import { Dict, URI_SEARCH, statusDefine } from '../../utils/const';
import { ResultErrorHint } from '../../utils/error';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getCityNameOrValue } from '../../utils/cities';
import to_loc from '../../images/to_loc.svg';

import useBusStopsApi, { BusStopsResult } from '../../apis/useBusStopsApi';
import SaveSvg from '../../components/Icons/SaveSvg';
import { useEffect, useState } from 'react';
import "leaflet/dist/leaflet.css";
import { StreetMap } from '../../components/base/StreetMap';
import { RefreshBar } from '../../components/base/RefreshBar';
import { IconColors } from '../../utils/color';
import { isRouteLiked, routeLikeAction } from '../../utils/localStorages/routelikes';
import useBusCityApi from '../../apis/useBusCityApi';
import { RouteSaveAction } from '../../components/base/RouteSaveAction';


export const BusRouteStops = () => {
  const [activeTab, setActiveTab] = useState(0);

  const { lang = 'defaultLang', city = 'defaultCity', route = "defaultRoute" } = useParams();//TODO lang

  function calculateSearchURL({ lang, city }: { lang: string, city: string }) {
    return URI_SEARCH.replace(':lang', lang).replace(':city', city);
  }

  const [result, fetchData] = useBusStopsApi({ City: city, Route: route, callAtInstall: true });

  function StopStatus({ name, status, estimateTime }: { name: string, status: number, estimateTime: number | null }) {

    const [showStatus, color] = statusDefine(status, estimateTime);

    return (
      <div className="stop-container">
        <div className={`estimateTime ${color}`}>
          {showStatus}
        </div>
        <div className={`name ${color}`}>
          {name}

        </div>

        {/* TODO line &  */}
        {/* {status} */}
      </div>

    );
  }

  //TODO 捲軸紀錄以免更新後回到上方
  function BusStopsResult({ result, route }: { result: BusStopsResult, route: string }) {


    return (
      <div className='result-stops'>

        <ResultErrorHint status={result.status} error={result.error} total={result.total} />
        <div className="route-infos">
          <div className="route-name">{route}  </div>

          <div className="route-?"></div>{/* //TODO API? */}
        </div>
        {(result.status === 200) && (
          <div>
            <div className="tab-buttons">
              {result.results?.BusStopOfRoutes.map((item, index) => (
                <span key={index}>

                  <button
                    className={`tab-button ${activeTab === index ? 'active' : 'inactive'}`}

                    onClick={() => setActiveTab(index)}
                  >
                    {item.Stops[item.Stops.length - 1].StopName.Zh_tw}
                  </button>


                </span>
              ))}
            </div>

            <div className="tab-contents">

              {result.results?.BusStopOfRoutes.map((item, index) => (
                activeTab === index && (
                  <div key={index} className={`tab-content active`}>

                    {item.Stops.map((itemStop, stopIndex) => {
                      const filterStopName = itemStop.StopName.Zh_tw;
                      const filterDirection = item.Direction;
                      const targetObject = result.results?.BusN1EstimateTimes.find(item => item.StopName.Zh_tw === filterStopName && item.Direction === filterDirection);

                      return (
                        <div className='stop' key={stopIndex}>

                          <StopStatus
                            name={itemStop.StopName.Zh_tw}
                            status={targetObject ? (targetObject.StopStatus) : -101}
                            estimateTime={targetObject ? (targetObject.EstimateTime) : null}
                          />

                          <div className='gray-line'></div>
                        </div>
                      );
                    })}
                  </div>)
              ))}
            </div>
          </div>



        )
        }
        <RefreshBar initialCountdown={100} refreshAction={fetchData} updateTime={result.results?.BusN1EstimateTimes[0].UpdateTime}></RefreshBar>
      </div >
    );
  }

  function getRouteUID(result: BusStopsResult, route: string) {
    if (result && result.results && Array.isArray(result.results.BusStopOfRoutes)) {
      const index = result.results.BusStopOfRoutes.findIndex(item =>
        item.RouteName.Zh_tw === route
      );
      if (index !== -1) {
        const routeUID = result.results.BusStopOfRoutes[index].RouteUID;
        return routeUID;
      }
    }
    return null;
  }



  const routeUID = getRouteUID(result, route) || "";
  console.log("🚀 ~ file: BusRouteStops.tsx:141 ~ BusRouteStops ~ routeUID:", routeUID, activeTab)//TODO check 

  return (
    <div className='search'>
      <section className='search-header'>
        <div className='breadcrumb'> 首頁/ {getCityNameOrValue(city, lang)}/{route}</div>

        <div className='timetable'>{Dict.timetable[lang as keyof typeof Dict.timetable]}</div>
      </section>

      <section className='search-main'>
        <div className='sidebar'>
          <div className="link-container">
            <NavLink to={calculateSearchURL({ lang, city, })} className="return-search-link">
              <FontAwesomeIcon icon={faChevronLeft} className='icon' /> 返回搜尋
            </NavLink >
            {getRouteUID(result, route)}
            <RouteSaveAction city={city} routeUID={routeUID} route={route} />
            {/* <span className='save-icon' onClick={() => { handleRouteLike(routeUID, route); setIsLiked(!isLiked) }}>
              {isRouteLiked(routeUID) ? (<SaveSvg width="21px" height="21px" fill={IconColors.pinkFont} />) :
                (<SaveSvg width="21px" height="21px" fill='gray' />)}
            </span > */}
          </div>
          <BusStopsResult result={result} route={route} key={0} />



        </div>

        <div className='result-map'>
          <div className="to-user-loc-icon" >
            <img src={to_loc} alt="to_loc" />
          </div>

          {/* {result.isLoading ? "loading...." : (<LeafletMap id="street-map" />)} */}
          {/* //TODO 更新站點的title不是整個地圖才是 */}
          <StreetMap id="street-map"
            stops={result.results?.BusStopOfRoutes[activeTab].Stops}
            busN1EstimateTimes={result.results?.BusN1EstimateTimes}
            activeTab={activeTab}
          />

        </div>

      </section >

    </ div >
  );
};



function useBusApi(arg0: { City: string; callAtInstall: any; }): [any] {
  throw new Error('Function not implemented.');
}

