
import { NavLink, useParams } from 'react-router-dom';
import { ActionType, Dict, LangType, URI_SEARCH_DEFAULT, URI_STOPS, itemI, keyboardRouteList } from '../../utils/const';
import { ResultErrorHint } from '../../utils/error';
import { faHeart, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { JSXElementConstructor, ReactElement, ReactFragment, ReactPortal, useEffect, useRef, useState } from 'react';
import { cityData, getCityNameOrValue } from '../../utils/cities';
import useBusApi, { BusRoute, BusRouteResult } from '../../apis/useBusCityApi';
import SaveSvg from '../../components/Icons/SaveSvg';
import { IconColors } from '../../utils/color';
import { getRoutesLiked, isRouteLiked, routeLikeAction } from '../../utils/localStorages/routelikes';



export const BusRouteSave = () => {

  const { lang = 'defaultLang' } = useParams();
  const routesLiked = getRoutesLiked();

  const RouteItem = ({ item }: { item: BusRoute }) => {
    const city = item.City
    const [isLiked, setIsLiked] = useState(isRouteLiked(item.RouteUID))
    function calculateURL({ lang, city, route }: { lang: string, city: string, route: string }) {
      return URI_STOPS.replace(':lang', lang).replace(':city', city).replace(':route', route);
    }
    return (
      <div className='route'>
        <NavLink to={calculateURL({ lang, city, route: item.RouteName.Zh_tw })} className="route-link" >
          <div className="route-info" >
            <div className='route-name'> {lang === LangType.en ? (item.RouteName.En) : (item.RouteName.Zh_tw)} </div>
            <div className='route-direction'>
              {lang === LangType.en ? (`${item.DepartureStopNameEn} - ${item.DestinationStopNameEn}`) : (`${item.DepartureStopNameZh} - ${item.DestinationStopNameZh}`)}

            </div>
          </div>


        </NavLink>
        <div className="route-action"
          onClick={() => {
            routeLikeAction(item.RouteUID, item.RouteName.Zh_tw, item.DepartureStopNameZh, item.DepartureStopNameEn, item.DestinationStopNameZh, item.DestinationStopNameEn, city);
            setIsLiked(!isLiked)
          }} >
          <span className='save-icon'>
            {isRouteLiked(item.RouteUID) ? (<SaveSvg width="21px" height="21px" fill={IconColors.pinkFont} />) :
              (<SaveSvg width="21px" height="21px" fill='gray' />)}
          </span>
          <div className='route-city'> {getCityNameOrValue(city, lang)}</div>
        </div>
        <div className='gray-line'></div>
      </div>
    )
  }


  return (
    <div className='search'>
      <section className='search-header'>
        <div className='breadcrumb'> 首頁/ 收藏路線</div>
        <div className='timetable'>{Dict.timetable[lang as keyof typeof Dict.timetable]}</div>
      </section>

      <section className='search-main'>
        <div className='sidebar'>
          <div className='result-routes-save'>
            {routesLiked.map((item, index) => (
              <div>
                <RouteItem key={index} item={item} />
              </div>

            ))}
          </div>
        </div>
        <div className='result-map'>


        </div>

      </section>

    </ div>
  );
};


