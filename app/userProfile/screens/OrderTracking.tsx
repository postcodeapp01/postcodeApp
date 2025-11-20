import React, {useEffect, useRef, useState, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import MapView, {Marker, Polyline, AnimatedRegion} from 'react-native-maps';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import {useIsFocused} from '@react-navigation/native';
import TrackingModal from '../components/MyOrders/TrackingModal';
import {
  fetchOrderById,
  selectOrders,
  selectOrdersLoading,
  updateOrderStatus,
} from '../../../reduxSlices/orderSlice';
import HeaderWithNoIcons from '../components/Profile/HeaderWithNoIcons';
import {
  OrderSimulationService,
  type OrderSimulationStage,
} from '../components/MyOrders/OrderSimulationService';

const GOOGLE_API_KEY = 'AIzaSyCOuiD-x5kViS8XHFnF1TB-qq39jwtYnkQ';

function decodePolyline(encoded: string) {
  if (!encoded) return [];
  const points: {latitude: number; longitude: number}[] = [];
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

    points.push({latitude: lat / 1e5, longitude: lng / 1e5});
  }
  return points;
}

const toNum = (v: any, fallback: number | null = null): number | null => {
  if (v === null || v === undefined) return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const getStatusColor = (stage: OrderSimulationStage): string => {
  const colors: Record<OrderSimulationStage, string> = {
    PENDING: '#999',
    CONFIRMED: '#4CAF50',
    PACKED: '#2196F3',
    PICKED_UP: '#FF9800',
    IN_TRANSIT: '#F44336',
    NEAR_DELIVERY: '#E91E63',
    DELIVERED: '#4CAF50',
  };
  return colors[stage] || '#999';
};

type Props = {
  route: {params: {orderId: string}};
  navigation: any;
};

const STAGE_BACKEND_MAP: Record<OrderSimulationStage, string> = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  PACKED: 'PACKED',
  PICKED_UP: 'PICKED_UP',
  IN_TRANSIT: 'SHIPPED',
  NEAR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED',
};

