import React, {useCallback, useEffect, useState, useMemo, useRef} from 'react';
import {View, Alert, FlatList, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import AddressCard from './AddressCard';
import Geolocation from '@react-native-community/geolocation';
import {requestLocationPermission} from '../../../common/permissions/location';
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
import {getAddressFromCoords} from '../../../common/utils/getAddressFromCoords';
import AddressListHeader from './AddressListHeader';
import {Address} from './address';
import AddAddressButton from './AddAddressButton';
import {AppDispatch} from '../../../../Store';

type Props = {
  navigation: any;
  // new props for modal usage
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

  // parent-controlled searchQuery (AddressSearchBar is expected to debounce internally)
  const [searchQuery, setSearchQuery] = useState('');

  // suggestions overlay states
  const [suggestions, setSuggestions] = useState<Array<{id: string; text: string}>>(
    [],
  );
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);

  // id selected from suggestion to trigger scroll
  const [selectedSuggestionId, setSelectedSuggestionId] = useState<string | null>(
    null,
  );

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
                if (Boolean(addr.isDefault) && !Boolean(updatedItem.isDefault)) {
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
                Alert.alert('Error', 'Could not update address. Please try again.');
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
              Alert.alert('Error', 'Could not update address. Please try again.');
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

  // New: when user taps "Use My Location" in this screen
  const handleUseMyLocationPress = useCallback(async () => {
    const hasPerm = await requestLocationPermission();
    if (!hasPerm) {
      Alert.alert('Permission Denied', 'Location permission is required');
      return;
    }

    Geolocation.getCurrentPosition(
      async position => {
        const {latitude, longitude} = position.coords;
        try {
          const address = await getAddressFromCoords(latitude, longitude);
          if (address) {
            // pass the reverse-geocoded address to AddAddressScreen
            handleLocationSelected(address);
          } else {
            Alert.alert('Error', 'Unable to fetch address from current location');
          }
        } catch (err) {
          console.error('Reverse geocode error:', err);
          Alert.alert('Error', 'Failed to fetch address. Please try again.');
        }
      },
      error => {
        console.error('Geolocation error:', error);
        Alert.alert('Error', 'Failed to get location. Please try again.');
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  }, [handleLocationSelected]);

  // Parent receives search updates from AddressSearchBar (which should debounce internally).
  // Important: do NOT debounce here.
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // build suggestion text
  const buildSuggestionText = useCallback((a: Address) => {
    const parts = [a.name, a.label, a.addressLine1, a.city, a.pincode].filter(
      Boolean,
    );
    return parts.join(', ');
  }, []);

  // compute suggestions (no parent debounce; AddressSearchBar already debounces)
  useEffect(() => {
    const q = searchQuery?.toLowerCase().trim() ?? '';

    if (!q) {
      setSuggestions([]);
      setSuggestionsVisible(false);
      return;
    }

    const out: Array<{id: string; text: string}> = [];
    for (const a of addresses) {
      const searchable = [
        a.name,
        a.label,
        a.addressLine1,
        a.addressLine2,
        a.city,
        a.state,
        a.country,
        a.pincode,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      if (searchable.includes(q)) {
        out.push({id: a.id, text: buildSuggestionText(a)});
      }
      if (out.length >= 6) break;
    }

    // show overlay even if no matches — we'll show "No matches found"
    setSuggestions(out);
    setSuggestionsVisible(true);
  }, [searchQuery, addresses, buildSuggestionText]);

  // user presses a suggestion
  const onSuggestionPress = useCallback((s: {id: string; text: string}) => {
    // close overlay and clear search input
    setSuggestions([]);
    setSuggestionsVisible(false);

    // set the selected id so the effect scrolls the list
    setSelectedSuggestionId(s.id);

    // clear search input in parent so overlay doesn't reappear; AddressSearchBar will receive this via prop
    setSearchQuery('');
  }, []);

  // scroll to selected suggestion id once displayAddresses is ready
  useEffect(() => {
    if (!selectedSuggestionId) return;

    // find index in the "others" list (FlatList renders others)
    const idx = displayAddresses.others.findIndex(
      a => a.id === selectedSuggestionId,
    );

    // schedule a tick for UI to settle then scroll
    setTimeout(() => {
      try {
        if (idx >= 0) {
          flatListRef.current?.scrollToIndex({
            index: idx,
            animated: true,
            viewPosition: 0.2,
          });
        } else {
          // possibly the default address — scroll to top so header is visible
          flatListRef.current?.scrollToOffset({offset: 0, animated: true});
        }
      } catch (err) {
        // scrollToIndex may fail if measurement not ready; fallback to top
        console.warn('scrollToIndex failed, fallback to top', err);
        flatListRef.current?.scrollToOffset({offset: 0, animated: true});
      } finally {
        setSelectedSuggestionId(null);
      }
    }, 0);
  }, [displayAddresses, selectedSuggestionId]);

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
            // pass onAddressPress if provided (this allows parent modal to close and receive the address)
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
