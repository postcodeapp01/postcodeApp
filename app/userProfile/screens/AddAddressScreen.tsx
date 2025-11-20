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