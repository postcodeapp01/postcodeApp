import React, { useEffect, useState, useCallback } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../Store';

import AddressList from '../../userProfile/components/Address/AddressList';
import { Address as TAddress } from '../../userProfile/components/Address/address';
import {
  fetchAddresses,
  selectDefaultAddress,
} from '../../../reduxSlices/addressesSlice';

const { height: WINDOW_HEIGHT } = Dimensions.get('window');
const MODAL_HEIGHT = Math.round(WINDOW_HEIGHT * 0.8);

const LocationSelector: React.FC = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();

  const defaultAddress = useSelector(selectDefaultAddress);
  const userLocation = useSelector(
    (state: RootState) => state.user.userDetails?.location,
  );

  const [modalVisible, setModalVisible] = useState(false);
  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch, userLocation?.lat, userLocation?.lng]);
  

  const onStartAdd = useCallback(() => setModalVisible(false), []);
  const onStartEdit = useCallback(() => setModalVisible(false), []);
  const formatAddressForDisplay = (address: TAddress | null) => {
    if (!address) return '';
    const parts = [address.addressLine1, address.addressLine2, address.city].filter(Boolean);
    return parts.join(', ');
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.selectedLocation}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}>
        <Icon name="location-sharp" size={16} color="#000" />

        <Text style={styles.locationName} numberOfLines={1}>
          {defaultAddress?.name }
        </Text>

        <View style={styles.separator} />

        <Text style={styles.locationAddress} numberOfLines={1}>
          {formatAddressForDisplay(defaultAddress)}
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
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>

          <View style={[styles.modalContainer, { height: MODAL_HEIGHT }]}>
            <Text style={styles.title}>Select a Delivery Address</Text>

            <View style={{ flex: 1 }}>
              <AddressList
                navigation={navigation}
                onStartAdd={onStartAdd}
                onStartEdit={onStartEdit}
                hideAddButton={false}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  selectedLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  locationName: {
    fontSize:12,
    fontWeight: '500',
    marginHorizontal: 5,
    color:'#222222',
    letterSpacing:0.1,
    lineHeight:20,
  },
  separator: {
    width: 1,
    backgroundColor: '#000',
    height: '100%',
    marginHorizontal: 3,
  },
  locationAddress: {
    flex: 1,
    color: '#222',
    fontSize: 12,
    letterSpacing:0.1,
    lineHeight:20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  title: {
    fontWeight: '500',
    fontSize: 12,
    marginBottom: 10,
    letterSpacing:0.1,
    lineHeight:20,
  },
});

export default LocationSelector;
