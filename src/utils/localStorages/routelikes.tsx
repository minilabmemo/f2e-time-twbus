import { BusRoute } from "../../apis/useBusCityApi";

const storage = {
  routeLikes: 'routeLikes' as 'routeLikes',
  stationLikes: 'stationLikes' as 'stationLikes',
}


export function isRouteLiked(RouteUID: string) {

  const likedRoutes = JSON.parse(localStorage.getItem(storage.routeLikes) as string) || [];
  const isLiked = likedRoutes.some((likedRoute: { RouteUID: string; }) => likedRoute.RouteUID === RouteUID);


  return isLiked;
}


export function routeLikeAction(routeUID: string,
  routeName: string, startNameZh: string, startNameEn: string, endNameZh: string, endNameEn: string, city: string) {
  const isLiked = isRouteLiked(routeUID);
  if (isLiked) {
    removeRouteByUID(routeUID)
  } else {
    saveRouteLiked(routeUID, routeName, startNameZh, startNameEn, endNameZh, endNameEn, city)
  }
}

export function removeRouteByUID(routeUID: string) {
  const likedRoutes = JSON.parse(localStorage.getItem(storage.routeLikes) as string) || [];
  const indexToRemove = likedRoutes.findIndex((likedRoute: { RouteUID: string; }) => likedRoute.RouteUID === routeUID);
  if (indexToRemove !== -1) {
    likedRoutes.splice(indexToRemove, 1);
    localStorage.setItem(storage.routeLikes, JSON.stringify(likedRoutes));
  }
}


export function saveRouteLiked(routeUID: string,
  routeName: string, startNameZh: string, startNameEn: string, endNameZh: string, endNameEn: string, city: string) {

  const likedRoutes = JSON.parse(localStorage.getItem(storage.routeLikes) as string) || [];

  if (!likedRoutes.some((likedRoute: { RouteUID: string; }) => likedRoute.RouteUID === routeUID)) {
    likedRoutes.push({
      RouteUID: routeUID,
      RouteName: routeName,
      DepartureStopNameZh: startNameZh,
      DepartureStopNameEn: startNameEn,
      DestinationStopNameZh: endNameZh,
      DestinationStopNameEn: endNameEn,
      City: city,
    });
  }

  localStorage.setItem(storage.routeLikes, JSON.stringify(likedRoutes));

}
export function getRoutesLiked(): BusRoute[] {
  const likedRoutes = JSON.parse(localStorage.getItem(storage.routeLikes) as string) || [];
  const returnlikedRoutes: BusRoute[] = [];

  likedRoutes.map((item: { RouteUID: string; RouteID: string; RouteName: string; DepartureStopNameZh: any; DepartureStopNameEn: any; DestinationStopNameZh: any; DestinationStopNameEn: any; City: any; }) => {
    returnlikedRoutes.push({
      RouteUID: item.RouteUID,
      RouteID: item.RouteID,
      RouteName: { Zh_tw: item.RouteName, En: "" },
      DepartureStopNameZh: item.DepartureStopNameZh,
      DepartureStopNameEn: item.DepartureStopNameEn,
      DestinationStopNameZh: item.DestinationStopNameZh,
      DestinationStopNameEn: item.DestinationStopNameEn,
      City: item.City,
    });
  });

  return returnlikedRoutes;
}
