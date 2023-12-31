import { useState } from "react";
import useBusCityApi from "../../apis/useBusCityApi";
import { isRouteLiked, removeRouteByUID, saveRouteLiked } from "../../utils/localStorages/routelikes";
import SaveSvg from "../Icons/SaveSvg";
import { IconColors } from "../../utils/color";


export function RouteSaveAction({ city, routeUID, route }: { city: string, routeUID: string, route: string }) {
  const [result, fetchData] = useBusCityApi({ City: city, routeUID: routeUID, callAtInstall: false });
  const checkIsLiked = isRouteLiked(routeUID);
  const [isLiked, setIsLiked] = useState(checkIsLiked);

  const handleRouteLike = () => {
    if (isLiked) {
      removeRouteByUID(routeUID)
    } else {
      fetchData();
      if (result.records.length > 0) {
        const item = result.records[0];
        if (item.RouteUID === routeUID) {
          saveRouteLiked(item.RouteUID, item.RouteName.Zh_tw, item.DepartureStopNameZh, item.DepartureStopNameEn, item.DestinationStopNameZh, item.DestinationStopNameEn, city);
        }
      }
    }
    //TODO 短暫的視窗出現加入成功之類的訊息  {result.isLoading && (<div className='result-loading'> <div className='spinner'></div></div>)}

    setIsLiked(!isLiked)
  }


  return (
    <>
      <div className='save-icon' onClick={() => { handleRouteLike(); }} >

        {!result.isLoading && (<>  {isLiked ? (<SaveSvg width="21px" height="21px" fill={IconColors.pinkFont} />) :
          (<SaveSvg width="21px" height="21px" fill='gray' />)}</>)}

      </div >
    </>
  );
}