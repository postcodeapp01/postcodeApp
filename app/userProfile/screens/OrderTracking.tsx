// import React, {useEffect, useRef, useState} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   SafeAreaView,
//   Image,
//   ActivityIndicator,
//   TouchableOpacity,
// } from 'react-native';
// import MapView, {Marker, Polyline, AnimatedRegion} from 'react-native-maps';
// import axios from 'axios';
// import TrackingModal from '../components/MyOrders/TrackingModal';

// function decodePolyline(encoded: string) {
//   // ... same decode implementation
//   let points = [];
//   let index = 0,
//     lat = 0,
//     lng = 0;
//   while (index < encoded.length) {
//     let b,
//       shift = 0,
//       result = 0;
//     do {
//       b = encoded.charCodeAt(index++) - 63;
//       result |= (b & 0x1f) << shift;
//       shift += 5;
//     } while (b >= 0x20);
//     const dlat = result & 1 ? ~(result >> 1) : result >> 1;
//     lat += dlat;

//     shift = 0;
//     result = 0;
//     do {
//       b = encoded.charCodeAt(index++) - 63;
//       result |= (b & 0x1f) << shift;
//       shift += 5;
//     } while (b >= 0x20);
//     const dlng = result & 1 ? ~(result >> 1) : result >> 1;
//     lng += dlng;

//     points.push({
//       latitude: lat / 1e5,
//       longitude: lng / 1e5,
//     });
//   }
//   return points;
// }

// type Props = {route: {params: {order: any; storeGroup?: any}}; navigation: any};

// const GOOGLE_API_KEY = 'AIzaSyCOuiD-x5kViS8XHFnF1TB-qq39jwtYnkQ';

// const OrderTracking: React.FC<Props> = ({route}) => {
//   const {order} = route.params;
//   console.log("oreder in orderstracking",order)
//   console.log("store goups",order.storeGroups)
//   const [modalVisible, setModalVisible] = useState<boolean>(true);
//   const mapRef = useRef<MapView | null>(null);

//   const destination = {
//     latitude: parseFloat(order.shippingAddress?.lat ?? 0),
//     longitude: parseFloat(order.shippingAddress?.lng ?? 0),
//   };

//   // choose a driver origin (prefer storeGroup driver if provided)
//   const initialDriverLat = Number(
//     order.storeGroups?.[0]?.driver?.lat ??
//       order.storeGroups?.[0]?.driver?.lat ??
//       order.driver?.lat ??
//       0,
//   );
//   const initialDriverLng = Number(
//     order.storeGroups?.[0]?.driver?.lng ?? order.driver?.lng ?? 0,
//   );

//   const origin = {
//     latitude: initialDriverLat || destination.latitude || 17.385044,
//     longitude: initialDriverLng || destination.longitude || 78.486671,
//   };

//   const driverAnim = useRef(
//     new AnimatedRegion({
//       latitude: origin.latitude,
//       longitude: origin.longitude,
//       latitudeDelta: 0,
//       longitudeDelta: 0,
//     }),
//   ).current;

//   const [routeCoords, setRouteCoords] = useState<
//     {latitude: number; longitude: number}[]
//   >([]);
//   const [eta, setEta] = useState<string>('');
//   const [distance, setDistance] = useState<string>('');
//   const [orderStatus, setOrderStatus] = useState<string>(
//     order.orderStatus ?? 'processing',
//   );
//   const [loadingRoute, setLoadingRoute] = useState(true);
//   const [stepIndex, setStepIndex] = useState(0);

//   useEffect(() => {
//     (async () => {
//       try {
//         setLoadingRoute(true);
//         const resp = await axios.get(
//           'https://maps.googleapis.com/maps/api/directions/json',
//           {
//             params: {
//               origin: `${origin.latitude},${origin.longitude}`,
//               destination: `${destination.latitude},${destination.longitude}`,
//               key: GOOGLE_API_KEY,
//             },
//           },
//         );
//         const points = decodePolyline(
//           resp.data.routes[0].overview_polyline.points,
//         );
//         setRouteCoords(points);
//         const leg = resp.data.routes[0].legs[0];
//         setEta(leg.duration?.text ?? '');
//         setDistance(leg.distance?.text ?? '');
//       } catch (e) {
//         console.warn('Error fetching route:', e);
//       } finally {
//         setLoadingRoute(false);
//       }
//     })();
//   }, [
//     origin.latitude,
//     origin.longitude,
//     destination.latitude,
//     destination.longitude,
//   ]);

//   useEffect(() => {
//     if (routeCoords.length && mapRef.current) {
//       // fit map to route - include origin/destination
//       mapRef.current.fitToCoordinates([origin, destination, ...routeCoords], {
//         edgePadding: {top: 100, right: 50, bottom: 200, left: 50},
//         animated: true,
//       });
//     }
//   }, [routeCoords]);

