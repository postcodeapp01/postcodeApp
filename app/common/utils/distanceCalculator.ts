// interface Coordinates {
//   latitude: number;
//   longitude: number;
// }

// /**
//  * Calculate distance between two coordinates using Haversine formula
//  * @param point1 First coordinate point
//  * @param point2 Second coordinate point
//  * @returns Distance in kilometers
//  */
// export const calculateDistance = (point1: Coordinates, point2: Coordinates): number => {
//   const toRadians = (degrees: number) => degrees * (Math.PI / 180);
  
//   const R = 6371; // Earth's radius in kilometers
  
//   const lat1Rad = toRadians(point1.latitude);
//   const lat2Rad = toRadians(point2.latitude);
//   const deltaLat = toRadians(point2.latitude - point1.latitude);
//   const deltaLng = toRadians(point2.longitude - point1.longitude);
  
//   const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
//     Math.cos(lat1Rad) * Math.cos(lat2Rad) *
//     Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
    
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
//   return R * c;
// };

// /**
//  * Get estimated travel time based on distance
//  * @param distanceKm Distance in kilometers
//  * @returns Estimated time in minutes
//  */
// export const getEstimatedTime = (distanceKm: number): number => {
//   // Assuming average speed of 30 km/h in city traffic
//   const averageSpeedKmh = 30;
//   return Math.round((distanceKm / averageSpeedKmh) * 60);
// };

// /**
//  * Format distance for display
//  * @param distanceKm Distance in kilometers
//  * @returns Formatted distance string
//  */
// export const formatDistance = (distanceKm: number): string => {
//   if (distanceKm < 1) {
//     return `${Math.round(distanceKm * 1000)}m`;
//   }
//   return `${distanceKm.toFixed(1)}km`;
// };
type Store = {
  id: string | number;
  name: string;
  logo: string;
  distance: number;
  longitude:string;
  latitude:string;
  // add other properties as needed
};
export const calculateDistance = (store: Store,lat,lng) => {
    const R = 6371e3; // metres
    const userLatitude = lat;
    const userLongitude = lng;
    const storeLatitude = parseFloat(store.latitude);
    const storeLongitude = parseFloat(store.longitude);

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