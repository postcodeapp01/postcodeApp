// import React, {useCallback, useEffect, useState, useMemo, useRef} from 'react';
// import {View, Alert, FlatList, StyleSheet} from 'react-native';
// import {useDispatch, useSelector} from 'react-redux';
// import AddressCard from './AddressCard';
// import {
//   fetchAddresses,
//   addAddress,
//   updateAddress,
//   deleteAddress as deleteAddressThunk,
//   selectAddresses,
//   selectCurrentLocationAddress,
//   setCurrentLocationAddress,
// } from '../../../../reduxSlices/addressesSlice';
// import AddressListHeader from './AddressListHeader';
// import {Address} from './address';
// import AddAddressButton from './AddAddressButton';
// import {AppDispatch, RootState} from '../../../../Store';
// import axiosInstance from '../../../../config/Api';

// type Props = {
//   navigation: any;
//   onAddressPress?: (addr: Address) => void;
//   onStartAdd?: () => void;
//   onStartEdit?: () => void;
//   hideAddButton?: boolean;
// };

// const AddressList: React.FC<Props> = ({
//   navigation,
//   onAddressPress,
//   onStartAdd,
//   onStartEdit,
//   hideAddButton,
// }) => {
//   const dispatch = useDispatch<AppDispatch>();

//   const addresses = useSelector(selectAddresses);
//   const currentLocationAddress = useSelector(selectCurrentLocationAddress);
//   const loading = useSelector((state: RootState) => state.addresses.loading);
//   const userLocation = useSelector(
//     (state: RootState) => state.user.userDetails?.location,
//   );
  
//   console.log("in the address list logging user location", userLocation);

//   const [searchQuery, setSearchQuery] = useState('');

//   const [suggestions, setSuggestions] = useState<
//     Array<{id: string; text: string}>
//   >([]);
//   const [suggestionsVisible, setSuggestionsVisible] = useState(false);
//   const sessionTokenRef = useRef<string>(() =>
//     Math.random().toString(36).slice(2),
//   );
//   const acDebounceRef = useRef<number | null>(null);

//   // flatlist ref for scrolling
//   const flatListRef = useRef<FlatList<any> | null>(null);

//   useEffect(() => {
//     dispatch(fetchAddresses());
//   }, [dispatch]);

//   // DISPLAY: Show all addresses (suggested addresses appear at top)
//   const displayAddresses = useMemo(() => {
//     // Separate suggested and saved addresses
//     const suggestedAddresses = addresses.filter(a => a.isSuggested);
//     const savedAddresses = addresses.filter(a => !a.isSuggested);
    
//     return {
//       suggested: suggestedAddresses,
//       saved: savedAddresses,
//       all: addresses, // for header component if needed
//     };
//   }, [addresses]);

//   const handleEdit = useCallback(
//     (addr: Address) => {
//       // If parent wants to close modal before navigating, call it:
//       if (onStartEdit) {
//         onStartEdit();
//         // small delay so modal has time to close cleanly
//         setTimeout(() => {
//           navigation.navigate('AddAddressScreen', {
//             mode: 'edit',
//             address: addr,
//             onSave: async (updated: Address) => {
//               // merge so fields not present in the edit form are preserved
//               const payload: Address = {
//                 ...addr, // existing values
//                 ...updated, // edited values override existing
//               };

//               try {
//                 // update backend
//                 await dispatch(updateAddress(payload)).unwrap();
                
//                 // refresh list from server
//                 await dispatch(fetchAddresses()).unwrap();
                
//                 Alert.alert('Success', 'Address updated.');
//               } catch (error) {
//                 console.error('Update address error:', error);
//                 Alert.alert(
//                   'Error',
//                   'Could not update address. Please try again.',
//                 );
//               }
//             },
//           });
//         }, 150);
//       } else {
//         // original behavior if parent didn't provide onStartEdit:
//         navigation.navigate('AddAddressScreen', {
//           mode: 'edit',
//           address: addr,
//           onSave: async (updated: Address) => {
//             const payload: Address = {
//               ...addr,
//               ...updated,
//             };
            
//             try {
//               await dispatch(updateAddress(payload)).unwrap();
//               await dispatch(fetchAddresses()).unwrap();
//               Alert.alert('Success', 'Address updated.');
//             } catch (error) {
//               console.error('Update address error:', error);
//               Alert.alert(
//                 'Error',
//                 'Could not update address. Please try again.',
//               );
//             }
//           },
//         });
//       }
//     },
//     [navigation, dispatch, onStartEdit],
//   );