//   // simulate driver movement (keeps your existing simulation)
//   useEffect(() => {
//     if (!routeCoords.length) return;
//     const interval = setInterval(() => {
//       setStepIndex(prev => {
//         const next = Math.min(prev + 1, routeCoords.length - 1);
//         const coord = routeCoords[next];
//         // update animated marker
//         try {
//           (driverAnim as any)
//             .timing?.({
//               latitude: coord.latitude,
//               longitude: coord.longitude,
//               duration: 2000,
//               useNativeDriver: false,
//             })
//             .start();
//         } catch (err) {
//           // fallback: set region
//           driverAnim
//             .timing?.({
//               latitude: coord.latitude,
//               longitude: coord.longitude,
//               duration: 2000,
//               useNativeDriver: false,
//             })
//             .start();
//         }
//         if (next >= routeCoords.length - 1) {
//           setOrderStatus('delivered');
//         }
//         return next;
//       });
//     }, 2500);
//     return () => clearInterval(interval);
//   }, [routeCoords]);

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.infoBar}>
//         <Text style={styles.header}>
//           {order?.metadata?.storeName ?? order.items?.[0]?.brand ?? 'Store'}
//         </Text>
//         <Text style={styles.subHeader}>Status: {orderStatus}</Text>
//         {eta && distance ? (
//           <Text style={styles.subHeader}>
//             ETA: {eta} ({distance})
//           </Text>
//         ) : null}
//       </View>

//       {loadingRoute ? (
//         <ActivityIndicator style={styles.loader} size="large" color="#000" />
//       ) : (
//         <MapView
//           ref={mapRef}
//           style={styles.map}
//           provider="google"
//           initialRegion={{
//             latitude: origin.latitude,
//             longitude: origin.longitude,
//             latitudeDelta: 0.05,
//             longitudeDelta: 0.05,
//           }}>
//           {/* Animated driver marker */}
//           <Marker.Animated coordinate={driverAnim as any}>
//             <Image
//               source={require('../../../sources/images/small_logo.png')}
//               style={styles.driverIcon}
//             />
//           </Marker.Animated>

//           {/* Destination */}
//           <Marker
//             coordinate={destination}
//             title="Delivery Address"
//             description={order.shippingAddress?.addressLine1}
//           />

//           <Polyline
//             coordinates={routeCoords}
//             strokeWidth={4}
//             strokeColor="#FF8C00"
//           />
//         </MapView>
//       )}

//       {/* Floating button to re-open the tracking modal if user closed it */}
//       {!modalVisible && (
//         <TouchableOpacity
//           style={styles.fab}
//           onPress={() => setModalVisible(true)}>
//           <Text style={styles.fabText}>Tracking details</Text>
//         </TouchableOpacity>
//       )}

//       <View style={styles.statusBox}>
//         <Text
//           style={[
//             styles.statusText,
//             orderStatus.toLowerCase() === 'delivered' && styles.delivered,
//           ]}>
//           Status: {orderStatus}
//         </Text>
//         <Text style={styles.subText}>
//           {orderStatus.toLowerCase() === 'delivered'
//             ? 'Your package has been delivered!'
//             : 'Your driver is on the way.'}
//         </Text>
//       </View>

//       <TrackingModal
//         visible={modalVisible}
//         onClose={() => setModalVisible(false)}
//         order={order}
//       />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {flex: 1},
//   infoBar: {padding: 12, backgroundColor: '#fff'},
//   header: {fontSize: 16, fontWeight: '700'},
//   subHeader: {color: '#666', marginTop: 4},
//   loader: {flex: 1, justifyContent: 'center'},
//   map: {flex: 1},
//   driverIcon: {width: 36, height: 36, resizeMode: 'contain'},
//   statusBox: {padding: 12, backgroundColor: '#fff'},
//   statusText: {fontWeight: '600'},
//   delivered: {color: '#28a745'},
//   subText: {color: '#666', marginTop: 4},
//   fab: {
//     position: 'absolute',
//     right: 16,
//     bottom: 20,
//     backgroundColor: '#FF6B6B',
//     paddingVertical: 10,
//     paddingHorizontal: 14,
//     borderRadius: 24,
//     elevation: 4,
//     zIndex: 1,
//   },
//   fabText: {color: '#fff', fontWeight: '700'},
// });

// export default OrderTracking;















// // OrderTracking.tsx
// import React, { useEffect, useRef, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   SafeAreaView,
//   Image,
//   ActivityIndicator,
//   TouchableOpacity,
//   Alert,
//   Platform,
// } from "react-native";
// import MapView, { Marker, Polyline, AnimatedRegion } from "react-native-maps";
// import { useDispatch, useSelector } from "react-redux";
// import axios from "axios";
// import { fetchOrderById, selectOrders, selectOrdersLoading } from "../../../reduxSlices/orderSlice";
// import TrackingModal from "../components/MyOrders/TrackingModal";

