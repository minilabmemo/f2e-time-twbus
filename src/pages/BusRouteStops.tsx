
import { NavLink, useParams } from 'react-router-dom';
import { Dict, URI_SEARCH } from '../utils/const';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getCityNameOrValue } from '../utils/cities';

import useBusStopsApi, { BusStopsResult } from '../hooks/useBusStopsApi';
import SaveSvg from '../components/Icons/SaveSvg';
import { useState } from 'react';


export const BusRouteStops = () => {

  const { lang = 'defaultLang', city = 'defaultCity', route = "defaultRoute" } = useParams();//TODO lang

  function calculateSearchURL({ lang, city }: { lang: string, city: string }) {
    return URI_SEARCH.replace(':lang', lang).replace(':city', city);
  }


  const [result, fetchData] = useBusStopsApi({ City: city, Route: route, callAtInstall: true });

  console.log(result);
  // robot?字型

  // 当 result 发生变化时，更新 routes
  // useEffect(() => {
  //   setRoutes(result);
  // }, [result]);


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


  function statusDefine(status: number, estimateTime: number | null) {
    if (status === 1) {
      return ['尚未發車', "gray"];//TODO 2345
    }
    if (estimateTime === null) {
      return ['無資訊', "gray"];
    }
    if (typeof estimateTime === 'number') {
      if (estimateTime < 60) {
        // return [`進站中 ${estimateTime}秒`, "red"];  
        return [`進站中`, "red"];  //60秒內顯示進站中
      }

      if (estimateTime >= 60 && estimateTime < 3600) {
        const minutes = Math.floor(estimateTime / 60);

        const seconds = estimateTime % 60;
        if (minutes === 1) { //兩分鐘內顯示 即將進站
          // return [` 即將進站 ${minutes}分${seconds}秒`, "red"];
          return [` 即將進站`, "red"];
        }
        return [`${minutes}分${seconds}秒`, "blue"];
      }

      if (estimateTime >= 3600) {
        const hours = Math.floor(estimateTime / 3600);
        const remainingSeconds = estimateTime % 3600;
        const minutes = Math.floor(remainingSeconds / 60);
        const seconds = remainingSeconds % 60;
        return [`${hours}小時${minutes}分${seconds}秒`, "blue"];
      }
    }
    return ['未知', "gray"];
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

  function BusStopsResult({ result, route }: { result: BusStopsResult, route: string }) {
    const [activeTab, setActiveTab] = useState(0);

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
                <>

                  <button
                    key={index}
                    className={`tab-button ${activeTab === index ? 'active' : 'inactive'}`}

                    onClick={() => setActiveTab(index)}
                  >
                    {item.Stops[item.Stops.length - 1].StopName.Zh_tw}
                  </button>


                </>
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
          <BusStopsResult result={result} route={route} />


        </div>
        <div className='result-map' id="map"></div>

      </section>

    </ div>
  );
};


