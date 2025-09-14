
export const calculateDistance = (lat: number,lng: number,ulat: number,ulng: number) => {
    const R = 6371e3; // metres
    const userLatitude = ulat;
    const userLongitude = ulng;
    const storeLatitude = lat;
    const storeLongitude = lng;

    const φ1 = (userLatitude * Math.PI) / 180;
    const φ2 = (storeLatitude * Math.PI) / 180;
    const Δφ = ((storeLatitude - userLatitude) * Math.PI) / 180;
    const Δλ = ((storeLongitude - userLongitude) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;

    return distance;
  };