// /**
//  * Decode Google polyline to lat/lng array
//  */
// function decodePolyline(encoded: string) {
//   if (!encoded) return [];
//   let points: { latitude: number; longitude: number }[] = [];
//   let index = 0,
//     lat = 0,
//     lng = 0;
//   while (index < encoded.length) {
//     let b,
//       shift = 0,
//       result = 0;
//     do {
//       b = encoded.charCodeAt(index++) - 63;
//       result |= (b & 0x1f) << shift;
//       shift += 5;
//     } while (b >= 0x20);
//     const dlat = result & 1 ? ~(result >> 1) : result >> 1;
//     lat += dlat;

//     shift = 0;
//     result = 0;
//     do {
//       b = encoded.charCodeAt(index++) - 63;
//       result |= (b & 0x1f) << shift;
//       shift += 5;
//     } while (b >= 0x20);
//     const dlng = result & 1 ? ~(result >> 1) : result >> 1;
//     lng += dlng;

//     points.push({
//       latitude: lat / 1e5,
//       longitude: lng / 1e5,
//     });
//   }
//   return points;
// }

// /**
//  * Helper to safely parse numbers
//  */
// const toNum = (v: any, fallback = 0) => {
//   const n = Number(v);
//   return Number.isFinite(n) ? n : fallback;
// };

// type Props = { route: { params: { orderId: string } }; navigation: any };

// const GOOGLE_API_KEY = "AIzaSyCOuiD-x5kViS8XHFnF1TB-qq39jwtYnkQ";

// const OrderTracking: React.FC<Props> = ({ route ,navigation}) => {
//   const { orderId } = route.params;
//   const dispatch = useDispatch();
//   const orders = useSelector(selectOrders);
//   const loadingOrders = useSelector(selectOrdersLoading);

//   // route polyline & info
//   const [routeCoords, setRouteCoords] = useState<{ latitude: number; longitude: number }[]>([]);
//   const [eta, setEta] = useState<string>("");
//   const [distance, setDistance] = useState<string>("");

//   // UI / modal state
//   const [modalVisible, setModalVisible] = useState(true);
//   const [animating, setAnimating] = useState(false); // whether driver animation is running
//   const [error, setError] = useState<string | null>(null);

//   const mapRef = useRef<MapView | null>(null);
//   const driverAnim = useRef(
//     new AnimatedRegion({
//       latitude: 0,
//       longitude: 0,
//       latitudeDelta: 0,
//       longitudeDelta: 0,
//     })
//   ).current;
//   const animIndexRef = useRef(0);
//   const animTimerRef = useRef<any>(null);

//   // 1) fetch full order details into redux on mount
//   useEffect(() => {
//     (async () => {
//       try {
//         await dispatch(fetchOrderById({ orderId })).unwrap();
//       } catch (err) {
//         console.warn("fetchOrderById failed", err);
//         Alert.alert("Failed to load order details");
//         setError("Failed to load order");
//       }
//     })();
//   }, [dispatch, orderId]);

//   // 2) get order from redux (the fetchOrderById thunk should upsert it)
//   const order = orders.find((o: any) => String(o.orderId) === String(orderId));
//   console.log("order",order)
//   // show loader while order missing or fetch in progress
//   if (loadingOrders || !order) {
//     return (
//       <SafeAreaView style={styles.loaderContainer}>
//         <ActivityIndicator size="large" color="#000" />
//         {error ? <Text style={{ color: "red", marginTop: 8 }}>{error}</Text> : null}
//       </SafeAreaView>
//     );
//   }

//   // ----- derive coordinates ----- //
//   const destination = {
//     latitude: toNum(order.shippingAddress?.lat ?? order.shippingAddress?.lat, 0),
//     longitude: toNum(order.shippingAddress?.lng ?? order.shippingAddress?.lng, 0),
//   };

//   // create stores array (preserve original order)
//   const stores = Array.isArray(order.storeGroups)
//     ? order.storeGroups.map((sg: any) => ({
//         storeGroupId: String(sg.storeGroupId),
//         storeName: sg.storeName ?? null,
//         storeLat: toNum(sg.storeLat, null),
//         storeLng: toNum(sg.storeLng, null),
//         storeStatus: String(sg.storeStatus ?? "").toUpperCase(),
//       }))
//     : [];

