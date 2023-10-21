
import { NavLink, useParams } from 'react-router-dom';
import { Dict, StatusColorType, URI_SEARCH, statusDefine } from '../utils/const';
import { getUserLocation } from '../utils/gps';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactDOMServer from "react-dom/server";

import { getCityNameOrValue } from '../utils/cities';
import pointBlue from '../images/point_blue.svg';
import pointRed from '../images/point_red.svg';
import point_red_large_bus from '../images/point_red_large_bus.svg';
import user_position from '../images/user_position.svg';
import to_loc from '../images/to_loc.svg';
import useBusStopsApi, { BusStopsResult } from '../hooks/useBusStopsApi';
import SaveSvg from '../components/Icons/SaveSvg';
import { useEffect, useState } from 'react';
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapColors } from '../utils/color';
import BusSvg from '../components/Icons/BusSvg';
import { StreetMap } from './StreetMap';


export const BusRouteStops = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [defaultUserLoc, setUserLoc] = useState([0, 0]);
  const { lang = 'defaultLang', city = 'defaultCity', route = "defaultRoute" } = useParams();//TODO lang

  function calculateSearchURL({ lang, city }: { lang: string, city: string }) {
    return URI_SEARCH.replace(':lang', lang).replace(':city', city);
  }

  const [result, fetchData] = useBusStopsApi({ City: city, Route: route, callAtInstall: true });

  console.log("BusRouteStops", result);

  useEffect(() => {
    getUserLocation().then((location) => {
      if (location) {
        setUserLoc([location.userLat, location.userLng])
      }
    });

  }, []);


  const ErrorHint = ({ result }: { result: BusStopsResult }) => {
    if (result.status === 429) {
      return <div className='err-hint'>請求已達上限，請明日再試。</div>;
    }
    if (result.status === 404) {
      return <div className='err-hint'>找不到資料，請稍後再試。</div>;
    }
    if (result.status !== 200 && result.status !== 0) {
      return <div className='err-hint'>Ops..遇到了問題，請稍後再試。</div>;
    }
    return null;
  };



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

  function BusStopsResult({ result, route }: { result: BusStopsResult, route: string }) {



    return (
      <div className='result-stops'>

        <ErrorHint result={result} />
        <div className="route-infos">
          <div className="route-name">{route}</div>

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


          //TODO更新鈕
        )
        }
      </div >
    );
  }


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
            <span className='save-icon'><SaveSvg width="21px" height="21px" /></span>
          </div>
          <BusStopsResult result={result} route={route} key={0} />


        </div>

        <div className='result-map'>
          <div className="to-user-loc-icon" >
            <img src={to_loc} alt="to_loc" />
          </div>

          {/* {result.isLoading ? "loading...." : (<LeafletMap id="street-map" />)} */}

          <StreetMap id="street-map" result={result} userLocation={defaultUserLoc} activeTab={activeTab} />
        </div>

      </section>

    </ div>
  );
};