//   const confirmDelete = useCallback(
//     (id: string) => {
//       Alert.alert(
//         'Delete Address',
//         'Are you sure you want to delete this address?',
//         [
//           {text: 'Cancel', style: 'cancel'},
//           {
//             text: 'Delete',
//             style: 'destructive',
//             onPress: async () => {
//               try {
//                 await dispatch(deleteAddressThunk(id)).unwrap();
//                 // refresh to keep UI consistent
//                 await dispatch(fetchAddresses()).unwrap();
//                 Alert.alert('Success', 'Address deleted successfully.');
//               } catch (error) {
//                 console.error('Delete error:', error);
//                 Alert.alert('Error', 'Could not delete address. Try again.');
//               }
//             },
//           },
//         ],
//       );
//     },
//     [dispatch],
//   );

//   // Handle address selection (replaces markDefault)
//   const handleAddressSelect = useCallback(
//     (addr: Address) => {
//       // Update the current location address
//       dispatch(setCurrentLocationAddress(addr));
      
//       // If there's an onAddressPress callback (from modal), call it
//       if (onAddressPress) {
//         onAddressPress(addr);
//       }
//     },
//     [dispatch, onAddressPress],
//   );

//   const handleLocationSelected = useCallback(
//     (locationData: Partial<Address>) => {
//       if (onStartAdd) {
//         // if parent wants to close modal before navigation
//         onStartAdd();
//         setTimeout(() => {
//           navigation.navigate('AddAddressScreen', {
//             mode: 'add',
//             address: {
//               ...locationData,
//               phone: '',
//             },
//             onSave: async (newAddress: Address) => {
//               try {
//                 await dispatch(addAddress(newAddress)).unwrap();
//                 await dispatch(fetchAddresses()).unwrap();
//               } catch (err) {
//                 console.error('Add address error:', err);
//                 Alert.alert('Error', 'Could not add address. Try again.');
//               }
//             },
//           });
//         }, 150);
//       } else {
//         navigation.navigate('AddAddressScreen', {
//           mode: 'add',
//           address: {
//             ...locationData,
//             phone: '',
//           },
//           onSave: async (newAddress: Address) => {
//             try {
//               await dispatch(addAddress(newAddress)).unwrap();
//               await dispatch(fetchAddresses()).unwrap();
//             } catch (err) {
//               console.error('Add address error:', err);
//               Alert.alert('Error', 'Could not add address. Try again.');
//             }
//           },
//         });
//       }
//     },
//     [navigation, dispatch, onStartAdd],
//   );

//   const handleUseMyLocationPress = useCallback(async () => {
//     try {
//       const {lat, lng} = userLocation;
//       const response = await axiosInstance.post('/googlemaps/reverse-geocode', {
//         lat,
//         lng,
//       });
      
//       if (response.data) {
//         handleLocationSelected(response.data);
//       } else {
//         Alert.alert('Error', 'Unable to fetch address from current location');
//       }
//     } catch (err) {
//       console.error('Reverse geocode error:', err);
//       Alert.alert('Error', 'Failed to fetch address. Please try again.');
//     }
//   }, [handleLocationSelected, userLocation]);

//   const handleSearchChange = useCallback((query: string) => {
//     setSearchQuery(query);
//   }, []);

//   // fetch suggestions when searchQuery changes (debounced)
//   useEffect(() => {
//     if (!searchQuery || searchQuery.trim().length < 2) {
//       setSuggestions([]);
//       setSuggestionsVisible(false);
//       return;
//     }
//     if (acDebounceRef.current) clearTimeout(acDebounceRef.current);
//     acDebounceRef.current = window.setTimeout(async () => {
//       try {
//         const location = userLocation
//           ? {lat: userLocation.lat, lng: userLocation.lng}
//           : undefined;
//         const resp = await axiosInstance.post('/googlemaps/autocomplete', {
//           input: searchQuery.trim(),
//           sessionToken: sessionTokenRef.current,
//           location,
//         });

//         const preds = resp.data?.predictions || [];
//         console.log("Autocomplete", preds);
//         const mapped = preds.map((p: any) => ({
//           id: p.id || p.place_id,
//           text: p.text || p.description,
//         }));
//         setSuggestions(mapped);
//         setSuggestionsVisible(true);
//       } catch (err) {
//         console.error('autocomplete fetch failed', err);
//         setSuggestions([]); 
//         setSuggestionsVisible(false);
//       }
//     }, 300); 
//     return () => {
//       if (acDebounceRef.current) {
//         clearTimeout(acDebounceRef.current);
//       }
//     };
//   }, [searchQuery, userLocation]);

//   const onSuggestionPress = useCallback(
//     async (s: {id: string; text: string}) => {
//       try {
//         setSuggestionsVisible(false);
//         setSearchQuery(s.text);

//         const resp = await axiosInstance.post('/googlemaps/place-details', {
//           placeId: s.id,
//           sessionToken: sessionTokenRef.current,
//         });

