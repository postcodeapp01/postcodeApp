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
          <Image source={store.logo} style={styles.logo} resizeMode="contain" />
        </View>

        {/* Distance and location */}
        <Text style={styles.metaText}>
          {store.distance} km | {truncateText(store.location, 8)}
        </Text>

        {/* Open Now Badge */}
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{store.status==="Open"?"Open Now":"Closed"}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 5,
    width:95,
    height:80,
    
  },
  card: {
    width: 95,
    height:80,
    backgroundColor: '#c02525ff',
    paddingVertical: 4,
    paddingHorizontal: 4,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth:1,
  },
  logoContainer: {
    marginBottom: 6,
  },
  logo: {
    width: 48,
    height: 29,
  },
  metaText: {
    fontSize: 8,
    fontWeight: '500',
    color: '#000',
    marginBottom: 6,
    lineHeight:10,
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
    letterSpacing:0.1,
  },
});

export default StoreCard;
