import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  StatusBar,
  Alert,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch} from '../../../Store';

import AddressCard from '../../userProfile/components/Address/AddressCard';
import AddAddressButton from '../../userProfile/components/Address/AddAddressButton';
import AddressSearchBar from '../../userProfile/components/Address/AddressSearchBar';
import {Address as TAddress} from '../../userProfile/components/Address/address';
import {
  fetchAddresses,
  deleteAddress as deleteAddressThunk,
  markDefault,
  selectAddresses,
  selectAddressesLoading,
  selectAddressesRefreshing,
  selectMarkingDefault,
} from '../../../reduxSlices/addressesSlice';

const LocationSelector: React.FC = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();

  const addresses = useSelector(selectAddresses);
  const loading = useSelector(selectAddressesLoading);
  const refreshing = useSelector(selectAddressesRefreshing);
  const markingDefault = useSelector(selectMarkingDefault);

  const defaultAddressLocal = useMemo(
    () => addresses.find(a => a.isDefault) ?? null,
    [addresses],
  );
  const nonDefaultAddressesLocal = useMemo(
    () => addresses.filter(a => !a.isDefault),
    [addresses],
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<TAddress | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<
    Array<{id: string; text: string}>
  >([]);
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);

  const flatListRef = useRef<FlatList<any>>(null);

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  useEffect(() => {
    if (!selectedAddress && addresses.length > 0) {
      const pick = defaultAddressLocal ?? addresses[0];
      setSelectedAddress({...pick, label: pick.label ?? ''});
    }
  }, [addresses, defaultAddressLocal, selectedAddress]);

  useEffect(() => {
    if (
      defaultAddressLocal &&
      selectedAddress?.id !== defaultAddressLocal.id
    ) {
      const wasDefaultMarked = addresses.find(
        a => a.id === defaultAddressLocal.id && a.isDefault,
      );
      if (wasDefaultMarked && selectedAddress && !selectedAddress.isDefault) {
        setSelectedAddress({
          ...defaultAddressLocal,
          label: defaultAddressLocal.label ?? '',
        });
      }
    }
  }, [defaultAddressLocal, selectedAddress, addresses]);

  const buildSuggestionText = useCallback((a: TAddress) => {
    const parts = [a.name, a.label, a.addressLine1, a.city, a.pincode].filter(
      Boolean,
    );
    return parts.join(', ');
  }, []);

  useEffect(() => {
    const q = searchQuery.toLowerCase().trim();
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

    setSuggestions(out);
    setSuggestionsVisible(true);
  }, [searchQuery, addresses, buildSuggestionText]);

  const scrollToAddress = useCallback(
    (id: string) => {
      const hasDefault = Boolean(defaultAddressLocal);
      try {
        if (hasDefault) {
          if (defaultAddressLocal && defaultAddressLocal.id === id) {
            flatListRef.current?.scrollToIndex({
              index: 1, // header-default at 0, default item at 1
              animated: true,
              viewPosition: 0.15,
            });
          } else {
            const idx = nonDefaultAddressesLocal.findIndex(a => a.id === id);
            if (idx >= 0) {
              // header-default=0, default=1, header-all=2, items start at 3
              flatListRef.current?.scrollToIndex({
                index: 3 + idx,
                animated: true,
                viewPosition: 0.2,
              });
            } else {
              flatListRef.current?.scrollToOffset({offset: 0, animated: true});
            }
          }
        } else {
          const idx = addresses.findIndex(a => a.id === id);
          if (idx >= 0) {
            flatListRef.current?.scrollToIndex({
              index: idx + 1, // header-all=0, items start at 1
              animated: true,
              viewPosition: 0.2,
            });
          } else {
            flatListRef.current?.scrollToOffset({offset: 0, animated: true});
          }
        }
      } catch (err) {
        // fallback to top if index calculation fails
        console.warn('scrollToIndex failed, fallback to top', err);
        try {
          flatListRef.current?.scrollToOffset({offset: 0, animated: true});
        } catch (e) {
          /* ignore */
        }
      }
    },
    [addresses, defaultAddressLocal, nonDefaultAddressesLocal],
  );

  const onSuggestionPress = useCallback(
    (s: {id: string; text: string}) => {
      setSuggestions([]);
      setSuggestionsVisible(false);
      scrollToAddress(s.id);
      setSearchQuery('');
    },
    [scrollToAddress],
  );

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteAddressThunk(id)).unwrap();
      // Refresh addresses after delete to keep UI consistent
      try {
        const refreshed = await dispatch(fetchAddresses()).unwrap();
        // If fetch returns the array payload, try to set selected address if needed
        if (Array.isArray(refreshed) && refreshed.length > 0) {
          // if current selected was deleted, pick new default or first
          if (!refreshed.find((a: any) => a.id === (selectedAddress?.id ?? ''))) {
            const pick = refreshed.find((a: any) => a.isDefault) ?? refreshed[0];
            if (pick) setSelectedAddress({...pick, label: pick.label ?? ''});
          }
        }
      } catch {
        // ignore fetch errors here; the store will update via reducer if the thunk does it
      }
    } catch (err) {
      console.error('Delete address error:', err);
      Alert.alert('Error', 'Failed to delete address');
    }
  };

  const handleMarkDefault = async (id: string) => {
    if (markingDefault) return;
    try {
      // Call markDefault thunk to update backend/store
      await dispatch(markDefault(id)).unwrap();

      // Immediately refresh addresses to reflect the new default in the UI
      try {
        const refreshed = await dispatch(fetchAddresses()).unwrap();
        // If fetch returns the array payload, use it to set selectedAddress
        let updatedAddresses: any[] = [];
        if (Array.isArray(refreshed)) {
          updatedAddresses = refreshed;
        } else if (refreshed && Array.isArray(refreshed.addresses)) {
          updatedAddresses = refreshed.addresses;
        } else {
          // fallback to current selector data
          updatedAddresses = addresses;
        }

        const newDefault = updatedAddresses.find(a => a.id === id);
        if (newDefault) {
          setSelectedAddress({...newDefault, label: newDefault.label ?? ''});
        }
      } catch (fetchErr) {
        // If fetch failed, rely on the store / selectors to update (existing useEffect will sync)
        console.warn('fetchAddresses after markDefault failed', fetchErr);
      }
    } catch (err) {
      console.error('Mark default error:', err);
      Alert.alert('Error', 'Could not set default address. Try again.');
    }
  };

  const handleRefresh = () => dispatch(fetchAddresses());

  const renderItem = ({item}: {item: TAddress}) => (
    <AddressCard
      address={item}
      isDefault={Boolean(item.isDefault)}
      onEdit={addr => {
        setModalVisible(false);
        navigation.navigate('AddAddressScreen', {
          mode: 'edit',
          address: addr,
          onSave: () => dispatch(fetchAddresses()),
        });
      }}
      onDelete={handleDelete}
      showMarkDefault={!item.isDefault}
      onPress={() => {
        setSelectedAddress(item);
        setModalVisible(false);
      }}
      onMarkDefault={() => handleMarkDefault(item.id)}
      isMarkingDefault={markingDefault}
    />
  );

  const combinedData = useMemo(() => {
    const arr: any[] = [];
    if (defaultAddressLocal) {
      arr.push({type: 'header', title: 'Default Address', id: 'header-default'});
      arr.push(defaultAddressLocal);
    }
    arr.push({type: 'header', title: 'All Addresses', id: 'header-all'});
    arr.push(...nonDefaultAddressesLocal);
    return arr;
  }, [defaultAddressLocal, nonDefaultAddressesLocal]);

  return (
    <View>
      <TouchableOpacity
        style={styles.selectedLocation}
        onPress={() => setModalVisible(true)}>
        <Icon name="location-sharp" size={16} color="#000" />
        <Text style={styles.locationName} numberOfLines={1}>
          {defaultAddressLocal?.name ??
            selectedAddress?.name ??
            'Select address'}
        </Text>
        <View style={styles.separator} />
        <Text style={styles.locationAddress} numberOfLines={1}>
          {defaultAddressLocal
            ? `${defaultAddressLocal.addressLine1}${
                defaultAddressLocal.addressLine2
                  ? ', ' + defaultAddressLocal.addressLine2
                  : ''
              }${defaultAddressLocal.city ? ', ' + defaultAddressLocal.city : ''}`
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
        <StatusBar
          backgroundColor="rgba(0,0,0,0.4)"
          barStyle="light-content"
        />
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.title}>Select a Delivery Address</Text>

              <View style={{paddingHorizontal: 16, paddingBottom: 8}}>
                <AddressSearchBar
                  searchQuery={searchQuery}
                  onSearchChange={q => setSearchQuery(q)}
                  placeholder="Search your addresses..."
                />
                {suggestionsVisible && (
                  <View style={styles.suggestionsContainer}>
                    {suggestions.length === 0 ? (
                      <View style={styles.suggestionItem}>
                        <Text style={styles.noMatchText}>
                          No matches found
                        </Text>
                      </View>
                    ) : (
                      suggestions.map(s => (
                        <TouchableOpacity
                          key={s.id}
                          onPress={() => onSuggestionPress(s)}
                          style={styles.suggestionItem}>
                          <Text numberOfLines={2} style={styles.suggestionText}>
                            {s.text}
                          </Text>
                        </TouchableOpacity>
                      ))
                    )}
                  </View>
                )}
              </View>

              {!loading && addresses.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    No saved addresses yet.
                  </Text>
                  <AddAddressButton
                    onPress={() => {
                      setModalVisible(false);
                      navigation.navigate('AddAddressScreen', {
                        mode: 'add',
                        onSave: () => dispatch(fetchAddresses()),
                      });
                    }}
                  />
                </View>
              ) : (
                <FlatList
                  ref={flatListRef}
                  data={combinedData}
                  keyExtractor={item => item.id}
                  ItemSeparatorComponent={() => (
                    <View style={styles.itemSeparator} />
                  )}
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  contentContainerStyle={styles.listContent}
                  style={styles.flatListStyle}
                  keyboardShouldPersistTaps="handled"
                  renderItem={({item}) =>
                    (item as any).type === 'header' ? (
                      <View style={styles.sectionHeader}>
                        <Text style={styles.sectionHeaderText}>
                          {(item as any).title}
                        </Text>
                      </View>
                    ) : (
                      renderItem({item: item as TAddress})
                    )
                  }
                />
              )}
            </View>
            <View style={styles.bottomBar}>
              <AddAddressButton
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate('AddAddressScreen', {
                    mode: 'add',
                    onSave: () => dispatch(fetchAddresses()),
                  });
                }}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
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
    maxHeight: '80%',
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
  section: {
    marginTop: 8,
  },
  sectionTitle: {
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 6,
  },
  sectionTitle2: {
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 10,
  },
  listContent: {
    paddingBottom: 120,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyText: {
    marginBottom: 12,
    color: '#666',
  },
  locationName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#000',
    lineHeight: 20,
    letterSpacing: 0.1,
    left: 3,
  },
  itemSeparator: {
    height: 8,
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

  // Suggestions overlay styles
  suggestionsContainer: {
    marginTop: 8,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    // subtle shadow
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 6,
    elevation: 2,
  },
  suggestionItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  suggestionText: {
    fontSize: 14,
    color: '#222',
  },
  noMatchText: {
    fontSize: 14,
    color: '#888',
  },
});
