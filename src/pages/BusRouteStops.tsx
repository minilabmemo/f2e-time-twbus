
import { NavLink, useParams } from 'react-router-dom';
import { Dict, URI_SEARCH } from '../utils/const';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactDOMServer from "react-dom/server";

import { getCityNameOrValue } from '../utils/cities';
import pointBlue from '../images/point_blue.svg';
import pointRed from '../images/point_red.svg';
import point_red_large_bus from '../images/point_red_large_bus.svg';

import useBusStopsApi, { BusStopsResult } from '../hooks/useBusStopsApi';
import SaveSvg from '../components/Icons/SaveSvg';
import { useEffect, useState } from 'react';
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapColors } from '../utils/color';
import BusSvg from '../components/Icons/BusSvg';


export const BusRouteStops = () => {
  const [activeTab, setActiveTab] = useState(0);
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

  const StatusColorType = {
    red: 'red' as 'red',
    blue: 'blue' as 'blue',
    gray: 'gray' as 'gray',

  };
  function statusDefine(status: number, estimateTime: number | null) {
    if (status === 1) {
      return ['尚未發車', StatusColorType.gray];//TODO 2345
    }
    if (estimateTime === null) {
      return ['無資訊', StatusColorType.gray];
    }
    if (typeof estimateTime === 'number') {
      if (estimateTime < 60) {
        // return [`進站中 ${estimateTime}秒`, "red"];  
        return [`進站中`, StatusColorType.red];  //60秒內顯示進站中
      }

      if (estimateTime >= 60 && estimateTime < 3600) {
        const minutes = Math.floor(estimateTime / 60);

        const seconds = estimateTime % 60;
        if (minutes === 1) { //兩分鐘內顯示 即將進站
          // return [` 即將進站 ${minutes}分${seconds}秒`, "red"];
          return [` 即將進站`, StatusColorType.red];
        }
        return [`${minutes}分${seconds}秒`, StatusColorType.blue];
      }

      if (estimateTime >= 3600) {
        const hours = Math.floor(estimateTime / 3600);
        const remainingSeconds = estimateTime % 3600;
        const minutes = Math.floor(remainingSeconds / 60);
        const seconds = remainingSeconds % 60;
        return [`${hours}小時${minutes}分${seconds}秒`, StatusColorType.blue];
      }
    }
    return ['未知', StatusColorType.gray];
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
  const LeafletMap: React.FC<{ id: string; }> = ({ id }) => {
    useEffect(() => {
      let zoom = 15; // 0 - 18

      let center: L.LatLngExpression = [25.03418, 121.564517]; // 中心點座標
      const map = L.map(id).setView(center, zoom);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',

      }).addTo(map);


      const pointRedLargeBusIcon = new L.Icon({
        iconUrl: point_red_large_bus,
        iconSize: [40, 40],
        iconAnchor: [24, 24],
        popupAnchor: [0, -24]
      })
      const pointRedIcon = new L.Icon({
        iconUrl: pointRed,
        iconSize: [40, 40],
        iconAnchor: [24, 24],
        popupAnchor: [0, -24]
      })
      const pointBlueIcon = new L.Icon({
        iconUrl: pointBlue,
        iconSize: [40, 40],
        iconAnchor: [24, 24],
        popupAnchor: [0, -24]
      })



      const markersFarToShow: L.Marker[] = []; //縮小時較遠的顯示
      const markersNearToShow: L.Marker[] = [];//放大時較近的顯示
      let lineCoordinates: L.LatLngExpression[] = [];
      const filterDirection = result.results?.BusStopOfRoutes[activeTab].Direction;
      const stops = result.results?.BusStopOfRoutes[activeTab].Stops;
      const lastIndex = stops ? stops.length - 1 : -1;
      result.results?.BusStopOfRoutes[activeTab].Stops.forEach((stop, index) => {
        //TODO 效能優化 targetObject用到多次
        const targetObject = result.results?.BusN1EstimateTimes.find(item => item.StopName.Zh_tw === stop.StopName.Zh_tw && item.Direction === filterDirection);
        const status = targetObject ? (targetObject.StopStatus) : -101;
        const estimateTime = targetObject ? (targetObject.EstimateTime) : null;
        const [showStatus, color] = statusDefine(status, estimateTime);

        const lat = stop.StopPosition.PositionLat;
        const lon = stop.StopPosition.PositionLon;
        const latLng = L.latLng(lat, lon); //number類型轉換為適合的類型

        const customContent = `
        <div style="text-align: center;">
        ${ReactDOMServer.renderToString(<SaveSvg width="21px" height="21px" />)}
          <img src="your-image-url.jpg" alt="Image" style="max-width: 100%;">
          <h2 style="margin: 5px 0;">Your Name</h2>
          <p style="font-size: 14px;">Additional information or description here.</p>
        </div>
      `;

        const tooltipBody = `
      <div  style="color: white" class="map-stop-body">
        <div class="map-stop-name">   ${stop.StopName.Zh_tw}</div>
        <div class="map-stop-status">   ${showStatus}</div>
      </div>
    `;
        const tooltipBodyRed = `
    <div  style="color: white" class="map-stop-body">
    ${ReactDOMServer.renderToString(<BusSvg width="21px" height="21px" fill="white" />)}
      <div class="map-stop-name">   ${stop.StopName.Zh_tw}</div>
      <div class="map-stop-status">   ${showStatus}</div>
    </div>
  `;



        if (color === StatusColorType.red) {
          markersFarToShow.push( //當地圖縮小時，較遠時顯示將到站的巴士圖標
            L.marker(latLng, {
              icon: pointRedLargeBusIcon,
              opacity: 1.0,
            }).bindTooltip("放大查看站點")
          );
          markersNearToShow.push( //當地圖放大時，較近時顯示紅色原點
            L.marker(latLng, {
              icon: pointRedIcon,
              opacity: 1.0,
            })
          );
          markersNearToShow.push( //當地圖放大時，較近時顯示藍色tooltip
            L.marker(latLng).bindTooltip(L.tooltip({
              permanent: true,
              direction: "top",
              className: "map-stop-tooltip style red" //TODO 箭頭怎改
            }).setContent(tooltipBodyRed))
          );

        } else {
          markersNearToShow.push( //當地圖放大時，較近時顯示藍色tooltip
            L.marker(latLng).bindTooltip(L.tooltip({
              permanent: true,
              direction: "top",
              className: "map-stop-tooltip style blue" //TODO 箭頭怎改
            }).setContent(tooltipBody))
          );
        }
        markersNearToShow.push( //當地圖放大時，較近時顯示藍色原點
          L.marker(latLng, {
            icon: pointBlueIcon,
            opacity: 1.0,
          })

        );

        if ((index === 0) || (index === lastIndex)) {
          markersFarToShow.push( //當地圖縮小時， 只顯示起點跟終點藍色原點
            L.marker(latLng, {
              icon: pointBlueIcon,
              opacity: 1.0,
            })
          );
        }




        lineCoordinates.push(latLng);

      });
      map.on("zoomend", function () {
        const currentZoomLevel = map.getZoom();
        //清除markersFarToShow與markersNearToShow
        // 清除 markersFarToShow 数组中的标记
        markersFarToShow.forEach((marker) => {
          map.removeLayer(marker);
        });

        // 清除 markersNearToShow 数组中的标记
        markersNearToShow.forEach((marker) => {
          map.removeLayer(marker);
        });
        if (currentZoomLevel >= 15) { //放大縮小時顯示近的標示組
          markersNearToShow.forEach((marker) => {
            marker.addTo(map).openTooltip();

          });
        } else {
          markersFarToShow.forEach((marker) => {
            marker.addTo(map);
          });

        }



      });
      L.polyline(lineCoordinates, {
        color: MapColors.blueLine,
      }).addTo(map);

      if (lineCoordinates.length > 0) {
        map.flyTo(lineCoordinates[Math.floor(lineCoordinates.length / 2)]);
      }
      return () => {
        if (map) {
          map.remove();
        }
      };
    }, [id]);

    return <div id={id} style={{ height: "100%" }} />;
  };



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
        <div className='result-map'>
          <LeafletMap id="street-map" />
        </div>

      </section>

    </ div>
  );
};


