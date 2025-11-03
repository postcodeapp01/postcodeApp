// import React, {useState, useMemo} from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   FlatList,
//   StyleSheet,
//   Alert,
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import {calculateDistance} from '../../common/utils/distanceCalculator';
// import {StoreGroup} from '../../../reduxSlices/cartSlice';

// interface Store {
//   store_id: number;
//   store_name: string;
//   store_latitude: number;
//   store_longitude: number;
//   items: any[];
// }

// interface Props {
//   currentStore: Store;
//   allStores: StoreGroup[]; // expected to be store groups
//   renderedStoreIds?: number[];
//   onAddStores: (stores: Store[]) => void;
// }

// const NearbyCartStores: React.FC<Props> = ({
//   currentStore,
//   allStores,
//   onAddStores,
//   renderedStoreIds = [],
// }) => {
//   // defensive guards
//   if (!currentStore) {
//     console.warn('[NearbyCartStores] missing currentStore, returning null');
//     return null;
//   }
//   if (!Array.isArray(allStores)) {
//     console.warn('[NearbyCartStores] allStores is not an array:', allStores);
//     return null;
//   }

//   const [expanded, setExpanded] = useState(false);
//   const [selectedIds, setSelectedIds] = useState<number[]>([]);

//   // compute nearby stores only once per render set
//   const nearbyStores = useMemo(() => {
//     const list = allStores.filter(s => {
//       // skip current
//       if (!s) return false;
//       if (s.store_id === currentStore.store_id) return false;

//       // calculateDistance should return meters (as you said earlier).
//       const distMeters = calculateDistance(
//         Number(currentStore.store_latitude),
//         Number(currentStore.store_longitude),
//         Number(s.store_latitude),
//         Number(s.store_longitude),
//       );

//       // threshold 500 meters
//       return Number(distMeters) <= 500;
//     });

//     return list;
//   }, [allStores, currentStore]);

//   const toggleSelection = (id: number) => {
//     setSelectedIds(prev => {
//       const next = prev.includes(id)
//         ? prev.filter(x => x !== id)
//         : [...prev, id];
//       return next;
//     });
//   };

//   if (nearbyStores.length === 0) return null;

//   return (
//     <View style={styles.container}>
//       <Text style={styles.message}>
//         Your cart products are near to this Store add to this Checkout
//       </Text>

//       {!expanded ? (
//         <TouchableOpacity
//           style={styles.addBtn}
//           onPress={() => {
//             console.log('[NearbyCartStores] expand list');
//             setExpanded(true);
//           }}>
//           <Ionicons name="add-circle-outline" size={18} color="#fff" />
//           <Text style={styles.addText}>Add Nearby Store Items</Text>
//         </TouchableOpacity>
//       ) : (
//         <View style={styles.dropdown}>
//           <FlatList
//             data={nearbyStores}
//             keyExtractor={s => s.store_id.toString()}
//             renderItem={({item}) => {
//               const isAlreadyInCart = renderedStoreIds.includes(item.store_id);
//               const isSelected =
//                 selectedIds.includes(item.store_id) || isAlreadyInCart;

//               const distanceMeters = Math.round(
//                 calculateDistance(
//                   Number(currentStore.store_latitude),
//                   Number(currentStore.store_longitude),
//                   Number(item.store_latitude),
//                   Number(item.store_longitude),
//                 ),
//               );

//               return (
//                 <TouchableOpacity
//                   style={[styles.storeRow, isAlreadyInCart && {opacity: 0.6}]}
//                   disabled={isAlreadyInCart}
//                   onPress={() => toggleSelection(item.store_id)}>
//                   <Ionicons
//                     name={isSelected ? 'checkbox-outline' : 'square-outline'}
//                     size={22}
//                     color={isSelected ? '#FF6B6B' : '#777'}
//                     style={{marginRight: 8}}
//                   />
//                   <View>
//                     <Text style={styles.storeName}>{item.store_name}</Text>
//                     <Text style={styles.distance}>
//                       {distanceMeters < 1000
//                         ? `${distanceMeters} m away`
//                         : `${(distanceMeters / 1000).toFixed(2)} km away`}
//                     </Text>
//                   </View>
//                 </TouchableOpacity>
//               );
//             }}
//           />

//           <View style={styles.dropdownFooter}>
//             <TouchableOpacity
//               style={styles.cancelBtn}
//               onPress={() => {
//                 console.log('[NearbyCartStores] cancel selection');
//                 setExpanded(false);
//                 setSelectedIds([]);
//               }}>
//               <Text style={styles.cancelText}>Cancel</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[
//                 styles.confirmBtn,
//                 {opacity: selectedIds.length ? 1 : 0.5},
//               ]}
//               disabled={selectedIds.length === 0}
//               onPress={() => {
//                 console.log(
//                   '[NearbyCartStores] confirm selectedIds:',
//                   selectedIds,
//                 );
//                 const selectedStores = nearbyStores.filter(s =>
//                   selectedIds.includes(s.store_id),
//                 );

//                 console.log(
//                   '[NearbyCartStores] selectedStores (to add):',
//                   selectedStores.map(s => ({
//                     id: s.store_id,
//                     items: (s.items || []).length,
//                   })),
//                 );

//                 // Add safety check
//                 const storesWithItems = selectedStores.filter(
//                   s => Array.isArray(s.items) && s.items.length > 0,
//                 );
//                 if (storesWithItems.length === 0) {
//                   Alert.alert(
//                     'No items to add',
//                     'Selected stores have no items.',
//                   );
//                   return;
//                 }