const OrderTracking: React.FC<Props> = ({route, navigation}) => {
  const {orderId} = route.params;
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const loadingOrders = useSelector(selectOrdersLoading);
  const isFocused = useIsFocused();

  const [routeCoords, setRouteCoords] = useState<{latitude: number; longitude: number}[]>([]);
  const [routeDurationSeconds, setRouteDurationSeconds] = useState<number | null>(null);
  const [eta, setEta] = useState<string>('--');
  const [distance, setDistance] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [simulationStage, setSimulationStage] = useState<OrderSimulationStage>('PENDING');
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);

  const mapRef = useRef<MapView | null>(null);
  const markerRef = useRef<any>(null);
  const driverAnim = useRef(
    new AnimatedRegion({
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0,
      longitudeDelta: 0,
    }),
  ).current;
  const simulationRef = useRef<OrderSimulationService | null>(null);

  const pathAnimIntervalRef = useRef<NodeJS.Timeout | number | null>(null);
  const pathAnimStateRef = useRef({
    running: false,
    totalMs: 0,
    tickMs: 50,
    steps: 0,
    stepIndex: 0,
  });
  const pathAnimCancelRef = useRef<{cancelled: boolean}>({cancelled: false});

  useEffect(() => {
    (async () => {
      try {
        const resultAction = await (dispatch(fetchOrderById({orderId})) as any);
        if (resultAction?.error) {
          throw new Error('Failed to fetch order');
        }
      } catch (err) {
        Alert.alert('Error', 'Failed to load order details');
        setError('Failed to load order');
      }
    })();
  }, [dispatch, orderId]);

  useEffect(() => {
    if (!isFocused) setModalVisible(false);
  }, [isFocused]);

  const order = useMemo(
    () => orders.find((o: any) => String(o.orderId) === String(orderId)),
    [orders, orderId],
  );

  const {destination, stores, origin} = useMemo(() => {
    if (!order)
      return {
        destination: {latitude: 0, longitude: 0},
        stores: [],
        origin: {latitude: 0, longitude: 0},
      };

    const dest = {
      latitude: toNum(order.shippingAddress?.lat) ?? 0,
      longitude: toNum(order.shippingAddress?.lng) ?? 0,
    };

    const storesList = (Array.isArray(order.storeGroups) ? order.storeGroups : []).map((sg: any) => ({
      storeGroupId: String(sg.storeGroupId),
      storeName: sg.storeName ?? null,
      storeLat: toNum(sg.storeLat),
      storeLng: toNum(sg.storeLng),
      storeStatus: String(sg.storeStatus ?? '').toUpperCase(),
    }));

    const driverFromOrder = (() => {
      if (order.driver && (order.driver.lat || order.driver.lng))
        return {lat: toNum(order.driver.lat), lng: toNum(order.driver.lng)};
      for (const sg of order.storeGroups ?? []) {
        const d = sg.driver;
        if (d && (d.lat || d.lng)) return {lat: toNum(d.lat), lng: toNum(d.lng)};
      }
      if (storesList.length && storesList[0].storeLat != null && storesList[0].storeLng != null)
        return {lat: storesList[0].storeLat, lng: storesList[0].storeLng};
      return {lat: dest.latitude || 0, lng: dest.longitude || 0};
    })();

    return {
      destination: dest,
      stores: storesList,
      origin: {
        latitude: driverFromOrder.lat || 0,
        longitude: driverFromOrder.lng || 0,
      },
    };
  }, [order]);

  const storeLocations = useMemo(
    () =>
      stores
        .filter(s => s.storeLat != null && s.storeLng != null)
        .map(s => ({
          lat: s.storeLat!,
          lng: s.storeLng!,
          name: s.storeName || 'Store',
          storeGroupId: s.storeGroupId,
        })),
    [stores],
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (!origin.latitude || !origin.longitude) return;

        const params: any = {
          origin: `${origin.latitude},${origin.longitude}`,
          destination: `${destination.latitude},${destination.longitude}`,
          key: GOOGLE_API_KEY,
        };

        if (storeLocations.length > 0) {
          const waypoints = storeLocations.slice(0, 23).map(s => `${s.lat},${s.lng}`);
          params.waypoints = `optimize:true|${waypoints.join('|')}`;
        }

        const resp = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {params});

        if (cancelled) return;
        if (!resp?.data?.routes?.length) {
          setError('No route found');
          setRouteCoords([]);
          setRouteDurationSeconds(null);
          return;
        }

        const route = resp.data.routes[0];
        const decoded = decodePolyline(route.overview_polyline?.points ?? '');
        setRouteCoords(decoded);

        const legs = route.legs ?? [];
        const totalDistance = legs.reduce((s: number, l: any) => s + (l.distance?.value ?? 0), 0);
        const totalDuration = legs.reduce((s: number, l: any) => s + (l.duration?.value ?? 0), 0);
        setRouteDurationSeconds(totalDuration || null);

        if (totalDistance > 0) {
          const km = totalDistance / 1000;
          setDistance(`${km >= 1 ? km.toFixed(1) : km.toFixed(2)} km`);
        }
        if (totalDuration > 0) setEta(`${Math.ceil(totalDuration / 60)} min`);

        setTimeout(() => {
          if (mapRef.current && decoded.length > 0) {
            try {
              mapRef.current.fitToCoordinates(decoded, {
                edgePadding: {top: 80, right: 60, bottom: 220, left: 60},
                animated: true,
              });
            } catch {}
          }
        }, 300);
      } catch (err: any) {
        if (!cancelled) setError('Failed to get directions');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [origin.latitude, origin.longitude, destination, storeLocations]);

  useEffect(() => {
    const start = routeCoords.length > 0 ? routeCoords[0] : origin;
    try {
      driverAnim.setValue({
        latitude: start.latitude ?? origin.latitude,
        longitude: start.longitude ?? origin.longitude,
        latitudeDelta: 0,
        longitudeDelta: 0,
      });
    } catch {}
  }, [routeCoords.length, origin.latitude, origin.longitude, driverAnim]);

  const segmentDistanceMeters = (a: {latitude: number; longitude: number}, b: {latitude: number; longitude: number}) => {
    const R = 6371000;
    const φ1 = (a.latitude * Math.PI) / 180;
    const φ2 = (b.latitude * Math.PI) / 180;
    const Δφ = ((b.latitude - a.latitude) * Math.PI) / 180;
    const Δλ = ((b.longitude - a.longitude) * Math.PI) / 180;
    const sinΔφ = Math.sin(Δφ / 2);
    const sinΔλ = Math.sin(Δλ / 2);
    const aa = sinΔφ * sinΔφ + Math.cos(φ1) * Math.cos(φ2) * sinΔλ * sinΔλ;
    const c = 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa));
    return R * c;
  };

  const stopPathAnimation = () => {
    pathAnimCancelRef.current.cancelled = true;
    if (pathAnimIntervalRef.current) {
      try {
        clearInterval(pathAnimIntervalRef.current as any);
      } catch {}
      pathAnimIntervalRef.current = null;
    }
    pathAnimStateRef.current.running = false;
  };

  const startPathAnimation = async (coords: {latitude: number; longitude: number}[]) => {
    if (!coords || coords.length < 2) return;

    pathAnimCancelRef.current.cancelled = false;
    stopPathAnimation();

    const segments: {from: any; to: any; dist: number}[] = [];
    let totalMeters = 0;
    for (let i = 0; i < coords.length - 1; i++) {
      const from = coords[i];
      const to = coords[i + 1];
      const dist = segmentDistanceMeters(from, to);
      segments.push({from, to, dist});
      totalMeters += dist;
    }

    const avgSpeedMPerHour = 25000;
    let totalMs =
      routeDurationSeconds && routeDurationSeconds > 5
        ? routeDurationSeconds * 1000
        : (totalMeters / avgSpeedMPerHour) * 3600 * 1000;
    totalMs = Math.max(8000, Math.min(totalMs, 90000));

    pathAnimStateRef.current = {
      running: true,
      totalMs,
      tickMs: 50,
      steps: 0,
      stepIndex: 0,
    };

    for (let i = 0; i < segments.length; i++) {
      if (pathAnimCancelRef.current.cancelled) break;

      const seg = segments[i];
      const segDuration = Math.max(200, Math.round((seg.dist / Math.max(1, totalMeters)) * totalMs));
      const target = {latitude: seg.to.latitude, longitude: seg.to.longitude};

      try {
        if (Platform.OS === 'android') {
          if (markerRef.current && typeof markerRef.current.animateMarkerToCoordinate === 'function') {
            await new Promise<void>(resolve => {
              try {
                markerRef.current.animateMarkerToCoordinate(target, segDuration);
              } catch {
                try {
                  (driverAnim as any).timing(target, {duration: segDuration, useNativeDriver: false}).start();
                } catch {
                  (driverAnim as any).setValue(target);
                }
              }
              const t = setTimeout(() => {
                clearTimeout(t);
                resolve();
              }, segDuration + 20);
            });
          } else {
            await new Promise<void>(resolve => {
              try {
                (driverAnim as any).timing(target, {duration: segDuration, useNativeDriver: false}).start(() => resolve());
              } catch {
                try {
                  (driverAnim as any).setValue(target);
                } catch {}
                setTimeout(resolve, segDuration);
              }
            });
          }
        } else {
          await new Promise<void>(resolve => {
            try {
              (driverAnim as any).timing(target, {duration: segDuration, useNativeDriver: false}).start(() => resolve());
            } catch {
              try {
                (driverAnim as any).setValue(target);
              } catch {}
              setTimeout(resolve, segDuration);
            }
          });
        }
      } catch {}

      await new Promise(r => setTimeout(r, 10));
    }

    const last = coords[coords.length - 1];
    try {
      (driverAnim as any).setValue({
        latitude: last.latitude,
        longitude: last.longitude,
        latitudeDelta: 0,
        longitudeDelta: 0,
      });
    } catch {}
    pathAnimStateRef.current.running = false;
  };

  const simStartedRef = useRef(false);

  useEffect(() => {
    if (simStartedRef.current) return;
    if (!order) return;

    simStartedRef.current = true;
    setIsSimulationRunning(true);

    const simulation = new OrderSimulationService({
      orderId: String(orderId),
      routeCoordinates: routeCoords,
      startLat: storeLocations[0]?.lat ?? origin.latitude,
      startLng: storeLocations[0]?.lng ?? origin.longitude,
      endLat: destination.latitude,
      endLng: destination.longitude,
      storeLocations,
      onStageChange: async stage => {
        setSimulationStage(stage);
        const backendStatus = STAGE_BACKEND_MAP[stage];
        try {
          const result = await (dispatch(
            updateOrderStatus({
              orderId: String(orderId),
              status: backendStatus,
            }),
          ) as any);
          if (result?.error) {
            // silently warn or ignore; keep UI consistent
          }
        } catch {}
      },
      onLocationUpdate: (lat, lng) => {
        const currentStage = simulationRef.current?.getCurrentStage ? simulationRef.current.getCurrentStage() : null;
        if (currentStage === 'IN_TRANSIT') return;
        try {
          (driverAnim as any).setValue({
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0,
            longitudeDelta: 0,
          });
        } catch {}
      },
      onEtaUpdate: minutes => {
        if (minutes === 0) setEta('Delivered ✓');
        else if (minutes === 1) setEta('Arriving...');
        else setEta(`${minutes} min`);
      },
    });

    simulationRef.current = simulation;

    simulation.startSimulation().catch(() => {
      setIsSimulationRunning(false);
    });
  }, [order, routeCoords, storeLocations, origin, destination, dispatch, orderId, driverAnim]);

  useEffect(() => {
    return () => {
      try {
        simulationRef.current?.stopSimulation();
      } catch {}
      stopPathAnimation();
    };
  }, []);

  useEffect(() => {
    if (simulationStage !== 'IN_TRANSIT') {
      stopPathAnimation();
      return;
    }
    if (routeCoords && routeCoords.length > 1) {
      startPathAnimation(routeCoords);
    }
    return () => {
      stopPathAnimation();
    };
  }, [simulationStage, routeCoords.length]);

  if (loadingOrders || !order) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#FF6B7A" />
        <Text style={styles.loadingText}>{error || 'Loading order...'}</Text>
      </SafeAreaView>
    );
  }

  const getStatusMessage = (): string => {
    const messages: Record<OrderSimulationStage, string> = {
      PENDING: '📋 Waiting for store confirmation...',
      CONFIRMED: '✅ Store confirmed your order',
      PACKED: '📦 Items are being packed',
      PICKED_UP: '🚗 Rider picked up your order',
      IN_TRANSIT: '🚗 Rider is on the way',
      NEAR_DELIVERY: '📍 Rider is nearby',
      DELIVERED: '🎉 Order delivered successfully!',
    };
    return messages[simulationStage];
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithNoIcons title="Track Your Order" onBack={() => navigation.goBack()} />

      <MapView
        ref={r => (mapRef.current = r)}
        style={styles.map}
        provider="google"
        initialRegion={{
          latitude: origin.latitude || destination.latitude || 17.385044,
          longitude: origin.longitude || destination.longitude || 78.486671,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}>
        <Marker.Animated ref={markerRef} coordinate={driverAnim as any}>
          <View style={styles.driverMarker}>
            <Image source={require('../../../sources/images/small_logo.png')} style={styles.driverIcon} />
          </View>
        </Marker.Animated>

        {destination.latitude > 0 && (
          <Marker coordinate={destination} title="Delivery" description={order.shippingAddress?.addressLine1}>
            <View style={styles.destMarker}>
              <Text style={styles.destLabel}>📍</Text>
            </View>
          </Marker>
        )}

        {storeLocations.map((store, idx) => (
          <Marker key={store.storeGroupId} coordinate={{latitude: store.lat, longitude: store.lng}} title={store.name}>
            <View style={styles.storeMarker}>
              <Text style={styles.storeMarkerText}>{idx + 1}</Text>
            </View>
          </Marker>
        ))}

        {routeCoords.length > 0 && (
          <Polyline coordinates={routeCoords} strokeWidth={3} strokeColor="#FF8C00" lineJoin="round" />
        )}
      </MapView>

      {!modalVisible && isFocused && (
        <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)} activeOpacity={0.8}>
          <Text style={styles.fabText}>Tracking Details</Text>
        </TouchableOpacity>
      )}

      <View style={styles.statusBox}>
        <View style={styles.statusRow}>
          <View style={[styles.statusDot, {backgroundColor: getStatusColor(simulationStage)}]} />
          <View style={{flex: 1}}>
            <Text style={styles.statusTitle}>{simulationStage}</Text>
            <Text style={styles.statusMessage}>{getStatusMessage()}</Text>
          </View>
        </View>
        <View style={styles.etaRow}>
          <Text style={styles.etaLabel}>ETA: {eta}</Text>
          {distance && <Text style={styles.etaLabel}> | {distance}</Text>}
        </View>
      </View>

      <TrackingModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        orderId={orderId}
        order={order}
        simulationStage={simulationStage}
        eta={eta}
        distance={distance}
        navigation={navigation}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {marginTop: 16, fontSize: 14, color: '#666', fontWeight: '500'},
  map: {flex: 1},
  driverMarker: {justifyContent: 'center', alignItems: 'center'},
  driverIcon: {width: 40, height: 40, resizeMode: 'contain'},
  destMarker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FF8C00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  destLabel: {fontSize: 18},
  storeMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#FF6B7A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storeMarkerText: {fontSize: 14, fontWeight: '700', color: '#FF6B7A'},
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 30,
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
    zIndex: 1,
  },
  fabText: {color: '#fff', fontWeight: '700', fontSize: 12},
  statusBox: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  statusRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 8},
  statusDot: {width: 12, height: 12, borderRadius: 6, marginRight: 12},
  statusTitle: {fontSize: 16, fontWeight: '700', color: '#333'},
  statusMessage: {fontSize: 12, color: '#666', marginTop: 2},
  etaRow: {flexDirection: 'row', alignItems: 'center'},
  etaLabel: {fontSize: 13, fontWeight: '600', color: '#FF6B7A'},
  debugToggle: {
    position: 'absolute',
    left: 12,
    bottom: 80,
    backgroundColor: '#333',
    padding: 8,
    borderRadius: 8,
    zIndex: 9999,
  },
  debugPanel: {
    position: 'absolute',
    left: 12,
    top: 80,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 8,
    padding: 12,
    borderColor: '#ddd',
    borderWidth: 1,
    zIndex: 9999,
  },
  debugTitle: {fontWeight: '700', marginBottom: 8},
});

export default OrderTracking;