//   // determine driver origin:
//   // prefer explicit driver coordinates from order (if present),
//   // else fallback to first store coordinate, else fallback to destination.
//   const driverFromOrder = (() => {
//     const fromOrderDriver = order.driver;
//     if (fromOrderDriver && (fromOrderDriver.lat || fromOrderDriver.lng)) {
//       return { lat: toNum(fromOrderDriver.lat, null), lng: toNum(fromOrderDriver.lng, null) };
//     }
//     // also check if any storeGroup provides driver coordinates
//     for (const sg of order.storeGroups ?? []) {
//       const d = sg.driver;
//       if (d && (d.lat || d.lng)) return { lat: toNum(d.lat, null), lng: toNum(d.lng, null) };
//     }
//     // fallback to first store
//     if (stores.length && stores[0].storeLat != null && stores[0].storeLng != null) {
//       return { lat: stores[0].storeLat, lng: stores[0].storeLng };
//     }
//     // fallback to destination
//     return { lat: destination.latitude || 0, lng: destination.longitude || 0 };
//   })();

//   const origin = { latitude: driverFromOrder.lat || 0, longitude: driverFromOrder.lng || 0 };

//   // 3) Build waypoints string for Google (store coords). Only include valid coords.
//   const waypointCoords = stores
//     .filter((s) => s.storeLat != null && s.storeLng != null)
//     .map((s) => `${s.storeLat},${s.storeLng}`);

//   // Safety: if we have more than 23 waypoints, slice (Google limit). Usually orders are small.
//   const MAX_WAYPOINTS = 23;
//   const trimmedWaypoints = waypointCoords.slice(0, MAX_WAYPOINTS);

//   // 4) Request optimized directions on mount / when order changes
//   useEffect(() => {
//     let cancelled = false;
//     (async () => {
//       try {
//         // If no stores, request direct route
//         const params: any = {
//           origin: `${origin.latitude},${origin.longitude}`,
//           destination: `${destination.latitude},${destination.longitude}`,
//           key: GOOGLE_API_KEY,
//         };

//         if (trimmedWaypoints.length > 0) {
//           // optimize waypoints for shortest route
//           params.waypoints = `optimize:true|${trimmedWaypoints.join("|")}`;
//         }

//         const resp = await axios.get("https://maps.googleapis.com/maps/api/directions/json", { params });
//         if (cancelled) return;

//         if (!resp?.data?.routes?.length) {
//           console.warn("No route returned", resp?.data);
//           setError("Unable to compute route");
//           return;
//         }

//         const route = resp.data.routes[0];
//         const overview = route.overview_polyline?.points ?? null;
//         const decoded = decodePolyline(overview);
//         setRouteCoords(decoded);

//         // compute ETA/distance by summing legs (safer for multi-waypoint)
//         const legs = route.legs ?? [];
//         const totalDuration = legs.reduce((s: number, l: any) => s + (l.duration?.value ?? 0), 0); // seconds
//         const totalDistance = legs.reduce((s: number, l: any) => s + (l.distance?.value ?? 0), 0); // meters
//         // human-friendly
//         if (totalDuration) {
//           const mins = Math.round(totalDuration / 60);
//           setEta(`${mins} min`);
//         } else setEta("");
//         if (totalDistance) {
//           const km = (totalDistance / 1000).toFixed(totalDistance >= 1000 ? 1 : 0);
//           setDistance(`${km} km`);
//         } else setDistance("");

//         // Fit map to route
//         setTimeout(() => {
//           if (mapRef.current && decoded.length) {
//             try {
//               mapRef.current.fitToCoordinates(decoded, {
//                 edgePadding: { top: 80, right: 60, bottom: 200, left: 60 },
//                 animated: true,
//               });
//             } catch (e) {
//               // ignore
//             }
//           }
//         }, 400);
//       } catch (err: any) {
//         console.warn("Directions API error", err?.response?.data ?? err?.message ?? err);
//         setError("Failed to compute route");
//       }
//     })();
//     return () => {
//       cancelled = true;
//     };
//   }, [orderId]); // recompute when order changes

//   // 5) Driver animation logic:
//   // Decide when to animate: if any store status is OUT_FOR_DELIVERY / PICKED_UP / SHIPPED etc.
//   const inTransitStatuses = new Set(["OUT_FOR_DELIVERY", "SHIPPED", "PICKED_UP", "IN_TRANSIT"]);
//   const shouldAnimate = (order.storeGroups ?? []).some((sg: any) =>
//     inTransitStatuses.has(String(sg.storeStatus ?? "").toUpperCase())
//   );

//   // initialize driver location when route coords change (place at origin or first route point)
//   useEffect(() => {
//     const start = routeCoords?.length ? routeCoords[0] : origin;
//     try {
//       driverAnim.setValue({
//         latitude: start.latitude ?? origin.latitude,
//         longitude: start.longitude ?? origin.longitude,
//         latitudeDelta: 0,
//         longitudeDelta: 0,
//       });
//     } catch (err) {
//       // ignore setValue errors on some RN versions
//     }
//   }, [routeCoords.length]);

//   // start/stop animation based on shouldAnimate and route coords
//   useEffect(() => {
//     // clear earlier
//     if (animTimerRef.current) {
//       clearInterval(animTimerRef.current);
//       animTimerRef.current = null;
//     }
//     animIndexRef.current = 0;
//     setAnimating(false);

