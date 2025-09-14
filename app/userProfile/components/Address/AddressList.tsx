import React, {useCallback, useEffect, useState, useMemo, useRef} from 'react';
import {View, Alert, FlatList, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import AddressCard from './AddressCard';
import {
  fetchAddresses,
  addAddress,
  updateAddress,
  deleteAddress as deleteAddressThunk,
  markDefault,
  selectAddresses,
  selectAddressesLoading,
  selectMarkingDefault,
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
};

const AddressList: React.FC<Props> = ({
  navigation,
  onAddressPress,
  onStartAdd,
  onStartEdit,
  hideAddButton,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const addresses = useSelector(selectAddresses);
  const loading = useSelector(selectAddressesLoading);
  const markingDefault = useSelector(selectMarkingDefault);
  const userLocation = useSelector(
    (state: RootState) => state.user.userDetails.location,
  );
  console.log("in the address list logging user location",userLocation)
  // parent-controlled searchQuery (AddressSearchBar is expected to debounce internally)
  const [searchQuery, setSearchQuery] = useState('');

  // suggestions overlay states
  const [suggestions, setSuggestions] = useState<
    Array<{id: string; text: string}>
  >([]);
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);
  const sessionTokenRef = useRef<string>(() =>
    Math.random().toString(36).slice(2),
  );
  const acDebounceRef = useRef<number | null>(null);

  const [selectedSuggestionId, setSelectedSuggestionId] = useState<
    string | null
  >(null);

  // flatlist ref for scrolling
  const flatListRef = useRef<FlatList<any> | null>(null);

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  // DISPLAY: Always show default + all addresses (do NOT filter while typing)
  const displayAddresses = useMemo(() => {
    const defaultAddr = addresses.find(a => a.isDefault) || null;
    const otherAddrs = addresses.filter(a => !a.isDefault);
    return {
      default: defaultAddr,
      others: otherAddrs,
    };
  }, [addresses]);

  const handleEdit = useCallback(
    (addr: Address) => {
      // If parent wants to close modal before navigating, call it:
      if (onStartEdit) {
        onStartEdit();
        // small delay so modal has time to close cleanly
        setTimeout(() => {
          navigation.navigate('AddAddressScreen', {
            mode: 'edit',
            address: addr,
            onSave: async (updated: Address) => {
              // 1) merge so fields not present in the edit form are preserved
              const payload: Address = {
                ...addr, // existing values, including isDefault
                ...updated, // edited values override existing
              };

              // 2) ensure isDefault is explicit boolean (preserve original if undefined)
              if (typeof payload.isDefault === 'undefined') {
                payload.isDefault = Boolean(addr.isDefault);
              }

              try {
                // 3) update backend
                const result = await dispatch(updateAddress(payload)).unwrap();
                // result hopefully contains the updated address — fall back to payload if not
                const updatedItem: Address =
                  result && typeof result === 'object'
                    ? (result as Address)
                    : payload;

                // 4) If the address was originally default but update made it non-default,
                //    re-assert it via markDefault (some backends require a separate call).
                if (
                  Boolean(addr.isDefault) &&
                  !Boolean(updatedItem.isDefault)
                ) {
                  try {
                    await dispatch(markDefault(payload.id)).unwrap();
                  } catch (markErr) {
                    console.warn('markDefault after update failed', markErr);
                    // continue — we'll still fetch to sync
                  }
                }

                // 5) refresh list from server to ensure frontend matches backend (server may enforce single-default)
                try {
                  await dispatch(fetchAddresses()).unwrap();
                } catch (fetchErr) {
                  // store reducers may still update via the thunks; ignore fetch failure but log
                  console.warn('fetchAddresses after update failed', fetchErr);
                }

                Alert.alert('Success', 'Address updated.');
              } catch (error) {
                console.error('Update address error:', error);
                Alert.alert(
                  'Error',
                  'Could not update address. Please try again.',
                );
              }
            },
          });
        }, 150);
      } else {
        // original behavior if parent didn't provide onStartEdit:
        navigation.navigate('AddAddressScreen', {
          mode: 'edit',
          address: addr,
          onSave: async (updated: Address) => {
            const payload: Address = {
              ...addr,
              ...updated,
            };
            if (typeof payload.isDefault === 'undefined') {
              payload.isDefault = Boolean(addr.isDefault);
            }
            try {
              const result = await dispatch(updateAddress(payload)).unwrap();
              const updatedItem: Address =
                result && typeof result === 'object'
                  ? (result as Address)
                  : payload;
              if (Boolean(addr.isDefault) && !Boolean(updatedItem.isDefault)) {
                try {
                  await dispatch(markDefault(payload.id)).unwrap();
                } catch (markErr) {
                  console.warn('markDefault after update failed', markErr);
                }
              }
              try {
                await dispatch(fetchAddresses()).unwrap();
              } catch (fetchErr) {
                console.warn('fetchAddresses after update failed', fetchErr);
              }
              Alert.alert('Success', 'Address updated.');
            } catch (error) {
              console.error('Update address error:', error);
              Alert.alert(
                'Error',
                'Could not update address. Please try again.',
              );
            }
          },
        });
      }
    },
    [navigation, dispatch, onStartEdit],
  );

  const confirmDelete = useCallback(
    (id: string) => {
      Alert.alert(
        'Delete Address',
        'Are you sure you want to delete this address?',
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              try {
                await dispatch(deleteAddressThunk(id)).unwrap();
                // refresh to keep UI consistent
                try {
                  await dispatch(fetchAddresses()).unwrap();
                } catch {
                  /* ignore */
                }
                Alert.alert('Success', 'Address deleted successfully.');
              } catch (error) {
                console.error('Delete error:', error);
                Alert.alert('Error', 'Could not delete address. Try again.');
              }
            },
          },
        ],
      );
    },
    [dispatch],
  );

  const handleMarkDefault = useCallback(
    async (id: string) => {
      if (markingDefault) return;
      try {
        await dispatch(markDefault(id)).unwrap();
        // refresh to reflect change
        try {
          await dispatch(fetchAddresses()).unwrap();
        } catch {
          /* ignore */
        }
      } catch (error) {
        console.error('Mark default error:', error);
        Alert.alert('Error', 'Could not set default address. Try again.');
      }
    },
    [dispatch, markingDefault],
  );

  const handleLocationSelected = useCallback(
    (locationData: Partial<Address>) => {
      if (onStartAdd) {
        // if parent wants to close modal before navigation
        onStartAdd();
        setTimeout(() => {
          navigation.navigate('AddAddressScreen', {
            mode: 'add',
            address: {
              ...locationData,
              phone: '',
            },
            onSave: async (newAddress: Address) => {
              try {
                await dispatch(addAddress(newAddress)).unwrap();
                try {
                  await dispatch(fetchAddresses()).unwrap();
                } catch {
                  /* ignore */
                }
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
          address: {
            ...locationData,
            phone: '',
          },
          onSave: async (newAddress: Address) => {
            try {
              await dispatch(addAddress(newAddress)).unwrap();
              try {
                await dispatch(fetchAddresses()).unwrap();
              } catch {
                /* ignore */
              }
            } catch (err) {
              console.error('Add address error:', err);
              Alert.alert('Error', 'Could not add address. Try again.');
            }
          },
        });
      }
    },
    [navigation, dispatch, onStartAdd],
  );

  const handleUseMyLocationPress = useCallback(async () => {
    try {
      const {lat,lng} = userLocation;
      // console.log("lat and lon in reverse coding",lat,lng);
      const address = await axiosInstance.post('/googlemaps/reverse-geocode', {
        lat,
        lng,
      });
      // console.log("address from reverse geo coding",address.data)
      if (address) {
        handleLocationSelected(address.data);
      } else {
        Alert.alert('Error', 'Unable to fetch address from current location');
      }
    } catch (err) {
      console.error('Reverse geocode error:', err);
      Alert.alert('Error', 'Failed to fetch address. Please try again.');
    }
  }, [handleLocationSelected]);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  

 

  // fetch suggestions when searchQuery changes (debounced)
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSuggestions([]);
      setSuggestionsVisible(false);
      return;
    }
    if (acDebounceRef.current) clearTimeout(acDebounceRef.current);
    acDebounceRef.current = window.setTimeout(async () => {
      try {
        const location = userLocation
          ? {lat: userLocation.latitude, lng: userLocation.longitude}
          : undefined;
        const resp = await axiosInstance.post('/googlemaps/autocomplete', {
          input: searchQuery.trim(),
          sessionToken: sessionTokenRef.current,
          location,
          // optionally: radius: 50000, components: 'country:in'
        });

        const preds = resp.data?.predictions || [];
        console.log("Autocomplete",preds)
        const mapped = preds.map((p: any) => ({
          id: p.id || p.place_id,
          text: p.text || p.description,
        }));
        setSuggestions(mapped);
        setSuggestionsVisible(true);
      } catch (err) {
        console.error('autocomplete fetch failed', err);
        setSuggestions([]); 
        setSuggestionsVisible(false);
      }
    }, 300); 
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
        setSearchQuery(s.text); // show chosen text in searchbar (optional)

        const resp = await axiosInstance.post('/googlemaps/place-details', {
          placeId: s.id,
          sessionToken: sessionTokenRef.current,
        });

        const data = resp.data;
        if (!data) {
          Alert.alert('Error', 'Failed to fetch place details');
          return;
        }

        // Build partial Address object expected by handleLocationSelected
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

        // send to the existing flow
        handleLocationSelected(locationData);
      } catch (err) {
        console.error('place-details error', err);
        Alert.alert('Error', 'Unable to fetch place details. Try again.');
      } finally {
        // new search session next time
        sessionTokenRef.current = Math.random().toString(36).slice(2);
      }
    },
    [handleLocationSelected],
  );


  return (
    <View style={styles.wrapper}>
      <FlatList
        ref={ref => (flatListRef.current = ref)}
        data={displayAddresses.others}
        keyExtractor={item => item.id}
        refreshing={loading}
        onRefresh={() => dispatch(fetchAddresses())}
        renderItem={({item}) => (
          <AddressCard
            address={item}
            onEdit={handleEdit}
            onDelete={confirmDelete}
            onMarkDefault={handleMarkDefault}
            isMarkingDefault={markingDefault}
            onPress={onAddressPress ? () => onAddressPress(item) : undefined}
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
            displayAddresses={displayAddresses}
            onEdit={handleEdit}
            onDelete={confirmDelete}
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
                  onSave: (newAddress: Address) => {
                    dispatch(addAddress(newAddress));
                  },
                });
              }, 150);
            } else {
              navigation.navigate('AddAddressScreen', {
                mode: 'add',
                onSave: (newAddress: Address) => {
                  dispatch(addAddress(newAddress));
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
