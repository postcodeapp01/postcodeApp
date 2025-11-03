import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';

export interface Store {
  id: string;
  name: string;
  location: string;
  isOpen: boolean;
  logo?: string;
  category?: string;
  distance?: string;
  rating?: number;
  reviewCount?: string;
  deliveryTime?: string;
  discount?: string;
}

interface Props {
  store: Store;
  onViewStore: () => void;
  onRemoveStore: () => void;
}

const StoreCard: React.FC<Props> = ({store, onViewStore, onRemoveStore}) => {
  return (
    <View style={styles.card}>
      {/* Store Info */}
      <View style={styles.storeInfo}>
        {/* Store Logo */}
        <View style={styles.logoContainer}>
          {!store.logo ? (
            <Image source={{uri: store.logo}} style={styles.logo} defaultSource={require('../../../../sources/images/hmb.png')}/>
          ) : (
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoText}>{store.name.charAt(0)}</Text>
            </View>
          )}
        </View>

        {/* Store Details */}
        <View style={styles.details}>
          <Text style={styles.storeName}>{store.name}</Text>
          <Text style={styles.location}>{store.location}</Text>
          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusDot,
                {backgroundColor: store.isOpen ? '#34A853' : '#FF0000'},
              ]}
            />
            <Text
              style={[
                styles.statusText,
                {color: store.isOpen ? '#34A853' : '#FF0000'},
              ]}>
              {store.isOpen ? 'Open now' : 'Closed'}
            </Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={onRemoveStore}
          activeOpacity={0.7}>
          <Text style={styles.removeText}>Remove Store</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.viewButton}
          onPress={onViewStore}
          activeOpacity={0.7}>
          <Text style={styles.viewText}>View Store</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 15,
    height: 140,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  storeInfo: {
    flexDirection: 'row',
    marginBottom: 10,
    // backgroundColor: '#eb4242ff',
  },
  logoContainer: {
    left:8,
    padding:8,
    marginRight: 12,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  logoPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  details: {
    flex: 1,
    justifyContent: 'center',
  },
  storeName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    lineHeight:20,
    letterSpacing:0.1,
  },
  location: {
    fontSize: 14,
    fontWeight:'400',
    color: '#000',
    letterSpacing:0.1,
    // marginBottom:2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight:18,
    letterSpacing:0.1,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 10,
  },
  removeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF6B6B',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  removeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222',
    lineHeight:20,
    letterSpacing:-0.32,
  },
  viewButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#FF5964',
    alignItems: 'center',
  },
  viewText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    lineHeight:20,
    letterSpacing:-0.32,
  },
});

export default StoreCard;
