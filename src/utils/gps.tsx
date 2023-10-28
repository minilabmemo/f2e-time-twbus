

export function handleGPSError(error: GeolocationPositionError) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      console.error("使用者拒絕了地理位置請求");

      break;
    case error.POSITION_UNAVAILABLE:
      console.error("無法獲取使用者的地理位置");
      break;
    case error.TIMEOUT:
      console.error("獲取地理位置超時");
      break;
    default:
      console.error("發生未知錯誤");
  }
}
//TODO watch 是否要加上更新定位
export async function getUserLocation(): Promise<{ userLat: number; userLng: number } | null> {
  return new Promise((resolve, reject) => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          resolve({ userLat, userLng });
        },
        (error) => {
          handleGPSError(error as GeolocationPositionError);
          resolve(null);
        }
      );
    } else {
      console.error("瀏覽器不支持地理位置");
      resolve(null);
    }
  });
}
