
const storage = {
  routeLikes: 'routeLikes' as 'routeLikes',
  stationLikes: 'stationLikes' as 'stationLikes',
}


export function isRouteLiked(RouteUID: string) {

  const likedRoutes = JSON.parse(localStorage.getItem(storage.routeLikes) as string) || [];
  const isLiked = likedRoutes.some((likedRoute: { RouteUID: string; }) => likedRoute.RouteUID === RouteUID);


  return isLiked;
}
export function routeLikeAction(routeUID: string) {
  const isLiked = isRouteLiked(routeUID);
  if (isLiked) {
    removeRouteByUID(routeUID)
  } else {
    saveRouteLiked(routeUID)
  }
}

function removeRouteByUID(routeUID: string) {
  const likedRoutes = JSON.parse(localStorage.getItem(storage.routeLikes) as string) || [];
  const indexToRemove = likedRoutes.findIndex((likedRoute: { RouteUID: string; }) => likedRoute.RouteUID === routeUID);
  if (indexToRemove !== -1) {
    likedRoutes.splice(indexToRemove, 1);
    localStorage.setItem(storage.routeLikes, JSON.stringify(likedRoutes));
  }
}


function saveRouteLiked(RouteUID: string) {

  const likedRoutes = JSON.parse(localStorage.getItem(storage.routeLikes) as string) || [];
  const route = {
    RouteUID: RouteUID,
    RouteName: 'your_route_name',
    // 其他属性...
  };


  if (!likedRoutes.some((likedRoute: { RouteUID: string; }) => likedRoute.RouteUID === route.RouteUID)) {
    likedRoutes.push({
      RouteUID: route.RouteUID,
      RouteName: route.RouteName,
    });
  }

  localStorage.setItem(storage.routeLikes, JSON.stringify(likedRoutes));

}