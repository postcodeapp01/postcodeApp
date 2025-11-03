// MapPicker.tsx
import React, {useEffect, useState} from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import MapView, {Marker, Region} from 'react-native-maps';

type Props = {
  visible: boolean;
  initialLatitude?: number;
  initialLongitude?: number;
  onCancel: () => void;
  onConfirm: (lat: number, lng: number) => void;
};

const DEFAULT_COORDS = {latitude: 17.385044, longitude: 78.486671}; // Hyderabad center fallback

const MapPicker: React.FC<Props> = ({
  visible,
  initialLatitude,
  initialLongitude,
  onCancel,
  onConfirm,
}) => {
  const [region, setRegion] = useState<Region>({
    latitude: initialLatitude ?? DEFAULT_COORDS.latitude,
    longitude: initialLongitude ?? DEFAULT_COORDS.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const [markerCoord, setMarkerCoord] = useState({
    latitude: region.latitude,
    longitude: region.longitude,
  });


  useEffect(() => {
    if (initialLatitude && initialLongitude) {
      const r = {
        latitude: initialLatitude,
        longitude: initialLongitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setRegion(r);
      setMarkerCoord({latitude: r.latitude, longitude: r.longitude});
    }
  }, [initialLatitude, initialLongitude, visible]);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onCancel}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Pick location</Text>
        </View>

        <View style={styles.mapWrap}>
          <MapView
            style={styles.map}
            initialRegion={region}
            region={region}
            onRegionChangeComplete={r => {
              setRegion(r);
              // keep marker centered on map center (optional)
              setMarkerCoord({latitude: r.latitude, longitude: r.longitude});
            }}
            showsUserLocation
            showsMyLocationButton={false}>
            <Marker
              coordinate={markerCoord}
              draggable
              onDragEnd={e => {
                const {latitude, longitude} = e.nativeEvent.coordinate;
                setMarkerCoord({latitude, longitude});
              }}
            />
          </MapView>

          <View style={styles.crosshair}>
            <Text style={styles.crosshairText}>+</Text>
          </View>
        </View>

        <View style={styles.controls}>
          <View style={styles.btnRow}>
            <TouchableOpacity
              style={[styles.btn, styles.btnCancel]}
              onPress={onCancel}>
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.btnConfirm]}
              onPress={() =>
                onConfirm(markerCoord.latitude, markerCoord.longitude)
              }>
              <Text style={styles.btnText}>Confirm location</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default MapPicker;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  header: {padding: 16, borderBottomWidth: 1, borderColor: '#eee'},
  title: {fontSize: 18, fontWeight: '600'},
  mapWrap: {flex: 1, position: 'relative'},
  map: {...StyleSheet.absoluteFillObject},
  crosshair: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -12,
    marginTop: -12,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  crosshairText: {fontSize: 18, color: '#333', fontWeight: '700'},
  controls: {padding: 12},
  smallBtn: {
    alignSelf: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    marginBottom: 12,
  },
  smallBtnText: {color: '#fff', fontWeight: '600'},
  btnRow: {flexDirection: 'row', justifyContent: 'space-between'},
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  btnCancel: {backgroundColor: '#e2e8f0'},
  btnConfirm: {backgroundColor: '#10b981'},
  btnText: {color: '#fff', fontWeight: '600'},
});
