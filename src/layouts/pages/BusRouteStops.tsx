
import { NavLink, useParams } from 'react-router-dom';
import { URI_SEARCH, statusDefine } from '../../utils/const';
import { phone_media } from '../../utils/media_query';
import { ResultErrorHint } from '../../utils/error';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getCityNameOrValue } from '../../utils/cities';

import useBusStopsApi, { BusStopsResult } from '../../apis/useBusStopsApi';
import { useState } from 'react';
import "leaflet/dist/leaflet.css";
import { StreetMap } from '../../components/base/StreetMap';
import { RefreshBar } from '../../components/base/RefreshBar';
import { RouteSaveAction } from '../../components/base/RouteSaveAction';
import map_icon from "../../assets/images/map.svg"
import { useMediaQuery } from "@uidotdev/usehooks";
import { useTranslation } from 'react-i18next';
//TODO 捲軸紀錄以免更新後回到上方
function Results({ result, route, fetchData, lang, city, isSmallDevice, phoneMapOpen }:
  { result: BusStopsResult, route: string, fetchData: () => void, lang: string, city: string, isSmallDevice: boolean, phoneMapOpen: boolean }) {
  const routeUID = getRouteUID(result, route) || "";
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <div className={`sidebar ${phoneMapOpen ? 'hidden' : ""}`}>
        <div className="stop-action ">
          <NavLink to={calculateSearchURL({ lang, city, })} className="return-search-link">
            <FontAwesomeIcon icon={faChevronLeft} className='icon' /> 返回搜尋
          </NavLink >
          {getRouteUID(result, route)}
          {(result.status === 200) && (
            <RouteSaveAction city={city} routeUID={routeUID} route={route} />)}

        </div>
        <div className='result-stops'>

          <ResultErrorHint status={result.status} error={result.error} total={result.total} />
          <div className="route-infos">
            <div className="route-name">{route}  </div>
            <div className="route-?"></div>{/* //TODO API? */}
          </div>
          {result.isLoading && (<div className='result-loading'> <div className='spinner'></div></div>)}
          {(result.status === 200) && (
            <>
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

                        const targetObject = result.results?.BusN1EstimateTimes.find(item => item.StopName.Zh_tw === filterStopName && item.StopUID === itemStop.StopUID);

                        return (
                          <div className='stop' key={stopIndex}>

                            <StopStatus
                              name={itemStop.StopName.Zh_tw}
                              status={targetObject ? (targetObject.StopStatus) : -2}
                              estimateTime={targetObject ? (targetObject.EstimateTime) : null}
                            />

                            <div className='gray-line'></div>
                          </div>
                        );
                      })}
                    </div>)
                ))}
              </div>
            </>



          )
          }
          <RefreshBar initialCountdown={30} refreshAction={fetchData} updateTime={result.results?.BusN1EstimateTimes[0].UpdateTime}></RefreshBar>
        </div >

      </div>

      {phoneMapOpen && (<div className='result-map phone'>
        {result.isLoading && (<div className='result-loading'> <div className='spinner'></div></div>)}
        {(result.status === 200) && (
          <StreetMap id="street-map-phone"
            stops={result.results?.BusStopOfRoutes[activeTab].Stops}
            busN1EstimateTimes={result.results?.BusN1EstimateTimes}
            activeTab={activeTab}
            initZoom={15}
            flyToUserLoc={false}
          />)}
      </div>)}
      {isSmallDevice || (<div className='result-map'>
        {/* //TODO 更新站點的title不是整個地圖才是 */}
        {result.isLoading && (<div className='result-loading'> <div className='spinner'></div></div>)}
        {(result.status === 200) && (
          <StreetMap id="street-map"
            stops={result.results?.BusStopOfRoutes[activeTab].Stops}
            busN1EstimateTimes={result.results?.BusN1EstimateTimes}
            activeTab={activeTab}
            initZoom={13}
            flyToUserLoc={false}
          />)}

      </div>)}

    </>
  );
}
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
function calculateSearchURL({ lang, city }: { lang: string, city: string }) {
  return URI_SEARCH.replace(':lang', lang).replace(':city', city);
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

export const BusRouteStops = () => {
  const isSmallDevice = useMediaQuery(phone_media);
  const { lang = 'defaultLang', city = 'defaultCity', route = "defaultRoute" } = useParams();

  const [result, fetchData] = useBusStopsApi({ City: city, Route: route, callAtInstall: true });
  const { t } = useTranslation();
  console.log("🚀 ~ file: BusRouteStops.tsx:141 ~ BusRouteStops ~ result:", result)//TODO check 
  const [phoneMapOpen, setMapOpen] = useState(false)
  return (
    <div className='content'>
      <section className='content-header'>
        <div className='breadcrumb'> 首頁/ {getCityNameOrValue(city, lang)}/{route}</div>
        {isSmallDevice ? (
          <div className='mapBtn' onClick={() => setMapOpen(!phoneMapOpen)}>
            <img src={map_icon} alt="map_icon" className='icon' />
            {t("map")}</div>
        ) : (<div className='timetable'> {t("timetable")}</div>)}
      </section>

      <section className='content-main'>

        <Results result={result} route={route} key={0} fetchData={fetchData} lang={lang} city={city} isSmallDevice={isSmallDevice} phoneMapOpen={phoneMapOpen} />


      </section >

    </ div >
  );
};





