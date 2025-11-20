import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { calculateDistance } from '../../../common/utils/distanceCalculator';

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
  console.log("All sotores",allStores)
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

      return Number(distMeters) <= 500 && Array.isArray(s.items) && s.items.length > 0;
    });
  }, [allStores, currentStore]);
  const [addedStoreIds, setAddedStoreIds] = useState<number[]>([]);

  const handleAdd = (store: Store) => {
    try {
      onAddStores([store]); 
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
          : require('../../../../sources/images/hm-b.png');

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
    fontSize: 10,
    color: '#222',
    lineHeight:20,
    letterSpacing:0.1,
    fontWeight: '500',
  },
  addBtn: {
    backgroundColor: '#FF5964',
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
    borderColor: '#FF5964',
  },
  removeBtnText: {
    color: '#FF5964',
    fontWeight: '700',
  },
});

