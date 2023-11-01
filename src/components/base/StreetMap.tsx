import { BusN1EstimateTime, Stop } from "../../apis/useBusStopsApi";
import user_position from '../../images/user_position.svg';
import pointBlue from '../../images/point_blue.svg';
import pointRed from '../../images/point_red.svg';
import point_red_large_bus from '../../images/point_red_large_bus.svg';
import ReactDOMServer from "react-dom/server";
import L from "leaflet";
import { StatusColorType, statusDefine } from "../../utils/const";
import BusSvg from '../Icons/BusSvg';
import { MapColors } from "../../utils/color";
import { useEffect, useRef } from "react";
import { getUserLocation } from "../../utils/gps";
import { BusStation } from "../../apis/useBusStopsNearByApi";
import to_loc from '../../images/to_loc.svg';

interface StreetMapData {
  id: string;
  stops?: Stop[] | undefined;
  busN1EstimateTimes?: BusN1EstimateTime[] | undefined;
  activeTab: number;
  initZoom: number;
  stations?: BusStation[] | undefined;
  flyToUserLoc: boolean;
}
interface MarkerRealtimeData {
  stops?: Stop[] | undefined;
  busN1EstimateTimes?: BusN1EstimateTime[] | undefined;
}
const smallIconSize = 30;
const pointRedIconSmall = new L.Icon({
  iconUrl: pointRed,
  iconSize: [smallIconSize, smallIconSize],
  iconAnchor: [smallIconSize / 2, smallIconSize / 2],
  popupAnchor: [0, 0]
})
const pointBlueIconSmall = new L.Icon({
  iconUrl: pointBlue,
  iconSize: [smallIconSize, smallIconSize],
  iconAnchor: [smallIconSize / 2, smallIconSize / 2],
  popupAnchor: [0, 0]
})
function markersByRealtime({ stops, busN1EstimateTimes }: MarkerRealtimeData) {
  const markersFarRealtime: L.Marker[] = [];
  const markersNearRealtime: L.Marker[] = [];
  const largeIconSize = 40;
  const pointRedLargeBusIcon = new L.Icon({
    iconUrl: point_red_large_bus,
    iconSize: [largeIconSize, largeIconSize],
    iconAnchor: [largeIconSize / 2, largeIconSize / 2],//定位
    popupAnchor: [0, 0]
  })
  const pointBlueIcon = new L.Icon({
    iconUrl: pointBlue,
    iconSize: [largeIconSize, largeIconSize],
    iconAnchor: [largeIconSize / 2, largeIconSize / 2],
    popupAnchor: [0, 0]
  })


  let realTimelines: L.LatLngExpression[] = [];


  const lastIndex = stops ? stops.length - 1 : -1;
  stops?.forEach((stop, index) => {
    //TODO 效能優化 targetObject用到多次 是否應該在獲取時整理一次就好 拉到外面整理
    const targetObject =
      busN1EstimateTimes?.find(item => item.StopName.Zh_tw === stop.StopName.Zh_tw
        && item.StopUID === stop.StopUID
      );
    const status = targetObject ? (targetObject.StopStatus) : -101;
    const estimateTime = targetObject ? (targetObject.EstimateTime) : null;
    const [showStatus, color] = statusDefine(status, estimateTime);

    let lat = stop.StopPosition.PositionLat;
    let lon = stop.StopPosition.PositionLon;
    if (stop.StopName.Zh_tw === "力捷公司") {
      if (lat === 24.12478) {
        lat = 25.036537
      }
      if (lon === 120.65676) {
        lon = 121.301641
        console.log("修正力捷公司後端資料重複有兩筆，且有不合理地理位置")//NEEDCHECK
      }
    }

    const latLng = L.latLng(lat, lon); //number類型轉換為適合的類型

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
      markersFarRealtime.push( //當地圖縮小時，較遠時顯示將到站的巴士圖標

        L.marker(latLng, {
          icon: pointRedLargeBusIcon,
          opacity: 1.0,
        }).bindTooltip(L.tooltip({
          permanent: false,
          direction: "top",
          className: "map-stop-tooltip style red"
        }).setContent(tooltipBody))
      );


      markersNearRealtime.push( //當地圖放大時，較近時顯示進站中tooltip與紅色原點
        L.marker(latLng, {
          icon: pointRedIconSmall,
          opacity: 1.0,
        }).bindTooltip(L.tooltip({
          permanent: true,
          direction: "top",
          className: "map-stop-tooltip style red" //TODO 箭頭怎改
        }).setContent(tooltipBodyRed))
      );

    } else {
      markersNearRealtime.push( //當地圖放大時，較近時顯示藍色圓點icon與藍色tooltip
        L.marker(latLng, {
          icon: pointBlueIconSmall,
          opacity: 1.0,
        }).bindTooltip(L.tooltip({
          permanent: true,
          direction: "top",
          className: "map-stop-tooltip style blue" //TODO 箭頭怎改
        }).setContent(tooltipBody))
      );
    }


    if ((index === 0) || (index === lastIndex)) {
      markersFarRealtime.push( //當地圖縮小時， 只顯示起點跟終點藍色原點
        L.marker(latLng, {
          icon: pointBlueIcon,
          opacity: 1.0,
        })
      );
    }



    realTimelines.push(latLng);

  });

  return { markersFarRealtime, markersNearRealtime, realTimelines };
}


