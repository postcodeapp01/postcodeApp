import React, {useCallback, useEffect, useState, useMemo, useRef} from 'react';
import {View, Alert, FlatList, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import AddressCard from './AddressCard';
import {
  fetchAddresses,
  addAddress,
  updateAddress,
  deleteAddress as deleteAddressThunk,
  selectAllAddresses,
  selectDefaultAddress,
  setDefaultAddress,
} from '../../../../reduxSlices/addressesSlice';
import AddressListHeader from './AddressListHeader';
import {Address} from './address';
import AddAddressButton from './AddAddressButton';
import {AppDispatch, RootState} from '../../../../Store';
import axiosInstance from '../../../../config/Api';

type Props = {
  navigation: any;
  onAddressPress?: (addr: Address) => void; 
  onStartAdd?: () => void;
  onStartEdit?: () => void;
  hideAddButton?: boolean;
  onModalClose?: () => void;
  modal?: boolean;
};

const AddressList: React.FC<Props> = ({
  navigation,
  onAddressPress,
  onStartAdd,
  onStartEdit,
  hideAddButton,
  onModalClose,
  modal,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const addresses = useSelector(selectAllAddresses);
  const currentDefaultAddress = useSelector(selectDefaultAddress); // may be null or suggested
  const loading = useSelector((state: RootState) => state.addresses.loading);
  const userLocation = useSelector(
    (state: RootState) => state.user.userDetails?.location,
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Array<{id: string; text: string}>>(
    [],
  );
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);

  const sessionTokenRef = useRef<string>(Math.random().toString(36).slice(2));
  const acDebounceRef = useRef<number | null>(null);
  const flatListRef = useRef<FlatList<any> | null>(null);


  const savedAddresses = useMemo(
    () => addresses.filter((a) => !a.isSuggested),
    [addresses],
  );

  const effectiveDefaultId = useMemo(() => {
    if (currentDefaultAddress && !currentDefaultAddress.isSuggested) {
      return currentDefaultAddress.id;
    }
    return savedAddresses.length ? savedAddresses[0].id : null;
  }, [currentDefaultAddress, savedAddresses]);

  const orderedSavedAddresses = useMemo(() => {
    if (!effectiveDefaultId) return savedAddresses;
    const idx = savedAddresses.findIndex((a) => a.id === effectiveDefaultId);
    if (idx === -1) return savedAddresses;
    const first = savedAddresses[idx];
    const others = savedAddresses.slice(0, idx).concat(savedAddresses.slice(idx + 1));
    return [first, ...others];
  }, [savedAddresses, effectiveDefaultId]);

  const handleEdit = useCallback(
    (addr: Address) => {
      if (onStartEdit) onStartEdit();
      setTimeout(() => {
        navigation.navigate('AddAddressScreen', {
          mode: 'edit',
          address: addr,
          onSave: async (updated: Address) => {
            const payload: Address = {...addr, ...updated};
            try {
              await dispatch(updateAddress(payload)).unwrap();
              await dispatch(fetchAddresses()).unwrap();
              Alert.alert('Success', 'Address updated.');
            } catch (error) {
              console.error('Update address error:', error);
              Alert.alert('Error', 'Could not update address. Please try again.');
            }
          },
        });
      }, 150);
    },
    [navigation, dispatch, onStartEdit],
  );

  const confirmDelete = useCallback(
    (id: string) => {
      Alert.alert('Delete Address', 'Are you sure you want to delete this address?', [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteAddressThunk(id)).unwrap();
              // refresh
              await dispatch(fetchAddresses()).unwrap();
              Alert.alert('Success', 'Address deleted successfully.');
            } catch (error) {
              console.error('Delete error:', error);
              Alert.alert('Error', 'Could not delete address. Try again.');
            }
          },
        },
      ]);
    },
    [dispatch],
  );

  const handleAddressSelect = useCallback(
    (addr: Address) => {
      dispatch(setDefaultAddress(addr.id));
      if (onAddressPress) onAddressPress(addr);
    },
    [dispatch, onAddressPress],
  );
  const handleLocationSelected = useCallback(
  (locationData: Partial<Address>) => {
    if (onStartAdd) onStartAdd();
    setTimeout(() => {
      navigation.navigate('AddAddressScreen', {
        mode: 'add',
        address: { ...locationData, phone: '' },
        onSave: async (newAddress: Address) => {
          try {
            const payload = {
              ...newAddress,
              lat: locationData.lat,
              lng: locationData.lng,
              fromCurrentLocation: locationData.fromCurrentLocation ?? false,
            };

            console.log("Final Payload being sent:", payload);

            await dispatch(addAddress(payload)).unwrap();
            await dispatch(fetchAddresses()).unwrap();
          } catch (err) {
            console.error('Add address error:', err);
            Alert.alert('Error', 'Could not add address. Please try again.');
          }
        },
      });
    }, 150);
  },
  [navigation, dispatch, onStartAdd],
);

  const handleUseMyLocationPress = useCallback(async () => {
    try {
      if (!userLocation?.lat || !userLocation?.lng) {
        Alert.alert('Error', 'No user location found.');
        return;
      }
      const response = await axiosInstance.post('/googlemaps/reverse-geocode', {
        lat: userLocation.lat,
        lng: userLocation.lng,
      });

      if (response.data) {
        handleLocationSelected({
           ...response.data,
        lat: userLocation.lat,
        lng: userLocation.lng,
        fromCurrentLocation: true,
      });
      } else {
        Alert.alert('Error', 'Unable to fetch address from current location');
      }
    } catch (err) {
      console.error('Reverse geocode error:', err);
      Alert.alert('Error', 'Failed to fetch address. Please try again.');
    }
  }, [handleLocationSelected, userLocation]);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSuggestions([]);
      setSuggestionsVisible(false);
      return;
    }
    if (acDebounceRef.current) clearTimeout(acDebounceRef.current);
    acDebounceRef.current = (setTimeout(async () => {
      try {
        const location = userLocation ? {lat: userLocation.lat, lng: userLocation.lng} : undefined;
        const resp = await axiosInstance.post('/googlemaps/autocomplete', {
          input: searchQuery.trim(),
          sessionToken: sessionTokenRef.current,
          location,
        });

        const preds = resp.data?.predictions || [];
        const mapped = preds.map((p: any) => ({
          id: p.place_id || p.id || p.reference,
          text: p.description || p.text || p.name,
        }));
        setSuggestions(mapped);
        setSuggestionsVisible(true);
      } catch (err) {
        console.error('autocomplete fetch failed', err);
        setSuggestions([]);
        setSuggestionsVisible(false);
      }
    }, 300) as unknown) as number;

    return () => {
      if (acDebounceRef.current) {
        clearTimeout(acDebounceRef.current);
      }
    };
  }, [searchQuery, userLocation]);

  const onSuggestionPress = useCallback(
    async (s: {id: string; text: string}) => {
      try {
        setSuggestionsVisible(false);
        setSearchQuery(s.text);

        const resp = await axiosInstance.post('/googlemaps/place-details', {
          placeId: s.id,
          sessionToken: sessionTokenRef.current,
        });

        const data = resp.data;
        if (!data) {
          Alert.alert('Error', 'Failed to fetch place details');
          return;
        }

        const locationData: Partial<Address> = {
          name: data.name || undefined,
          addressLine1: data.addressLine1 || data.formattedAddress || '',
          addressLine2: data.addressLine2 || '',
          city: data.city || '',
          state: data.state || '',
          country: data.country || '',
          pincode: data.pincode || '',
          lat: data.lat,
          lng: data.lng,
        };

        handleLocationSelected(locationData);
      } catch (err) {
        console.error('place-details error', err);
        Alert.alert('Error', 'Unable to fetch place details. Try again.');
      } finally {
        sessionTokenRef.current = Math.random().toString(36).slice(2);
      }
    },
    [handleLocationSelected],
  );

  return (
    <View style={styles.wrapper}>
      <FlatList
        ref={(ref) => (flatListRef.current = ref)}
        data={orderedSavedAddresses}
        keyExtractor={(item) => item.id}
        refreshing={loading}
        onRefresh={() => dispatch(fetchAddresses())}
        renderItem={({item}) => (
          <AddressCard
            address={item}
            onEdit={handleEdit}
            onDelete={confirmDelete}
            onPress={() => handleAddressSelect(item)} // select on card press
            isSelected={effectiveDefaultId === item.id}
          />
        )}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
        ListHeaderComponent={
          <AddressListHeader
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            suggestions={suggestions}
            suggestionsVisible={suggestionsVisible}
            onSuggestionPress={onSuggestionPress}
            onUseMyLocationPress={handleUseMyLocationPress}
            displayAddresses={{saved: savedAddresses, all: savedAddresses}}
            currentLocationAddress={currentDefaultAddress}
            onEdit={handleEdit}
            onDelete={confirmDelete}
            onAddressSelect={handleAddressSelect}
            navigation={navigation}
            modal={modal}
            onModalClose={onModalClose}
          />
        }
        contentContainerStyle={{paddingBottom: 80, flexGrow: 1}}
        showsVerticalScrollIndicator={false}
        style={{flex: 1}}
      />

      {!hideAddButton && (
        <AddAddressButton
          onPress={() => {
            if (onStartAdd) {
              onStartAdd();
              setTimeout(() => {
                navigation.navigate('AddAddressScreen', {
                  mode: 'add',
                  onSave: async (newAddress: Address) => {
                    try {
                      await dispatch(addAddress(newAddress)).unwrap();
                      await dispatch(fetchAddresses()).unwrap();
                    } catch (err) {
                      console.error('Add address error:', err);
                      Alert.alert('Error', 'Could not add address. Try again.');
                    }
                  },
                });
              }, 150);
            } else {
              navigation.navigate('AddAddressScreen', {
                mode: 'add',
                onSave: async (newAddress: Address) => {
                  try {
                    await dispatch(addAddress(newAddress)).unwrap();
                    await dispatch(fetchAddresses()).unwrap();
                  } catch (err) {
                    console.error('Add address error:', err);
                    Alert.alert('Error', 'Could not add address. Try again.');
                  }
                },
              });
            }
          }}
        />
      )}
    </View>
  );
};

export default AddressList;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#FFF',
  },
});
