import React, {useEffect, useMemo, useRef, useState, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StatusBar,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch} from '../../../Store';

import AddressList from '../../userProfile/components/Address/AddressList'; // updated AddressList
import {Address as TAddress} from '../../userProfile/components/Address/address';
import {
  fetchAddresses,
  selectAddresses,
} from '../../../reduxSlices/addressesSlice';

const {height: WINDOW_HEIGHT} = Dimensions.get('window');
const MODAL_HEIGHT = Math.round(WINDOW_HEIGHT * 0.8);

const LocationSelector: React.FC = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();

  const addresses = useSelector(selectAddresses);

  const defaultAddress = useMemo(
    () => addresses.find(a => a.isDefault) ?? null,
    [addresses],
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<TAddress | null>(null);

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  useEffect(() => {
    if (!selectedAddress && addresses.length > 0) {
      const pick = defaultAddress ?? addresses[0];
      setSelectedAddress({...pick, label: pick.label ?? ''});
    }
  }, [addresses, defaultAddress, selectedAddress]);

  // called by AddressList when user taps an address item
  const onAddressPress = useCallback((addr: TAddress) => {
    setSelectedAddress(addr);
    setModalVisible(false);
  }, []);

  // called to close modal before navigation to Add (so AddAddressScreen unblocks touches)
  const onStartAdd = useCallback(() => setModalVisible(false), []);
  const onStartEdit = useCallback(() => setModalVisible(false), []);

  const handleRefresh = () => dispatch(fetchAddresses());

  return (
    <View>
      <TouchableOpacity
        style={styles.selectedLocation}
        onPress={() => setModalVisible(true)}>
        <Icon name="location-sharp" size={16} color="#000" />
        <Text style={styles.locationName} numberOfLines={1}>
          {defaultAddress?.name ?? selectedAddress?.name ?? 'Select address'}
        </Text>
        <View style={styles.separator} />
        <Text style={styles.locationAddress} numberOfLines={1}>
          {defaultAddress
            ? `${defaultAddress.addressLine1}${
                defaultAddress.addressLine2
                  ? ', ' + defaultAddress.addressLine2
                  : ''
              }${defaultAddress.city ? ', ' + defaultAddress.city : ''}`
            : selectedAddress
            ? `${selectedAddress.addressLine1}${
                selectedAddress.addressLine2
                  ? ', ' + selectedAddress.addressLine2
                  : ''
              }${selectedAddress.city ? ', ' + selectedAddress.city : ''}`
            : ''}
        </Text>
        <Icon name="chevron-down" size={18} color="#AAA" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <StatusBar backgroundColor="rgba(0,0,0,0.4)" barStyle="light-content" />
        <View style={styles.modalOverlay}>
          {/* tappable background sibling */}
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={{flex: 1}} />
          </TouchableWithoutFeedback>

          {/* modal content sibling */}
          <View style={[styles.modalContainer, {height: MODAL_HEIGHT}]}>
            <Text style={styles.title}>Select a Delivery Address</Text>

            {/* Here we embed the reusable AddressList and pass the "modal hooks" */}
            <View style={{flex: 1}}>
              <AddressList
                navigation={navigation}
                onAddressPress={onAddressPress}
                onStartAdd={onStartAdd}
                onStartEdit={onStartEdit}
                hideAddButton={false} // you can set true if you want Add button outside content
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default LocationSelector;

const styles = StyleSheet.create({
  bottomBar: {
    backgroundColor: '#fff',
    height: 70,
  },
  selectedLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    padding: 16,
    lineHeight: 20,
    letterSpacing: 0.1,
    borderBottomWidth: 1,
    borderBottomColor: '#D5D5D5',
  },
  locationName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#000',
    left: 3,
  },
  separator: {
    width: 1,
    height: '80%',
    backgroundColor: '#000',
    marginHorizontal: 8,
  },
  locationAddress: {
    flex: 1,
    fontSize: 12,
    color: '#222',
    lineHeight: 20,
    letterSpacing: 0.1,
  },
});