//                 // send the stores back to parent
//                 try {
//                   onAddStores(storesWithItems);
//                   console.log('[NearbyCartStores] onAddStores called');
//                 } catch (e) {
//                   console.error(
//                     '[NearbyCartStores] error calling onAddStores',
//                     e,
//                   );
//                 }

//                 setExpanded(false);
//                 setSelectedIds([]);
//               }}>
//               <Text style={styles.confirmText}>Add Selected</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       )}
//     </View>
//   );
// };

// export default NearbyCartStores;

// const styles = StyleSheet.create({
//   container: { backgroundColor: '#FFF'},
//   message: {
//     height:35,
//     padding: 8,
//     backgroundColor: '#34A853',
//     fontSize: 12,
//     color: '#fff',
//     // marginBottom: 8,
//     textAlign: 'center',
//   },
//   addBtn: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FF6B6B',
//     padding: 10,
//     borderRadius: 8,
//     width: '70%',
//   },
//   addText: {color: '#fff', marginLeft: 8, fontWeight: '600'},
//   dropdown: {marginTop: 12},
//   storeRow: {flexDirection: 'row', paddingVertical: 10, alignItems: 'center'},
//   storeName: {fontWeight: '600'},
//   distance: {color: '#666', fontSize: 13},
//   dropdownFooter: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 12,
//   },
//   cancelBtn: {padding: 10},
//   cancelText: {color: '#777'},
//   confirmBtn: {backgroundColor: '#FF6B6B', padding: 10, borderRadius: 6},
//   confirmText: {color: '#fff'},
// });

import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { calculateDistance } from '../../common/utils/distanceCalculator';

interface Store {
  store_id: number;
  store_name: string;
  items: any[];
  store_logo?: string;
  image?: string;
  store_latitude?: string | number;
  store_longitude?: string | number;
}

interface Props {
  currentStore: Store;
  allStores: Store[];
  onAddStores: (stores: Store[]) => void;
  onRemoveStores?: (storeIds: number[]) => void;
}

const NearbyCartStores: React.FC<Props> = ({
  currentStore,
  allStores,
  onAddStores,
  onRemoveStores,
}) => {
  // compute eligible stores within 500m (and not the current store)
  const eligibleStores = useMemo(() => {
    if (!Array.isArray(allStores)) return [];
    return allStores.filter((s) => {
      if (!s) return false;
      if (s.store_id === currentStore.store_id) return false;
      if (!s.store_latitude || !s.store_longitude) return false;

      const distMeters = calculateDistance(
        Number(currentStore.store_latitude),
        Number(currentStore.store_longitude),
        Number(s.store_latitude),
        Number(s.store_longitude)
      );

      // only show stores within 500 meters and having items
      return Number(distMeters) <= 500 && Array.isArray(s.items) && s.items.length > 0;
    });
  }, [allStores, currentStore]);

  // local set of added stores (store_ids)
  const [addedStoreIds, setAddedStoreIds] = useState<number[]>([]);

  // handlers that operate per-store
  const handleAdd = (store: Store) => {
    try {
      onAddStores([store]); // notify parent
      setAddedStoreIds((prev) => Array.from(new Set([...prev, store.store_id])));
    } catch (err) {
      console.warn('onAddStores failed', err);
    }
  };

  const handleRemove = (store: Store) => {
    try {
      if (onRemoveStores) {
        onRemoveStores([store.store_id]);
      } else {
        onAddStores([]);
      }
    } catch (err) {
      console.warn('onRemoveStores failed', err);
    }

    setAddedStoreIds((prev) => prev.filter((id) => id !== store.store_id));
  };

  if (!eligibleStores || eligibleStores.length === 0) return null;

  return (
    <>
    <Text style={styles.message}>
         Your cart products are near to this Store add to this Checkout
       </Text>
    <View>
      {eligibleStores.map((store) => {
        const logoSource = store.store_logo
          ? { uri: store.store_logo }
          : store.image
          ? { uri: store.image }
          : require('../../../sources/images/hm-b.png');

        const isAdded = addedStoreIds.includes(store.store_id);

        return (
          <View key={store.store_id} style={styles.bannerBox}>
            <View style={styles.logoContainer}>
              <Image source={logoSource} style={styles.logoImg} />
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.primaryLine} numberOfLines={1}>
                <Text style={styles.boldBrand}>{store.store_name}</Text>
                <Text> is close by you</Text>
              </Text>
              <Text style={styles.secondaryLine} numberOfLines={1}>
                Already in cart. Add from nearby store?
              </Text>
            </View>

            {isAdded ? (
              <TouchableOpacity
                style={[styles.addBtn, styles.removeBtn]}
                onPress={() => handleRemove(store)}
              >
                <Text style={[styles.addBtnText, styles.removeBtnText]}>Remove</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.addBtn} onPress={() => handleAdd(store)}>
                <Text style={styles.addBtnText}>Add</Text>
              </TouchableOpacity>
            )}
          </View>
        );
      })}
    </View>
    </>
  );
};

export default NearbyCartStores;

const styles = StyleSheet.create({
  bannerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    height: 56,
    backgroundColor: '#fff',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    marginVertical: 6,
  },
  message: {
    height:35,
    padding: 8,
    backgroundColor: '#34A853',
    fontSize: 12,
    color: '#fff',
    // marginBottom: 8,
    textAlign: 'center',
  },
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    overflow: 'hidden',
  },
  logoImg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    resizeMode: 'cover',
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  primaryLine: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginBottom: 1,
  },
  boldBrand: {
    fontWeight: '700',
    color: '#222',
    fontSize: 15,
  },
  secondaryLine: {
    fontSize: 11,
    color: '#808080',
  },
  addBtn: {
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  removeBtn: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  removeBtnText: {
    color: '#FF6B6B',
    fontWeight: '700',
  },
});