//     if (!shouldAnimate || !routeCoords.length) {
//       return;
//     }

//     // animate along decoded polyline points
//     setAnimating(true);
//     animTimerRef.current = setInterval(() => {
//       const nextIndex = Math.min(animIndexRef.current + 1, routeCoords.length - 1);
//       const coord = routeCoords[nextIndex];
//       if (!coord) {
//         clearInterval(animTimerRef.current);
//         animTimerRef.current = null;
//         setAnimating(false);
//         return;
//       }

//       // move AnimatedRegion
//       try {
//         (driverAnim as any).timing({
//           latitude: coord.latitude,
//           longitude: coord.longitude,
//           duration: 1200,
//           useNativeDriver: false,
//         }).start();
//       } catch (err) {
//         // fallback: setValue if timing not available
//         try {
//           driverAnim.setValue({ latitude: coord.latitude, longitude: coord.longitude, latitudeDelta: 0, longitudeDelta: 0 });
//         } catch (e) {}
//       }

//       animIndexRef.current = nextIndex;
//       if (nextIndex >= routeCoords.length - 1) {
//         // reached destination
//         clearInterval(animTimerRef.current);
//         animTimerRef.current = null;
//         setAnimating(false);
//       }
//     }, 1400);

//     return () => {
//       if (animTimerRef.current) {
//         clearInterval(animTimerRef.current);
//         animTimerRef.current = null;
//       }
//     };
//   }, [shouldAnimate, routeCoords.length]);

//   // helper for store markers: small jitter so markers don't perfectly overlap
//   const jitter = (id: string | number) => {
//     let h = 0;
//     const s = String(id);
//     for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
//     return {
//       lat: ((h % 1000) / 1000000) * (h % 2 === 0 ? 1 : -1),
//       lng: (((h >> 3) % 1000) / 1000000) * (h % 3 === 0 ? 1 : -1),
//     };
//   };

//   // UI text for header status: prefer order.orderStatus
//   const headerStatus = String(order.orderStatus ?? "PENDING").toUpperCase();

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.infoBar}>
//         <Text style={styles.header}>{order?.metadata?.storeName ?? order.storeGroups?.[0]?.storeName ?? "Store"}</Text>
//         <Text style={styles.subHeader}>Status: {headerStatus}</Text>
//         {eta && distance ? <Text style={styles.subHeader}>ETA: {eta} ({distance})</Text> : null}
//       </View>

//       <MapView
//         ref={(r) => (mapRef.current = r)}
//         style={styles.map}
//         provider="google"
//         initialRegion={{
//           latitude: origin.latitude || destination.latitude || 17.385044,
//           longitude: origin.longitude || destination.longitude || 78.486671,
//           latitudeDelta: 0.1,
//           longitudeDelta: 0.1,
//         }}
//       >
//         {/* Animated driver marker */}
//         <Marker.Animated coordinate={driverAnim as any}>
//           <Image source={require("../../../sources/images/small_logo.png")} style={styles.driverIcon} />
//         </Marker.Animated>

//         {/* Destination marker */}
//         <Marker coordinate={destination} title="Delivery Address" description={order.shippingAddress?.addressLine1 ?? ""}>
//           <View style={styles.destMarker}>
//             <Text numberOfLines={1} style={styles.destLabel}>Delivery</Text>
//           </View>
//         </Marker>

//         {/* Store markers (show all) */}
//         {stores.map((s) => {
//           if (s.storeLat == null || s.storeLng == null) return null;
//           const j = jitter(s.storeGroupId);
//           return (
//             <Marker
//               key={s.storeGroupId}
//               coordinate={{ latitude: Number((s.storeLat + j.lat).toFixed(6)), longitude: Number((s.storeLng + j.lng).toFixed(6)) }}
//               title={s.storeName ?? "Store"}
//               description={s.storeName ?? ""}
//             >
//               <View style={styles.storeMarker}>
//                 <Text style={styles.storeMarkerText}>{(s.storeName || "Store").slice(0, 2).toUpperCase()}</Text>
//               </View>
//             </Marker>
//           );
//         })}

//         {/* route polyline */}
//         {routeCoords.length > 0 && <Polyline coordinates={routeCoords} strokeWidth={4} strokeColor="#FF8C00" lineJoin="round" />}

//       </MapView>

//       {/* floating open modal button */}
//       {!modalVisible && (
//         <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
//           <Text style={styles.fabText}>Tracking details</Text>
//         </TouchableOpacity>
//       )}

//       <View style={styles.statusBox}>
//         <Text style={[styles.statusText, headerStatus === "DELIVERED" && styles.delivered]}>Status: {headerStatus}</Text>
//         <Text style={styles.subText}>{headerStatus === "DELIVERED" ? "Your package has been delivered!" : "Your driver is on the way."}</Text>
//       </View>

