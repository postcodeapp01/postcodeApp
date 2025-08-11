import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {Store} from './types';

interface StoreCardProps {
  store: Store;
  onPress: () => void;
}

const StoreCard: React.FC<StoreCardProps> = ({store, onPress}) => {
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.card}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          {/* <Image 
            source={store.logo} 
            style={styles.logo}
            resizeMode="contain"
          /> */}
          <Image
            source={
              typeof store.logo === 'string' ? {uri: store.logo} : store.logo
            }
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Distance and location */}
        <Text style={styles.metaText}>
          {store.distance} km | {truncateText(store.location, 5)}
        </Text>

        {/* Open Now Badge */}
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{store.status}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 6,
    left: -20,
  },
  card: {
    width: 85,
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
    borderRadius: 8,
  },
  logoContainer: {
    marginBottom: 6,
  },
  logo: {
    width: 48,
    height: 28,
  },
  metaText: {
    fontSize: 8,
    fontWeight: '500',
    color: '#000',
    marginBottom: 6,
    textAlign: 'center',
  },
  statusBadge: {
    backgroundColor: '#f9fcf9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#AAAAAA',
  },
  statusText: {
    fontSize: 8,
    fontWeight: '500',
    color: '#000',
  },
});

export default StoreCard;
