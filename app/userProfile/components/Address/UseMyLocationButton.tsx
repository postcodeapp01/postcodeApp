// // components/Address/UseMyLocationButton.tsx
// import React, {useState} from 'react';
// import {
//   TouchableOpacity,
//   Text,
//   StyleSheet,
//   Alert,
//   ActivityIndicator,
//   View,
//   Platform,
//   Linking,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import Geolocation from 'react-native-geolocation-service';
// import {request, PERMISSIONS, RESULTS, check} from 'react-native-permissions';
// import {Address} from './address';

// interface UseMyLocationButtonProps {
//   onLocationSelected: (address: Partial<Address>) => void;
//   style?: any;
//   disabled?: boolean;
//   googleMapsApiKey: string;
// }

// const UseMyLocationButton: React.FC<UseMyLocationButtonProps> = ({
//   onLocationSelected,
//   style,
//   disabled = false,
//   googleMapsApiKey,
// }) => {
//   const [loading, setLoading] = useState(false);

//   const requestLocationPermission = async (): Promise<boolean> => {
//     try {
//       const permission = Platform.select({
//         android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
//         ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
//         default: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
//       });

//       const result = await request(permission);

//       switch (result) {
//         case RESULTS.GRANTED:
//           return true;
//         case RESULTS.DENIED:
//           Alert.alert(
//             'Location Permission',
//             'Location permission is required to use this feature. Please grant permission.',
//             [
//               {text: 'Cancel', style: 'cancel'},
//               {text: 'Retry', onPress: () => requestLocationPermission()},
//             ]
//           );
//           return false;
//         case RESULTS.BLOCKED:
//           Alert.alert(
//             'Location Permission Blocked',
//             'Location permission is blocked. Please enable it in Settings.',
//             [
//               {text: 'Cancel', style: 'cancel'},
//               {text: 'Open Settings', onPress: () => Linking.openSettings()},
//             ]
//           );
//           return false;
//         default:
//           return false;
//       }
//     } catch (error) {
//       console.error('Permission request error:', error);
//       return false;
//     }
//   };

//   const getCurrentPosition = (): Promise<{lat: number; lng: number}> => {
//     return new Promise((resolve, reject) => {
//       Geolocation.getCurrentPosition(
//         position => {
//           resolve({
//             lat: position.coords.latitude,
//             lng: position.coords.longitude,
//           });
//         },
//         error => {
//           console.error('Location error:', error);
//           reject(error);
//         },
//         {
//           enableHighAccuracy: true,
//           timeout: 15000,
//           maximumAge: 10000,
//         }
//       );
//     });
//   };

//   const reverseGeocode = async (lat: number, lng: number): Promise<Partial<Address>> => {
//     try {
//       const response = await fetch(
//         `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${googleMapsApiKey}`
//       );

//       const data = await response.json();

//       if (data.status !== 'OK' || !data.results.length) {
//         throw new Error('Unable to fetch address details');
//       }

//       const result = data.results[0];
//       const addressComponents = result.address_components;

//       // Extract address components
//       let addressLine1 = '';
//       let addressLine2 = '';
//       let city = '';
//       let state = '';
//       let country = '';
//       let pincode = '';

//       addressComponents.forEach((component: any) => {
//         const types = component.types;
        
//         if (types.includes('street_number')) {
//           addressLine1 = component.long_name + ' ';
//         } else if (types.includes('route')) {
//           addressLine1 += component.long_name;
//         } else if (types.includes('sublocality') || types.includes('neighborhood')) {
//           addressLine2 = component.long_name;
//         } else if (types.includes('locality')) {
//           city = component.long_name;
//         } else if (types.includes('administrative_area_level_1')) {
//           state = component.long_name;
//         } else if (types.includes('country')) {
//           country = component.long_name;
//         } else if (types.includes('postal_code')) {
//           pincode = component.long_name;
//         }
//       });

//       return {
//         name: 'My Location',
//         addressLine1: addressLine1.trim() || result.formatted_address,
//         addressLine2,
//         city,
//         state,
//         country,
//         pincode,
//         lat,
//         lng,
//       };
//     } catch (error) {
//       console.error('Reverse geocoding error:', error);
//       throw error;
//     }
//   };

//   const handleUseMyLocation = async () => {
//     if (disabled || loading) return;

//     setLoading(true);

//     try {
//       // Request location permission
//       const hasPermission = await requestLocationPermission();
//       if (!hasPermission) {
//         setLoading(false);
//         return;
//       }

//       // Get current position
//       const position = await getCurrentPosition();

//       // Reverse geocode to get address
//       const addressData = await reverseGeocode(position.lat, position.lng);

//       onLocationSelected(addressData);
//     } catch (error: any) {
//       console.error('Use my location error:', error);
      
//       let errorMessage = 'Unable to get your location. ';
      
//       if (error.code === 1) {
//         errorMessage += 'Location permission denied.';
//       } else if (error.code === 2) {
//         errorMessage += 'Location not available.';
//       } else if (error.code === 3) {
//         errorMessage += 'Location request timed out.';
//       } else {
//         errorMessage += 'Please try again.';
//       }

//       Alert.alert('Location Error', errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <TouchableOpacity
//       style={[styles.button, style, disabled && styles.disabled]}
//       onPress={handleUseMyLocation}
//       disabled={disabled || loading}>
//       <View style={styles.content}>
//         {loading ? (
//           <ActivityIndicator size="small" color="#007AFF" />
//         ) : (
//           <Icon name="location" size={18} color="#007AFF" />
//         )}
//         <Text style={[styles.text, disabled && styles.disabledText]}>
//           {loading ? 'Getting location...' : 'Use My Location'}
//         </Text>
//       </View>
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   button: {
//     backgroundColor: '#F0F8FF',
//     borderRadius: 8,
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     marginHorizontal: 16,
//     marginVertical: 8,
//     borderWidth: 1,
//     borderColor: '#007AFF',
//   },
//   disabled: {
//     backgroundColor: '#F5F5F5',
//     borderColor: '#CCC',
//   },
//   content: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   text: {
//     marginLeft: 8,
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#007AFF',
//   },
//   disabledText: {
//     color: '#999',
//   },
// });

// export default UseMyLocationButton;
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

type Props = {
  onPress: () => void;
};

const UseMyLocationButton: React.FC<Props> = ({ onPress }) => {
  return (
    <View style={styles.outer}>
      <TouchableOpacity onPress={onPress} style={styles.button}>
        <Text style={styles.buttonText}>Use My Location</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UseMyLocationButton;

const styles = StyleSheet.create({
  outer: {
    paddingHorizontal: 16,
    marginTop: 12,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007BFF',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
