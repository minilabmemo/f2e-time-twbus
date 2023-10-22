

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

export async function getUserLocation(): Promise<{ userLat: number; userLng: number } | null> {
  try {
    if ("geolocation" in navigator) {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;
      return { userLat, userLng };
    } else {

      console.error("瀏覽器不支持地理位置");
      return null;
    }
  } catch (error) {

    handleGPSError(error as GeolocationPositionError);
    return null;
  }
}
