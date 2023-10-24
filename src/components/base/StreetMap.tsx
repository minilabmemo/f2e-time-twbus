import { BusN1EstimateTime, BusStopsResult, Stop } from "../../apis/useBusStopsApi";
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
interface StreetMapData {
  id: string;

  stops: Stop[] | undefined;
  busN1EstimateTimes: BusN1EstimateTime[] | undefined;
  activeTab: number;
}


export const StreetMap: React.FC<StreetMapData> = ({ id, stops, busN1EstimateTimes, activeTab }) => {
  console.log("🚀 ~ file: StreetMap.tsx:23 ~ activeTab:", activeTab)
  const lastCenterRef = useRef<[number, number]>([25.03418, 121.564517]); // 初始化为默认中心点坐标
  const mapRef = useRef<L.Map | null>(null);
  const zoomRef = useRef(13); //  0 - 18，值越大越近
  const activeTabRef = useRef(-1);
  useEffect(() => {

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
    const markersFarToShow: L.Marker[] = []; //縮小時較遠的顯示
    const markersNearToShow: L.Marker[] = [];//放大時較近的顯示
    let lineCoordinates: L.LatLngExpression[] = [];
    let polyline: L.Polyline;
    const filterDirection = activeTab;

    const lastIndex = stops ? stops.length - 1 : -1;
    stops?.forEach((stop, index) => {
      //TODO 效能優化 targetObject用到多次
      const targetObject = busN1EstimateTimes?.find(item => item.StopName.Zh_tw === stop.StopName.Zh_tw && item.Direction === filterDirection);
      const status = targetObject ? (targetObject.StopStatus) : -101;
      const estimateTime = targetObject ? (targetObject.EstimateTime) : null;
      const [showStatus, color] = statusDefine(status, estimateTime);

      const lat = stop.StopPosition.PositionLat;
      const lon = stop.StopPosition.PositionLon;
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
        markersFarToShow.push( //當地圖縮小時，較遠時顯示將到站的巴士圖標

          L.marker(latLng, {
            icon: pointRedLargeBusIcon,
            opacity: 1.0,
          }).bindTooltip(L.tooltip({
            permanent: false,
            direction: "top",
            className: "map-stop-tooltip style red"
          }).setContent(tooltipBody))
        );

        // markersNearToShow.push( //當地圖放大時，較近時顯示紅色原點
        //   L.marker(latLng, {
        //     icon: pointRedIcon,
        //     opacity: 1.0,
        //   })
        // );


        markersNearToShow.push( //當地圖放大時，較近時顯示進站中tooltip
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
        markersNearToShow.push( //當地圖放大時，較近時顯示藍色圓點icon與藍色tooltip
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

      // markersNearToShow.push( //當地圖放大時，較近時顯示藍色原點
      //   L.marker(latLng, {
      //     icon: pointBlueIcon,
      //     opacity: 1.0,
      //   })

      // );

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
    const fetchUserLocation = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));//wait 1s
      try {
        const location = await getUserLocation();
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
              }).bindTooltip("你在這裡！").addTo(mapRef.current).openTooltip();
            }
          }
        }
      } catch (error) {
        //FIXME 偶爾切換會出現error log Cannot read properties of undefined (reading 'appendChild') at NewClass._initIcon
        console.error("捕獲異常:", error, "map", mapRef.current?.getPane);
      }
    };


    const handleZoomEnd = () => {
      if (mapRef.current) {
        const currentZoomLevel = mapRef.current?.getZoom() || 0;
        zoomRef.current = currentZoomLevel; // 记住上次的缩放大小

        markersFarToShow.forEach((marker) => {
          mapRef.current?.removeLayer(marker);
        });
        markersNearToShow.forEach((marker) => {
          mapRef.current?.removeLayer(marker);
        });
        if (currentZoomLevel >= 15) { // 放大缩小时显示近的标示组
          markersNearToShow.forEach((marker) => {
            if (mapRef.current) {
              marker.addTo(mapRef.current).openTooltip();
            }
          });
        } else {
          markersFarToShow.forEach((marker) => {
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

    fetchUserLocation();
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
    };
  }, [id, busN1EstimateTimes, stops, activeTab, lastCenterRef, activeTabRef]);








  return <div id={id} style={{ height: "100%" }} />;
};
