

import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  ActivityIndicator,
} from "react-native";
import MapView, {
  Marker,
  Polyline,
  AnimatedRegion,
  MarkerAnimated,
} from "react-native-maps";
import axios from "axios";

// decode polyline string without @mapbox
function decodePolyline(encoded: string): { latitude: number; longitude: number }[] {
  let points: { latitude: number; longitude: number }[] = [];
  let index = 0, lat = 0, lng = 0;

  while (index < encoded.length) {
    let b, shift = 0, result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = (result & 1) ? ~(result >> 1) : (result >> 1);
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = (result & 1) ? ~(result >> 1) : (result >> 1);
    lng += dlng;

    points.push({
      latitude: lat / 1e5,
      longitude: lng / 1e5,
    });
  }

  return points;
}

type Props = {
  route: { params: { orderId: string } };
  navigation: any;
};

const GOOGLE_API_KEY = "AIzaSyCOuiD-x5kViS8XHFnF1TB-qq39jwtYnkQ";

const OrderTracking: React.FC<Props> = ({ route }) => {
  const { orderId } = route.params;

  const origin = { latitude: 37.78825, longitude: -122.4324 };
  const destination = { latitude: 37.78125, longitude: -122.405 };

  const mapRef = useRef<MapView>(null);
  const driverAnim = useRef(
    new AnimatedRegion({
      latitude: origin.latitude,
      longitude: origin.longitude,
      latitudeDelta: 0,
      longitudeDelta: 0,
    })
  ).current;

  const [routeCoords, setRouteCoords] = useState<
    { latitude: number; longitude: number }[]
  >([]);
  const [eta, setEta] = useState<string>("");
  const [distance, setDistance] = useState<string>("");
  const [orderStatus, setOrderStatus] = useState<string>("En Route");
  const [loadingRoute, setLoadingRoute] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        const resp = await axios.get(
          "https://maps.googleapis.com/maps/api/directions/json",
          {
            params: {
              origin: `${origin.latitude},${origin.longitude}`,
              destination: `${destination.latitude},${destination.longitude}`,
              key: GOOGLE_API_KEY,
            },
          }
        );
        const points = decodePolyline(
          resp.data.routes[0].overview_polyline.points
        );
        setRouteCoords(points);

        const leg = resp.data.routes[0].legs[0];
        setEta(leg.duration.text);
        setDistance(leg.distance.text);
      } catch (e) {
        console.warn("Error fetching route:", e);
      } finally {
        setLoadingRoute(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (routeCoords.length && mapRef.current) {
      mapRef.current.fitToCoordinates([origin, destination], {
        edgePadding: { top: 100, right: 50, bottom: 200, left: 50 },
        animated: true,
      });
    }
  }, [routeCoords]);

  useEffect(() => {
    const ws = new WebSocket(
      `wss://api.yourshop.com/orders/${orderId}/tracking`
    );
    ws.onmessage = (evt) => {
      const { lat, lng, status } = JSON.parse(evt.data);
      setOrderStatus(status);
      driverAnim.timing({
        latitude: lat,
        longitude: lng,
        duration: 2000,
        useNativeDriver: false,
        toValue: 0,
        latitudeDelta: 0,
        longitudeDelta: 0
      }).start();
    };
    return () => ws.close();
  }, [orderId]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.infoBar}>
        <Text style={styles.header}>
          Order #{orderId} – ETA: {eta} ({distance})
        </Text>
      </View>

      {loadingRoute ? (
        <ActivityIndicator style={styles.loader} size="large" color="#000" />
      ) : (
        <MapView
          ref={mapRef}
          style={styles.map}
          provider="google"
          initialRegion={{
            latitude: origin.latitude,
            longitude: origin.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          <Marker
            coordinate={origin}
            title="Warehouse"
            image={require("../../../sources/images/small_logo.png")}
          />
          <Marker
            coordinate={destination}
            title="Your Location"
            image={require("../../../sources/images/small_logo.png")}
          />
          <MarkerAnimated coordinate={driverAnim}>
            <Image
              source={require("../../../sources/images/small_logo.png")}
              style={styles.driverIcon}
            />
          </MarkerAnimated>
          <Polyline
            coordinates={routeCoords}
            strokeWidth={4}
            strokeColor="#FF8C00"
          />
        </MapView>
      )}

      <View style={styles.statusBox}>
        <Text
          style={[
            styles.statusText,
            orderStatus === "Delivered" && styles.delivered,
          ]}
        >
          Status: {orderStatus}
        </Text>
        <Text style={styles.subText}>
          {orderStatus === "Delivered"
            ? "Your package has been delivered!"
            : "Your driver is on the way."}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default OrderTracking;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  infoBar: {
    padding: 12,
    backgroundColor: "#f8f8f8",
    borderBottomWidth: 1,
    borderColor: "#e0e0e0",
  },
  header: { fontSize: 18, fontWeight: "600", textAlign: "center" },
  loader: { position: "absolute", top: "50%", left: "50%" },
  map: { flex: 1 },
  driverIcon: { width: 40, height: 40 },
  statusBox: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fafafa",
  },
  statusText: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  subText: { fontSize: 14, color: "#666" },
  delivered: { color: "green" },
});
