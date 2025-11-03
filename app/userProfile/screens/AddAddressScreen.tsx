import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {Address} from '../components/Address/address';
import MapPicker from '../components/Address/MapPicker';
import axiosInstance from '../../../config/Api';
import HeaderWithNoIcons from '../components/Profile/HeaderWithNoIcons';

type Props = {
  navigation: any;
  route: {
    params?: {
      onSave: (addressData: Address) => void;
      address?: Address;
      mode: 'add' | 'edit';
    };
  };
};

const AddAddressScreen: React.FC<Props> = ({navigation, route}) => {
  const isEditMode = route.params?.mode === 'edit';
  const existingAddress = route.params?.address;
  const [name, setName] = useState(existingAddress?.name || '');
  const [phone, setPhone] = useState(
    existingAddress?.phone?.replace('+91 ', '') || '',
  );
  const [pincode, setPincode] = useState(existingAddress?.pincode || '');
  const [city, setCity] = useState(existingAddress?.city || '');
  const [state, setState] = useState(existingAddress?.state || '');
  const [country, setCountry] = useState(existingAddress?.country || 'India');
  const [addressLine1, setAddressLine1] = useState(
    existingAddress?.addressLine1 || '',
  );
  const [addressLine2, setAddressLine2] = useState(
    existingAddress?.addressLine2 || '',
  );
  const [saveAsType, setSaveAsType] = useState<'home' | 'office' | 'other'>(
    (existingAddress?.label as 'home' | 'office' | 'other') || 'home',
  );
  const [makeDefault, setMakeDefault] = useState(
    existingAddress?.isDefault === 1,
  );

  // location picker state
  const [mapVisible, setMapVisible] = useState(false);
  const [selectedLatLng, setSelectedLatLng] = useState<{
    lat: number;
    lng: number;
  } | null>(
    existingAddress?.lat && existingAddress?.lng
      ? {lat: Number(existingAddress.lat), lng: Number(existingAddress.lng)}
      : null,
  );
  const [loadingGeo, setLoadingGeo] = useState(false);
  const handleConfirmLocation = async (lat: number, lng: number) => {
    setMapVisible(false);
    setSelectedLatLng({lat, lng});
    try {
      setLoadingGeo(true);
      const res = await axiosInstance.post('/googlemaps/reverse-geocode', {
        lat,
        lng,
      });
      const addr = res?.data;
      // console.log('addrsesee', addr);
      const line1 = addr.formattedAddress;
      const line2 = addr.addressLine2;
      const cityRes = addr.city;
      const stateRes = addr.state;
      const countryRes = addr.country;
      const pincodeRes = addr.pincode;

      setAddressLine1(line1 || '');
      setAddressLine2(line2 || '');
      setCity(cityRes || '');
      setState(stateRes || '');
      setCountry(countryRes || 'India');
      setPincode(pincodeRes || '');
    } catch (err) {
      console.warn('Reverse geocode failed', err);
      Alert.alert(
        'Location',
        'Could not resolve address from location. You can edit manually.',
      );
    } finally {
      setLoadingGeo(false);
    }
  };
  const handleSaveAddress = async () => {
    if (!name.trim()) return Alert.alert('Error', 'Please enter your name');
    if (!phone.trim()) return Alert.alert('Error', 'Please enter phone number');
    if (!pincode.trim()) return Alert.alert('Error', 'Please enter pincode');
    if (!city.trim()) return Alert.alert('Error', 'Please enter city');
    if (!addressLine1.trim())
      return Alert.alert('Error', 'Please enter address line 1');

    const addressData: Address = {
      id: existingAddress?.id || Date.now().toString(),
      name: name.trim(),
      phone: `+91 ${phone.trim()}`,
      pincode: pincode.trim(),
      city: city.trim(),
      state: state.trim(),
      country: country.trim(),
      addressLine1: addressLine1.trim(),
      addressLine2: addressLine2.trim(),
      label: saveAsType,
      isDefault: makeDefault ? 1 : 0,
      ...(selectedLatLng
        ? {lat: selectedLatLng.lat, lng: selectedLatLng.lng}
        : {}),
    };
    try {
      if (route.params?.onSave) {
        route.params.onSave(addressData);
      }
      navigation.goBack();
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      Alert.alert('Error', 'Failed to save address. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}

      <HeaderWithNoIcons
        title={isEditMode ? 'Edit Address' : 'Add Address'}
        onBack={() => navigation.goBack()}
      />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.locationContainer}>
          <TouchableOpacity
            style={styles.locationBtn}
            onPress={() => setMapVisible(true)}>
              <View style={styles.circleButton}>

            <Ionicons name="locate" size={18} color="#000" />
              </View>
            <Text style={styles.locationBtnText}>Use a location</Text>
          </TouchableOpacity>
        </View>

        {/* Name */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter name"
            placeholderTextColor="#AAA"
          />
        </View>

        {/* Phone */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mobile Number (+91)</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter mobile number"
            placeholderTextColor="#AAA"
            keyboardType="phone-pad"
            maxLength={10}
          />
        </View>

        {/* Address Line 1 */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>House/Flat/Building Number</Text>
          <TextInput
            style={styles.input}
            value={addressLine1}
            onChangeText={setAddressLine1}
            placeholder="Enter address"
            placeholderTextColor="#AAA"
          />
        </View>

        {/* Address Line 2 */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Street/Locality/Landmark</Text>
          <TextInput
            style={styles.input}
            value={addressLine2}
            onChangeText={setAddressLine2}
            placeholder="E.g.  near apollo"
            placeholderTextColor="#AAA"
          />
        </View>

        {/* Pincode + City */}
        <View style={styles.rowContainer}>
          <View style={[styles.inputContainer, styles.halfWidth]}>
            <Text style={styles.label}>Pincode</Text>
            <TextInput
              style={styles.input}
              value={pincode}
              onChangeText={setPincode}
              placeholder="Enter pincode"
              placeholderTextColor="#AAA"
              keyboardType="numeric"
              maxLength={6}
            />
          </View>

          <View style={[styles.inputContainer, styles.halfWidth]}>
            <Text style={styles.label}>City</Text>
            <TextInput
              style={styles.input}
              value={city}
              onChangeText={setCity}
              placeholder="Enter city"
              placeholderTextColor="#AAA"
            />
          </View>
        </View>

        {/* State */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>State</Text>
          <TextInput
            style={styles.input}
            value={state}
            onChangeText={setState}
            placeholder="Enter state"
            placeholderTextColor="#AAA"
          />
        </View>

        {/* Country */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Country</Text>
          <TextInput
            style={styles.input}
            value={country}
            onChangeText={setCountry}
            placeholder="Enter country"
            placeholderTextColor="#AAA"
          />
        </View>

        {/* Save As */}
        <View style={styles.saveAsContainer}>
          <Text style={styles.saveAsLabel}>Save As</Text>
          <View style={styles.saveAsButtons}>
            {(['home', 'office', 'other'] as const).map(type => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.saveAsButton,
                  saveAsType === type && styles.saveAsButtonActive,
                ]}
                onPress={() => setSaveAsType(type)}>
                <Text
                  style={[
                    styles.saveAsButtonText,
                    saveAsType === type && styles.saveAsButtonTextActive,
                  ]}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Default */}
        <TouchableOpacity
          style={styles.defaultContainer}
          onPress={() => setMakeDefault(!makeDefault)}>
          <View style={[styles.checkbox, makeDefault && styles.checkboxActive]}>
            {makeDefault && <Icon name="check" size={16} color="#FFFFFF" />}
          </View>
          <Text style={styles.defaultText}>Make as default address</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveAddress}>
        <Text style={styles.saveButtonText}>
          {isEditMode ? 'Update Address' : 'Save Address'}
        </Text>
      </TouchableOpacity>
      <MapPicker
        visible={mapVisible}
        initialLatitude={selectedLatLng?.lat}
        initialLongitude={selectedLatLng?.lng}
        onCancel={() => setMapVisible(false)}
        onConfirm={(lat, lng) => handleConfirmLocation(lat, lng)}
      />

      {/* loading indicator for reverse geocode */}
      {loadingGeo && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={{color: '#fff', marginTop: 8}}>Resolving address…</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default AddAddressScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  content: {
    flex: 1,
  },
  locationContainer: {
    top: 5,
    paddingHorizontal: 20,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },

  locationBtn: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
   
  },
  circleButton: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  locationBtnText: {
    fontSize: 16,
    color: '#000',
    marginLeft: 8,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  inputContainer: {
    marginTop: 25,
    marginHorizontal: 20,
    // backgroundColor: '#c3facbff',
  },
  rowContainer: {
    flexDirection: 'row',
  },
  halfWidth: {
    width: '40%',
  },
  label: {
    fontSize: 16,
    color: '#AAA',
    // marginBottom: 10,
    lineHeight: 20,
    fontWeight: '500',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#AAAAAA',
    paddingVertical: 10,
    // backgroundColor: '#8e97e5ff',` 
    fontSize: 16,
    fontWeight: '500',
    color: '#636363',
  },

  saveAsContainer: {
    marginTop: 30,
    marginBottom: 2,
    paddingHorizontal: 20,
  },
  saveAsLabel: {
    fontSize: 14,
    color: '#222222',
    marginBottom: 12,
    fontWeight: '400',
  },
  saveAsButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  saveAsButton: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  saveAsButtonActive: {
    backgroundColor: '#FF5964',
    // borderColor: '#282C3F',
  },
  saveAsButtonText: {
    fontSize: 14,
    color: '#222222',
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  saveAsButtonTextActive: {
    color: '#FFFFFF',
  },
  defaultContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 3,
    borderWidth: 2,
    borderColor: '#B1B1B1',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: '#FF5E5B',
    borderColor: '#FF5E5B',
  },
  defaultText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#222',
  },

  bottomSpacing: {
    height: 70,
  },

  saveButton: {
    backgroundColor: '#FF5E5B',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

// import React, {useState} from 'react';
// import {
//   View,
//   Text,
//   SafeAreaView,
//   TouchableOpacity,
//   StyleSheet,
//   TextInput,
//   ScrollView,
//   Alert,
//   ActivityIndicator,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import LinearGradient from 'react-native-linear-gradient';
// import {Address} from '../components/Address/address';
// import MapPicker from '../components/Address/MapPicker';
// import axiosInstance from '../../../config/Api';
// import HeaderWithNoIcons from '../components/Profile/HeaderWithNoIcons';

// type Props = {
//   navigation: any;
//   route: {
//     params?: {
//       onSave: (addressData: Address) => void;
//       address?: Address;
//       mode: 'add' | 'edit';
//     };
//   };
// };

// const AddAddressScreen: React.FC<Props> = ({navigation, route}) => {
//   const isEditMode = route.params?.mode === 'edit';
//   const existingAddress = route.params?.address;

//   const [name, setName] = useState(existingAddress?.name || '');
//   const [phone, setPhone] = useState(
//     existingAddress?.phone?.replace('+91 ', '') || '',
//   );
//   const [pincode, setPincode] = useState(existingAddress?.pincode || '');
//   const [city, setCity] = useState(existingAddress?.city || '');
//   const [state, setState] = useState(existingAddress?.state || '');
//   const [country, setCountry] = useState(existingAddress?.country || 'India');
//   const [addressLine1, setAddressLine1] = useState(
//     existingAddress?.addressLine1 || '',
//   );
//   const [addressLine2, setAddressLine2] = useState(
//     existingAddress?.addressLine2 || '',
//   );
//   const [saveAsType, setSaveAsType] = useState<'home' | 'office' | 'other'>(
//     (existingAddress?.label as 'home' | 'office' | 'other') || 'home',
//   );
//   const [makeDefault, setMakeDefault] = useState(
//     existingAddress?.isDefault === 1,
//   );

//   const [mapVisible, setMapVisible] = useState(false);
//   const [selectedLatLng, setSelectedLatLng] = useState<{
//     lat: number;
//     lng: number;
//   } | null>(
//     existingAddress?.lat && existingAddress?.lng
//       ? {lat: Number(existingAddress.lat), lng: Number(existingAddress.lng)}
//       : null,
//   );
//   const [loadingGeo, setLoadingGeo] = useState(false);

//   const handleConfirmLocation = async (lat: number, lng: number) => {
//     setMapVisible(false);
//     setSelectedLatLng({lat, lng});
//     try {
//       setLoadingGeo(true);
//       const res = await axiosInstance.post('/googlemaps/reverse-geocode', {
//         lat,
//         lng,
//       });
//       const addr = res?.data;

//       setAddressLine1(addr.formattedAddress || '');
//       setAddressLine2(addr.addressLine2 || '');
//       setCity(addr.city || '');
//       setState(addr.state || '');
//       setCountry(addr.country || 'India');
//       setPincode(addr.pincode || '');
//     } catch (err) {
//       console.warn('Reverse geocode failed', err);
//       Alert.alert(
//         'Location',
//         'Could not resolve address from location. You can edit manually.',
//       );
//     } finally {
//       setLoadingGeo(false);
//     }
//   };

//   const handleSaveAddress = async () => {
//     if (!name.trim()) return Alert.alert('Error', 'Please enter your name');
//     if (!phone.trim()) return Alert.alert('Error', 'Please enter phone number');
//     if (!pincode.trim()) return Alert.alert('Error', 'Please enter pincode');
//     if (!city.trim()) return Alert.alert('Error', 'Please enter city');
//     if (!addressLine1.trim())
//       return Alert.alert('Error', 'Please enter address line 1');

//     const addressData: Address = {
//       id: existingAddress?.id || Date.now().toString(),
//       name: name.trim(),
//       phone: `+91 ${phone.trim()}`,
//       pincode: pincode.trim(),
//       city: city.trim(),
//       state: state.trim(),
//       country: country.trim(),
//       addressLine1: addressLine1.trim(),
//       addressLine2: addressLine2.trim(),
//       label: saveAsType,
//       isDefault: makeDefault ? 1 : 0,
//       ...(selectedLatLng
//         ? {lat: selectedLatLng.lat, lng: selectedLatLng.lng}
//         : {}),
//     };

//     try {
//       if (route.params?.onSave) {
//         route.params.onSave(addressData);
//       }
//       navigation.goBack();
//     } catch (err: any) {
//       console.error(err.response?.data || err.message);
//       Alert.alert('Error', 'Failed to save address. Please try again.');
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <HeaderWithNoIcons
//         title={isEditMode ? 'Edit Address' : 'Add Address'}
//         onBack={() => navigation.goBack()}
//       />

//       <ScrollView
//         style={styles.content}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.scrollContent}>

//         {/* Location Picker Card */}
//         <View style={styles.card}>
//           <View style={styles.cardHeader}>
//             <Ionicons name="location-outline" size={22} color="#FF5964" />
//             <Text style={styles.cardHeaderText}>Location</Text>
//           </View>
//           <TouchableOpacity
//             style={styles.locationButton}
//             onPress={() => setMapVisible(true)}>
//             <LinearGradient
//               colors={['#FF5964', '#1877F2']}
//               start={{x: 0, y: 0}}
//               end={{x: 1, y: 0}}
//               style={styles.gradientButton}>
//               <Icon name="map" size={20} color="#fff" />
//               <Text style={styles.gradientButtonText}>
//                 {selectedLatLng ? 'Change Location' : 'Select Location on Map'}
//               </Text>
//             </LinearGradient>
//           </TouchableOpacity>
//           {selectedLatLng && (
//             <Text style={styles.locationInfo}>
//               📍 Lat: {selectedLatLng.lat.toFixed(4)}, Lng:{' '}
//               {selectedLatLng.lng.toFixed(4)}
//             </Text>
//           )}
//         </View>

//         {/* Personal Information Card */}
//         <View style={styles.card}>
//           <View style={styles.cardHeader}>
//             <Ionicons name="person-outline" size={22} color="#FF5964" />
//             <Text style={styles.cardHeaderText}>Personal Information</Text>
//           </View>

//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Full Name *</Text>
//             <TextInput
//               style={styles.input}
//               value={name}
//               onChangeText={setName}
//               placeholder="Enter your full name"
//               placeholderTextColor="#AAA"
//             />
//           </View>

//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Phone Number *</Text>
//             <View style={styles.phoneInput}>
//               <Text style={styles.phonePrefix}>+91</Text>
//               <TextInput
//                 style={[styles.input, styles.phoneInputField]}
//                 value={phone}
//                 onChangeText={setPhone}
//                 placeholder="Enter 10-digit number"
//                 placeholderTextColor="#AAA"
//                 keyboardType="phone-pad"
//                 maxLength={10}
//               />
//             </View>
//           </View>
//         </View>

//         {/* Address Details Card */}
//         <View style={styles.card}>
//           <View style={styles.cardHeader}>
//             <Ionicons name="home-outline" size={22} color="#FF5964" />
//             <Text style={styles.cardHeaderText}>Address Details</Text>
//           </View>

//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Address Line 1 *</Text>
//             <TextInput
//               style={styles.input}
//               value={addressLine1}
//               onChangeText={setAddressLine1}
//               placeholder="House/Flat/Building number"
//               placeholderTextColor="#AAA"
//               multiline
//             />
//           </View>

//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Address Line 2</Text>
//             <TextInput
//               style={styles.input}
//               value={addressLine2}
//               onChangeText={setAddressLine2}
//               placeholder="Street/Locality/Landmark (Optional)"
//               placeholderTextColor="#AAA"
//               multiline
//             />
//           </View>

//           <View style={styles.row}>
//             <View style={[styles.inputGroup, styles.halfWidth]}>
//               <Text style={styles.label}>Pincode *</Text>
//               <TextInput
//                 style={styles.input}
//                 value={pincode}
//                 onChangeText={setPincode}
//                 placeholder="000000"
//                 placeholderTextColor="#AAA"
//                 keyboardType="numeric"
//                 maxLength={6}
//               />
//             </View>

//             <View style={[styles.inputGroup, styles.halfWidth]}>
//               <Text style={styles.label}>City *</Text>
//               <TextInput
//                 style={styles.input}
//                 value={city}
//                 onChangeText={setCity}
//                 placeholder="City name"
//                 placeholderTextColor="#AAA"
//               />
//             </View>
//           </View>

//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>State</Text>
//             <TextInput
//               style={styles.input}
//               value={state}
//               onChangeText={setState}
//               placeholder="State name"
//               placeholderTextColor="#AAA"
//             />
//           </View>

//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Country</Text>
//             <TextInput
//               style={styles.input}
//               value={country}
//               onChangeText={setCountry}
//               placeholder="Country name"
//               placeholderTextColor="#AAA"
//             />
//           </View>
//         </View>

//         {/* Address Type Card */}
//         <View style={styles.card}>
//           <View style={styles.cardHeader}>
//             <Ionicons name="pricetag-outline" size={22} color="#FF5964" />
//             <Text style={styles.cardHeaderText}>Address Type</Text>
//           </View>

//           <View style={styles.typeButtons}>
//             {(['home', 'office', 'other'] as const).map(type => (
//               <TouchableOpacity
//                 key={type}
//                 style={[
//                   styles.typeButton,
//                   saveAsType === type && styles.typeButtonActive,
//                 ]}
//                 onPress={() => setSaveAsType(type)}>
//                 <Ionicons
//                   name={
//                     type === 'home'
//                       ? 'home'
//                       : type === 'office'
//                       ? 'briefcase'
//                       : 'location'
//                   }
//                   size={18}
//                   color={saveAsType === type ? '#fff' : '#666'}
//                 />
//                 <Text
//                   style={[
//                     styles.typeButtonText,
//                     saveAsType === type && styles.typeButtonTextActive,
//                   ]}>
//                   {type.charAt(0).toUpperCase() + type.slice(1)}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>

//           <TouchableOpacity
//             style={styles.defaultToggle}
//             onPress={() => setMakeDefault(!makeDefault)}>
//             <View
//               style={[
//                 styles.checkbox,
//                 makeDefault && styles.checkboxActive,
//               ]}>
//               {makeDefault && <Icon name="check" size={14} color="#fff" />}
//             </View>
//             <Text style={styles.defaultText}>Set as default address</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.bottomSpacing} />
//       </ScrollView>

//       {/* Save Button */}
//       <View style={styles.buttonContainer}>
//         <TouchableOpacity
//           style={styles.saveButtonWrapper}
//           onPress={handleSaveAddress}>
//           <LinearGradient
//             colors={['#FF5964', '#1877F2']}
//             start={{x: 0, y: 0}}
//             end={{x: 1, y: 0}}
//             style={styles.saveButton}>
//             <Text style={styles.saveButtonText}>
//               {isEditMode ? 'Update Address' : 'Save Address'}
//             </Text>
//           </LinearGradient>
//         </TouchableOpacity>
//       </View>

//       <MapPicker
//         visible={mapVisible}
//         initialLatitude={selectedLatLng?.lat}
//         initialLongitude={selectedLatLng?.lng}
//         onCancel={() => setMapVisible(false)}
//         onConfirm={(lat, lng) => handleConfirmLocation(lat, lng)}
//       />

//       {loadingGeo && (
//         <View style={styles.overlay}>
//           <View style={styles.overlayContent}>
//             <ActivityIndicator size="large" color="#FF5964" />
//             <Text style={styles.overlayText}>Fetching address...</Text>
//           </View>
//         </View>
//       )}
//     </SafeAreaView>
//   );
// };

// export default AddAddressScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F5F5F5',
//   },
//   content: {
//     flex: 1,
//   },
//   scrollContent: {
//     paddingHorizontal: 16,
//     paddingTop: 16,
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.08,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//     paddingBottom: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#F0F0F0',
//   },
//   cardHeaderText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#000',
//     marginLeft: 10,
//   },
//   locationButton: {
//     marginTop: 8,
//   },
//   gradientButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 14,
//     borderRadius: 12,
//   },
//   gradientButtonText: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#fff',
//     marginLeft: 8,
//   },
//   locationInfo: {
//     fontSize: 12,
//     color: '#666',
//     marginTop: 10,
//     textAlign: 'center',
//   },
//   inputGroup: {
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#666',
//     marginBottom: 8,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//     borderRadius: 10,
//     paddingHorizontal: 14,
//     paddingVertical: 12,
//     fontSize: 15,
//     color: '#000',
//     backgroundColor: '#FAFAFA',
//   },
//   phoneInput: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//     borderRadius: 10,
//     backgroundColor: '#FAFAFA',
//     paddingLeft: 14,
//   },
//   phonePrefix: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#000',
//     marginRight: 8,
//   },
//   phoneInputField: {
//     flex: 1,
//     borderWidth: 0,
//     backgroundColor: 'transparent',
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   halfWidth: {
//     width: '48%',
//   },
//   typeButtons: {
//     flexDirection: 'row',
//     gap: 10,
//     marginBottom: 16,
//   },
//   typeButton: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 12,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//     backgroundColor: '#FAFAFA',
//   },
//   typeButtonActive: {
//     backgroundColor: '#FF5964',
//     borderColor: '#FF5964',
//   },
//   typeButtonText: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#666',
//     marginLeft: 6,
//   },
//   typeButtonTextActive: {
//     color: '#fff',
//   },
//   defaultToggle: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   checkbox: {
//     width: 22,
//     height: 22,
//     borderRadius: 6,
//     borderWidth: 2,
//     borderColor: '#E0E0E0',
//     marginRight: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   checkboxActive: {
//     backgroundColor: '#16A34A',
//     borderColor: '#16A34A',
//   },
//   defaultText: {
//     fontSize: 14,
//     color: '#000',
//     fontWeight: '500',
//   },
//   bottomSpacing: {
//     height: 20,
//   },
//   buttonContainer: {
//     padding: 16,
//     backgroundColor: '#fff',
//     borderTopWidth: 1,
//     borderTopColor: '#E5E5E5',
//   },
//   saveButtonWrapper: {
//     borderRadius: 12,
//     overflow: 'hidden',
//   },
//   saveButton: {
//     paddingVertical: 16,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   saveButtonText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#fff',
//   },
//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   overlayContent: {
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: 30,
//     alignItems: 'center',
//   },
//   overlayText: {
//     marginTop: 16,
//     fontSize: 15,
//     color: '#666',
//     fontWeight: '500',
//   },
// });