//       <TrackingModal visible={modalVisible} onClose={() => setModalVisible(false)} order={order} navigation={navigation} />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   infoBar: { padding: 12, backgroundColor: "#fff" },
//   header: { fontSize: 16, fontWeight: "700" },
//   subHeader: { color: "#666", marginTop: 4 },
//   loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
//   map: { flex: 1 },
//   driverIcon: { width: 36, height: 36, resizeMode: "contain" },
//   statusBox: { padding: 12, backgroundColor: "#fff" },
//   statusText: { fontWeight: "600" },
//   delivered: { color: "#28a745" },
//   subText: { color: "#666", marginTop: 4 },
//   fab: {
//     position: "absolute",
//     right: 16,
//     bottom: 20,
//     backgroundColor: "#FF6B6B",
//     paddingVertical: 10,
//     paddingHorizontal: 14,
//     borderRadius: 24,
//     elevation: 4,
//     zIndex: 1,
//   },
//   fabText: { color: "#fff", fontWeight: "700" },
//   storeMarker: {
//     backgroundColor: "#fff",
//     padding: 6,
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: "#eee",
//     shadowColor: "#000",
//     shadowOpacity: 0.06,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   storeMarkerText: { fontSize: 12, fontWeight: "700", color: "#333" },
//   destMarker: {
//     backgroundColor: "#FF8C00",
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 6,
//   },
//   destLabel: { color: "#fff", fontWeight: "700" },
// });

// export default OrderTracking;




// src/screens/orders/OrderTracking.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import MapView, { Marker, Polyline, AnimatedRegion } from "react-native-maps";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useIsFocused } from "@react-navigation/native";
import TrackingModal from "../components/MyOrders/TrackingModal";
import { fetchOrderById, selectOrders, selectOrdersLoading } from "../../../reduxSlices/orderSlice";
import HeaderWithNoIcons from "../components/Profile/HeaderWithNoIcons";

/** Replace with config or env secure key in production */
const GOOGLE_API_KEY = "AIzaSyCOuiD-x5kViS8XHFnF1TB-qq39jwtYnkQ";

/** Decode encoded polyline (Google) -> array of {latitude, longitude} */
function decodePolyline(encoded: string) {
  if (!encoded) return [];
  const points: { latitude: number; longitude: number }[] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let b;
    let shift = 0;
    let result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
  }
  return points;
}