//         const data = resp.data;
//         if (!data) {
//           Alert.alert('Error', 'Failed to fetch place details');
//           return;
//         }

//         // Build partial Address object expected by handleLocationSelected
//         const locationData: Partial<Address> = {
//           name: data.name || undefined,
//           addressLine1: data.addressLine1 || data.formattedAddress || '',
//           addressLine2: data.addressLine2 || '',
//           city: data.city || '',
//           state: data.state || '',
//           country: data.country || '',
//           pincode: data.pincode || '',
//           lat: data.lat,
//           lng: data.lng,
//         };

//         // send to the existing flow
//         handleLocationSelected(locationData);
//       } catch (err) {
//         console.error('place-details error', err);
//         Alert.alert('Error', 'Unable to fetch place details. Try again.');
//       } finally {
//         // new search session next time
//         sessionTokenRef.current = Math.random().toString(36).slice(2);
//       }
//     },
//     [handleLocationSelected],
//   );

//   return (
//     <View style={styles.wrapper}>
//       <FlatList
//         ref={ref => (flatListRef.current = ref)}
//         data={displayAddresses.saved} // Show only saved addresses in the main list
//         keyExtractor={item => item.id}
//         refreshing={loading}
//         onRefresh={() => dispatch(fetchAddresses())}
//         renderItem={({item}) => (
//           <AddressCard
//             address={item}
//             onEdit={handleEdit}
//             onDelete={confirmDelete}
//             onSelect={handleAddressSelect} // Replace onMarkDefault with onSelect
//             isSelected={currentLocationAddress?.id === item.id} // Show selected state instead of default
//             onPress={onAddressPress ? () => onAddressPress(item) : undefined}
//           />
//         )}
//         keyboardShouldPersistTaps="handled"
//         nestedScrollEnabled
//         ListHeaderComponent={
//           <AddressListHeader
//             searchQuery={searchQuery}
//             onSearchChange={handleSearchChange}
//             suggestions={suggestions}
//             suggestionsVisible={suggestionsVisible}
//             onSuggestionPress={onSuggestionPress}
//             onUseMyLocationPress={handleUseMyLocationPress}
//             displayAddresses={displayAddresses}
//             currentLocationAddress={currentLocationAddress}
//             onEdit={handleEdit}
//             onDelete={confirmDelete}
//             onAddressSelect={handleAddressSelect}
//           />
//         }
//         contentContainerStyle={{paddingBottom: 80, flexGrow: 1}}
//         showsVerticalScrollIndicator={false}
//         style={{flex: 1}}
//       />

//       {!hideAddButton && (
//         <AddAddressButton
//           onPress={() => {
//             if (onStartAdd) {
//               onStartAdd();
//               setTimeout(() => {
//                 navigation.navigate('AddAddressScreen', {
//                   mode: 'add',
//                   onSave: async (newAddress: Address) => {
//                     try {
//                       await dispatch(addAddress(newAddress)).unwrap();
//                       await dispatch(fetchAddresses()).unwrap();
//                     } catch (err) {
//                       console.error('Add address error:', err);
//                       Alert.alert('Error', 'Could not add address. Try again.');
//                     }
//                   },
//                 });
//               }, 150);
//             } else {
//               navigation.navigate('AddAddressScreen', {
//                 mode: 'add',
//                 onSave: async (newAddress: Address) => {
//                   try {
//                     await dispatch(addAddress(newAddress)).unwrap();
//                     await dispatch(fetchAddresses()).unwrap();
//                   } catch (err) {
//                     console.error('Add address error:', err);
//                     Alert.alert('Error', 'Could not add address. Try again.');
//                   }
//                 },
//               });
//             }
//           }}
//         />
//       )}
//     </View>
//   );
// };

// export default AddressList;

// const styles = StyleSheet.create({
//   wrapper: {
//     flex: 1,
//     backgroundColor: '#FFF',
//   },
// });



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
  onAddressPress?: (addr: Address) => void; // optional parent callback (e.g. to close modal)
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

  // slice selectors
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

  // initialize session token properly
  const sessionTokenRef = useRef<string>(Math.random().toString(36).slice(2));
  const acDebounceRef = useRef<number | null>(null);
  const flatListRef = useRef<FlatList<any> | null>(null);

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

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

  // Ordered list: default (if present among saved) first, then the rest (preserve original order)
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

  // When a card is pressed -> set default (frontend-only) and call parent callback if provided
  const handleAddressSelect = useCallback(
    (addr: Address) => {
      // set default ID in slice (synchronous reducer)
      dispatch(setDefaultAddress(addr.id));

      // if parent wants to be notified (e.g. LocationSelector to close modal)
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
          address: {...locationData, phone: ''},
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
        handleLocationSelected(response.data);
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

  // autocomplete suggestions (debounced)
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
