import { BusStopsResult } from "../hooks/useBusStopsApi";
import user_position from '../images/user_position.svg';
import pointBlue from '../images/point_blue.svg';
import pointRed from '../images/point_red.svg';
import point_red_large_bus from '../images/point_red_large_bus.svg';
import ReactDOMServer from "react-dom/server";
import L from "leaflet";
import { StatusColorType, statusDefine } from "../utils/const";
import BusSvg from '../components/Icons/BusSvg';
import { MapColors } from "../utils/color";
import { useEffect } from "react";
interface StreetMapData {
  id: string;
  result: BusStopsResult;
  userLocation: number[];
  activeTab: number;

}


export const StreetMap: React.FC<StreetMapData> = ({ id, result, userLocation, activeTab }) => {


  useEffect(() => {
    let zoom = 13; // 0 - 18  越大越近
    let center: L.LatLngExpression = [25.03418, 121.564517]; // 中心點座標
    const map = L.map(id).setView(center, zoom);


    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',

    }).addTo(map);

    const userLocIcon = new L.Icon({
      iconUrl: user_position,
      iconSize: [40, 40],
      iconAnchor: [24, 24],
      popupAnchor: [0, -24]
    })

    if (userLocation[0] !== 0 && (userLocation[1] !== 0)) {
      const userlatLng = L.latLng(userLocation[0], userLocation[1]);
      L.marker(userlatLng, {
        icon: userLocIcon,
        opacity: 1.0,
      }).bindTooltip("你在這裡！").addTo(map).openTooltip();

    }





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


        markersNearToShow.push( //當地圖放大時，較近時顯示進站中tooltip
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
    if (map) {
      map.on("zoomend", function () {
        const currentZoomLevel = map.getZoom();


        markersFarToShow.forEach((marker) => {
          map.removeLayer(marker);
        });


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

        map.panTo(lineCoordinates[Math.floor(lineCoordinates.length / 2)]);

      }



    }
    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [activeTab, id, result.results?.BusN1EstimateTimes, result.results?.BusStopOfRoutes, userLocation]);

  return <div id={id} style={{ height: "100%" }} />;
};