/** safe number parse */
const toNum = (v: any, fallback: number | null = null) => {
  if (v === null || v === undefined) return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

type Props = { route: { params: { orderId: string } }; navigation: any };

const OrderTracking: React.FC<Props> = ({ route, navigation }) => {
  const { orderId } = route.params;
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const loadingOrders = useSelector(selectOrdersLoading);
  const isFocused = useIsFocused();

  // UI + map state
  const [routeCoords, setRouteCoords] = useState<{ latitude: number; longitude: number }[]>([]);
  const [eta, setEta] = useState<string>("");
  const [distance, setDistance] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // animation refs
  const mapRef = useRef<MapView | null>(null);
  const driverAnim = useRef(
    new AnimatedRegion({
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0,
      longitudeDelta: 0,
    })
  ).current;
  const animIndexRef = useRef<number>(0);
  const animTimerRef = useRef<any>(null);

  // Fetch order details on mount
  useEffect(() => {
    (async () => {
      try {
        await dispatch(fetchOrderById({ orderId })).unwrap();
      } catch (err) {
        console.warn("fetchOrderById failed", err);
        Alert.alert("Failed to load order details");
        setError("Failed to load order");
      }
    })();
  }, [dispatch, orderId]);

  // Pull order from redux
  const order = orders.find((o: any) => String(o.orderId) === String(orderId));

  // Close modal whenever screen loses focus to avoid stray backdrops blocking the FAB on return
  useEffect(() => {
    if (!isFocused) {
      setModalVisible(false);
    }
  }, [isFocused]);

  // show loader while order missing or fetching
  if (loadingOrders || !order) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#000" />
        {error ? <Text style={{ color: "red", marginTop: 8 }}>{error}</Text> : null}
      </SafeAreaView>
    );
  }

  // derive destination and stores
  const destination = {
    latitude: toNum(order.shippingAddress?.lat, 0) ?? 0,
    longitude: toNum(order.shippingAddress?.lng, 0) ?? 0,
  };

  const stores = (Array.isArray(order.storeGroups) ? order.storeGroups : []).map((sg: any) => ({
    storeGroupId: String(sg.storeGroupId),
    storeName: sg.storeName ?? null,
    storeLat: toNum(sg.storeLat, null),
    storeLng: toNum(sg.storeLng, null),
    storeStatus: String(sg.storeStatus ?? "").toUpperCase(),
  }));

  // determine driver origin (order.driver -> storeGroup.driver -> first store -> destination)
  const driverFromOrder = (() => {
    if (order.driver && (order.driver.lat || order.driver.lng)) {
      return { lat: toNum(order.driver.lat, null), lng: toNum(order.driver.lng, null) };
    }
    for (const sg of order.storeGroups ?? []) {
      const d = sg.driver;
      if (d && (d.lat || d.lng)) {
        return { lat: toNum(d.lat, null), lng: toNum(d.lng, null) };
      }
    }
    if (stores.length && stores[0].storeLat != null && stores[0].storeLng != null) {
      return { lat: stores[0].storeLat!, lng: stores[0].storeLng! };
    }
    return { lat: destination.latitude || 0, lng: destination.longitude || 0 };
  })();

  const origin = { latitude: driverFromOrder.lat || 0, longitude: driverFromOrder.lng || 0 };

  // Build waypoint list (valid store coords only), apply google limit safeguard
  const waypointCoords = stores.filter((s) => s.storeLat != null && s.storeLng != null).map((s) => `${s.storeLat},${s.storeLng}`);
  const MAX_WAYPOINTS = 23;
  const trimmedWaypoints = waypointCoords.slice(0, MAX_WAYPOINTS);

  // Request optimized route (origin -> [optimized stores] -> destination)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const params: any = {
          origin: `${origin.latitude},${origin.longitude}`,
          destination: `${destination.latitude},${destination.longitude}`,
          key: GOOGLE_API_KEY,
        };
        if (trimmedWaypoints.length > 0) {
          params.waypoints = `optimize:true|${trimmedWaypoints.join("|")}`;
        }
        const resp = await axios.get("https://maps.googleapis.com/maps/api/directions/json", { params });

        if (cancelled) return;
        if (!resp?.data?.routes?.length) {
          setError("No route returned");
          return;
        }
        const route = resp.data.routes[0];
        const decoded = decodePolyline(route.overview_polyline?.points ?? "");
        setRouteCoords(decoded);

        const legs = route.legs ?? [];
        const totalDuration = legs.reduce((s: number, l: any) => s + (l.duration?.value ?? 0), 0);
        const totalDistance = legs.reduce((s: number, l: any) => s + (l.distance?.value ?? 0), 0);
        if (totalDuration) {
          const mins = Math.round(totalDuration / 60);
          setEta(`${mins} min`);
        } else setEta("");
        if (totalDistance) {
          const km = (totalDistance / 1000).toFixed(totalDistance >= 1000 ? 1 : 0);
          setDistance(`${km} km`);
        } else setDistance("");
        setTimeout(() => {
          if (mapRef.current && decoded.length) {
            try {
              mapRef.current.fitToCoordinates(decoded, {
                edgePadding: { top: 80, right: 60, bottom: 220, left: 60 },
                animated: true,
              });
            } catch (_) {}
          }
        }, 300);
      } catch (err: any) {
        console.warn("Directions API error", err?.response?.data ?? err?.message ?? err);
        setError("Failed to compute route");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  const inTransitStatuses = new Set(["OUT_FOR_DELIVERY", "SHIPPED", "PICKED_UP", "IN_TRANSIT"]);
  const shouldAnimate = (order.storeGroups ?? []).some((sg: any) => inTransitStatuses.has(String(sg.storeStatus ?? "").toUpperCase()));

  // Initialize driver marker to route start (or origin)
  useEffect(() => {
    const start = routeCoords.length ? routeCoords[0] : origin;
    try {
      driverAnim.setValue({
        latitude: start.latitude ?? origin.latitude,
        longitude: start.longitude ?? origin.longitude,
        latitudeDelta: 0,
        longitudeDelta: 0,
      });
    } catch (_) {}
  }, [routeCoords.length]);

  // Animate driver along polyline points
  useEffect(() => {
    // cleanup existing
    if (animTimerRef.current) {
      clearInterval(animTimerRef.current);
      animTimerRef.current = null;
    }
    animIndexRef.current = 0;

    if (!shouldAnimate || !routeCoords.length) {
      return;
    }

    animTimerRef.current = setInterval(() => {
      const nextIdx = Math.min(animIndexRef.current + 1, routeCoords.length - 1);
      const coord = routeCoords[nextIdx];
      if (!coord) {
        clearInterval(animTimerRef.current);
        animTimerRef.current = null;
        return;
      }
      try {
        (driverAnim as any).timing({
          latitude: coord.latitude,
          longitude: coord.longitude,
          duration: 1100,
          useNativeDriver: false,
        }).start();
      } catch (err) {
        try {
          driverAnim.setValue({ latitude: coord.latitude, longitude: coord.longitude, latitudeDelta: 0, longitudeDelta: 0 });
        } catch (_) {}
      }
      animIndexRef.current = nextIdx;
      if (nextIdx >= routeCoords.length - 1) {
        clearInterval(animTimerRef.current);
        animTimerRef.current = null;
      }
    }, 1300);

    return () => {
      if (animTimerRef.current) {
        clearInterval(animTimerRef.current);
        animTimerRef.current = null;
      }
    };
  }, [shouldAnimate, routeCoords.length]);

  // tiny deterministic jitter for store markers so they don't perfectly overlap
  const jitter = (id: string | number) => {
    let h = 0;
    const s = String(id);
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return {
      lat: ((h % 1000) / 1000000) * (h % 2 === 0 ? 1 : -1),
      lng: (((h >> 3) % 1000) / 1000000) * (h % 3 === 0 ? 1 : -1),
    };
  };

  const headerStatus = String(order.orderStatus ?? "PENDING").toUpperCase();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header bar */}
      <HeaderWithNoIcons title="Track Your Order" onBack={()=>navigation.goBack()}/>
      <View style={styles.infoBar}>
        <Text style={styles.header}>{order?.metadata?.storeName ?? order.storeGroups?.[0]?.storeName ?? "Store"}</Text>
        <Text style={styles.subHeader}>Status: {headerStatus}</Text>
        {eta && distance ? <Text style={styles.subHeader}>ETA: {eta} ({distance})</Text> : null}
      </View>

      {/* Map */}
      <MapView
        ref={(r) => (mapRef.current = r)}
        style={styles.map}
        provider="google"
        initialRegion={{
          latitude: origin.latitude || destination.latitude || 17.385044,
          longitude: origin.longitude || destination.longitude || 78.486671,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {/* Animated driver marker */}
        <Marker.Animated coordinate={driverAnim as any}>
          <Image source={require("../../../sources/images/small_logo.png")} style={styles.driverIcon} />
        </Marker.Animated>

        {/* Destination marker */}
        <Marker coordinate={destination} title="Delivery Address" description={order.shippingAddress?.addressLine1 ?? ""}>
          <View style={styles.destMarker}>
            <Text numberOfLines={1} style={styles.destLabel}>Delivery</Text>
          </View>
        </Marker>

        {/* Stores markers */}
        {stores.map((s) => {
          if (s.storeLat == null || s.storeLng == null) return null;
          const j = jitter(s.storeGroupId);
          return (
            <Marker
              key={s.storeGroupId}
              coordinate={{ latitude: Number((s.storeLat + j.lat).toFixed(6)), longitude: Number((s.storeLng + j.lng).toFixed(6)) }}
              title={s.storeName ?? "Store"}
              description={s.storeName ?? ""}
            >
              <View style={styles.storeMarker}>
                <Text style={styles.storeMarkerText}>{(s.storeName || "Store").slice(0, 2).toUpperCase()}</Text>
              </View>
            </Marker>
          );
        })}

        {/* Route polyline */}
        {routeCoords.length > 0 && <Polyline coordinates={routeCoords} strokeWidth={4} strokeColor="#FF8C00" lineJoin="round" />}
      </MapView>

      {/* FAB: only when screen is focused and modal closed (prevent overlay gotchas) */}
      {!modalVisible && isFocused && (
        <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)} activeOpacity={0.85}>
          <Text style={styles.fabText}>Tracking details</Text>
        </TouchableOpacity>
      )}

      {/* Status box */}
      <View style={styles.statusBox}>
        <Text style={[styles.statusText, headerStatus === "DELIVERED" && styles.delivered]}>Status: {headerStatus}</Text>
        <Text style={styles.subText}>{headerStatus === "DELIVERED" ? "Your package has been delivered!" : "Your driver is on the way."}</Text>
      </View>

      {/* Modal with tracking details */}
      <TrackingModal visible={modalVisible} onClose={() => setModalVisible(false)} order={order} navigation={navigation} eta={eta} distance={distance}/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  infoBar: { padding: 12, backgroundColor: "#fff" },
  header: { fontSize: 16, fontWeight: "700" },
  subHeader: { color: "#666", marginTop: 4 },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  map: { flex: 1 },
  driverIcon: { width: 36, height: 36, resizeMode: "contain" },
  statusBox: { padding: 12, backgroundColor: "#fff" },
  statusText: { fontWeight: "600" },
  delivered: { color: "#28a745" },
  subText: { color: "#666", marginTop: 4 },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 20,
    backgroundColor: "#FF6B6B",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 24,
    elevation: 14,
    zIndex: 9999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  fabText: { color: "#fff", fontWeight: "700" },

  storeMarker: {
    backgroundColor: "#fff",
    padding: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  storeMarkerText: { fontSize: 12, fontWeight: "700", color: "#333" },

  destMarker: {
    backgroundColor: "#FF8C00",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  destLabel: { color: "#fff", fontWeight: "700" },
});

export default OrderTracking;
