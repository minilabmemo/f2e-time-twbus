import { NavLink } from "react-router-dom";
import { isRouteLiked, routeLikeAction } from "../../utils/localStorages/routelikes";
import { IconColors } from "../../utils/color";
import { getCityNameOrValue } from "../../utils/cities";
import { LangType, URI_STOPS, calculateStopsURL } from "../../utils/const";
import { useState } from "react";
import SaveSvg from "../Icons/SaveSvg";
import { BusRoute } from "../../apis/useBusCityApi";

export const RouteItem = ({ item, lang }: { item: BusRoute, lang: string }) => {
  const city = item.City
  const [isLiked, setIsLiked] = useState(isRouteLiked(item.RouteUID))

  const handleLikeClick = () => {
    routeLikeAction(item.RouteUID, item.RouteName.Zh_tw, item.DepartureStopNameZh, item.DepartureStopNameEn, item.DestinationStopNameZh, item.DestinationStopNameEn, city);
    setIsLiked(!isLiked);
  }
  return (
    <div className='route'>
      <NavLink to={calculateStopsURL({ lang, city, route: item.RouteName.Zh_tw })} className="route-link" >
        <div className="route-info" >
          <div className='route-name'> {lang === LangType.en ? (item.RouteName.En) : (item.RouteName.Zh_tw)} </div>
          <div className='route-direction'>
            {lang === LangType.en ? (`${item.DepartureStopNameEn} - ${item.DestinationStopNameEn}`) : (`${item.DepartureStopNameZh} - ${item.DestinationStopNameZh}`)}

          </div>
        </div>


      </NavLink>
      <div className="route-action" onClick={handleLikeClick}>
        <span className='save-icon' data-testid='save-icon'>
          {isLiked ?
            (<SaveSvg width="21px" height="21px" fill={IconColors.pinkFont} />) :
            (<SaveSvg width="21px" height="21px" fill='gray' />)}
        </span>
        <div className='route-city'> {getCityNameOrValue(city, lang)}</div>
      </div>
      <div className='gray-line'></div>
    </div>
  )
}