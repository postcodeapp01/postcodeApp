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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Address} from '../components/Address/address';

type Props = {
  navigation: any;
  route: {
    params?: {
      onSave: (addressData: Address) => void;
      address?: Address; // If editing / pre-filled address
      mode: 'add' | 'edit';
    };
  };
};

const AddAddressScreen: React.FC<Props> = ({navigation, route}) => {
  const isEditMode = route.params?.mode === 'edit';
  const existingAddress = route.params?.address;

  // Form state (pre-filled from existingAddress if present)
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

  const handleSaveAddress = async () => {
    // Validation
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
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={22} color="#282C3F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditMode ? 'Edit Address' : 'Add Address'}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Name */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor="#999"
          />
        </View>

        {/* Phone */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number (+91)</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter phone number"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            maxLength={10}
          />
        </View>

        {/* Address Line 1 */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Address Line 1</Text>
          <TextInput
            style={styles.input}
            value={addressLine1}
            onChangeText={setAddressLine1}
            placeholder="House/Flat/Building number"
            placeholderTextColor="#999"
          />
        </View>

        {/* Address Line 2 */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Address Line 2 (Optional)</Text>
          <TextInput
            style={styles.input}
            value={addressLine2}
            onChangeText={setAddressLine2}
            placeholder="Street/Locality/Landmark"
            placeholderTextColor="#999"
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
              placeholderTextColor="#999"
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
              placeholderTextColor="#999"
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
            placeholderTextColor="#999"
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
            placeholderTextColor="#999"
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
    </SafeAreaView>
  );
};

export default AddAddressScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    // paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    lineHeight: 20,
    letterSpacing: -0.32,
  },
  placeholder: {
    width: 40,
  },

  content: {
    flex: 1,
    paddingHorizontal: 16,
  },

  // Input Containers
  inputContainer: {
    marginTop: 24,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '47%',
  },
  label: {
    fontSize: 16,
    color: '#AAA',
    marginBottom: 15,
    lineHeight: 20,
    fontWeight: '500',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingVertical: 12,
    fontSize: 16,
    color: '#282C3F',
  },

  // Save As Section
  saveAsContainer: {
    marginTop: 32,
    marginBottom: 24,
  },
  saveAsLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
  },
  saveAsButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  saveAsButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  saveAsButtonActive: {
    backgroundColor: '#282C3F',
    borderColor: '#282C3F',
  },
  saveAsButtonText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  saveAsButtonTextActive: {
    color: '#FFFFFF',
  },

  // Default Checkbox
  defaultContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 3,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: '#FF3366',
    borderColor: '#FF3366',
  },
  defaultText: {
    fontSize: 16,
    color: '#282C3F',
  },

  bottomSpacing: {
    height: 100,
  },

  // Save Button
  saveButton: {
    backgroundColor: '#FF3366',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