function markersByStations({ stations }: { stations?: BusStation[] | undefined }) {
  const markersFarStations: L.Marker[] = [];
  const markersNearStations: L.Marker[] = [];
  stations?.forEach((station, index) => {

    const tooltipBody = `
    <div  style="color: white" class="map-stop-body">
      <div class="map-stop-name">   ${station.StationName.Zh_tw}</div>
    </div>
  `;
    const lat = station.StationPosition.PositionLat;
    const lon = station.StationPosition.PositionLon;
    const latLng = L.latLng(lat, lon); //number類型轉換為適合的類型
    const marker = L.marker(latLng, {
      icon: pointBlueIconSmall,
      opacity: 1.0,
    }).bindTooltip(L.tooltip({
      permanent: true,
      direction: "top",
      className: "map-stop-tooltip style blue"
    }).setContent(tooltipBody))

    markersFarStations.push(
      marker
    );
    markersNearStations.push(
      marker
    );
  });
  return { markersFarStations, markersNearStations };
}

export const StreetMap: React.FC<StreetMapData> = ({ id, stops, busN1EstimateTimes, activeTab, initZoom, stations, flyToUserLoc }) => {

  const lastCenterRef = useRef<[number, number]>([25.03418, 121.564517]); // 初始化中心點
  const mapRef = useRef<L.Map | null>(null);
  const zoomRef = useRef(initZoom); //  0 - 18，值越大越近
  const activeTabRef = useRef(-1);
  const panToUserLocation = async () => {
    if (mapRef.current) {
      const location = await getUserLocation();
      if (location && location.userLat !== 0 && location.userLng !== 0) {
        mapRef.current.panTo(L.latLng(location.userLat, location.userLng));
      }
    } else {
      console.log("地圖尚未完成，等稍後再試。")
    }
  };

  useEffect(() => {
    const fetchUserLocation = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));//wait 1s
      try {
        const location = await getUserLocation();//TODO 邏輯往外抽
        if (location) {
          console.log("抓取到使用者定位");

          if (location.userLat !== 0 && location.userLng !== 0) {
            if (mapRef.current) {
              const userLocIcon = new L.Icon({
                iconUrl: user_position,
                iconSize: [40, 40],
                iconAnchor: [24, 24],
                popupAnchor: [0, -24]
              })
              const userMarkerLoc = L.latLng(location.userLat, location.userLng);
              L.marker(userMarkerLoc, {
                icon: userLocIcon,
                opacity: 1.0,
              }).bindTooltip("你在這裡！", { permanent: false }).addTo(mapRef.current);


              if (flyToUserLoc) {
                mapRef.current.flyTo(userMarkerLoc);
                activeTabRef.current = activeTab;

              }
            }
          }
        }
      } catch (error) {
        //FIXME 偶爾切換會出現error log Cannot read properties of undefined (reading 'appendChild') at NewClass._initIcon 但顯示正常
        console.error("捕獲異常:", error, "map", mapRef.current?.getPane);
      }
    };

    if (!mapRef.current) {
      const map = L.map(id, {
        zoomControl: false,
      }).setView(lastCenterRef.current, zoomRef.current);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      mapRef.current = map;

    } else {
      lastCenterRef.current = [mapRef.current.getCenter().lat, mapRef.current.getCenter().lng];
    }
    fetchUserLocation();

    let polyline: L.Polyline;
    const markersFarToShow: L.Marker[] = [];
    const markersNearToShow: L.Marker[] = [];
    const lineCoordinates: L.LatLngExpression[] = [];
    if (stops) {
      const { markersFarRealtime, markersNearRealtime, realTimelines } = markersByRealtime({
        stops,
        busN1EstimateTimes
      });
      markersFarToShow.push(...markersFarRealtime)
      markersNearToShow.push(...markersNearRealtime)
      lineCoordinates.push(...realTimelines)
    }
    if (stations) {
      const { markersFarStations, markersNearStations } = markersByStations({
        stations
      });
      markersFarToShow.push(...markersFarStations)
      markersNearToShow.push(...markersNearStations)

    }

    const handleZoomEnd = () => {
      if (mapRef.current) {
        const currentZoomLevel = mapRef.current?.getZoom() || 0;
        zoomRef.current = currentZoomLevel; // 記住上次縮放大小

        markersFarToShow.forEach((marker) => {
          mapRef.current?.removeLayer(marker);
        });
        markersNearToShow.forEach((marker) => {
          mapRef.current?.removeLayer(marker);
        });
        if (currentZoomLevel >= 15) { // 顯示近的標示
          markersNearToShow.forEach((marker) => {
            if (mapRef.current) {
              marker.addTo(mapRef.current).openTooltip();
            }
          });
        } else {
          markersFarToShow.forEach((marker) => { // 顯示遠的標示
            if (mapRef.current) {
              marker.addTo(mapRef.current);
            }
          });
        }
      }
    };

    handleZoomEnd();

    if (mapRef.current) {
      mapRef.current.on("zoomend", function () {
        handleZoomEnd();

      });
      polyline = L.polyline(lineCoordinates, {
        color: MapColors.blueLine,
      }).addTo(mapRef.current);
      if (lineCoordinates.length > 0) {
        if (activeTabRef.current !== activeTab) {//有發現切換時才重新移動到路徑中心點
          const centerLatLng = lineCoordinates[Math.floor(lineCoordinates.length / 2)] as [number, number];
          mapRef.current.flyTo(centerLatLng);
          activeTabRef.current = activeTab;
        }
      }




    }


    return () => {
      if (mapRef.current) {
        mapRef.current.removeLayer(polyline);
      }
      markersFarToShow.forEach((marker) => {
        if (mapRef.current && mapRef.current.hasLayer(marker)) {
          mapRef.current.removeLayer(marker);
        }

      });

      markersNearToShow.forEach((marker) => {
        if (mapRef.current) {
          mapRef.current.removeLayer(marker);
        }
      });
      markersFarToShow.length = 0; // 上面的重新宣告沒用，要在這邊清空數組才行，不然會重複新舊資料
      markersNearToShow.length = 0;
      lineCoordinates.length = 0;
    };
  }, [id, busN1EstimateTimes, stops, activeTab, lastCenterRef, activeTabRef, flyToUserLoc, stations]);




  return <div id={id} style={{ height: "100%", width: "100vw", maxWidth: "100%" }} >
    <div className="to-loc-icon" onClick={panToUserLocation}>
      <img src={to_loc} alt="to_location" />
    </div>
  </div>

};
