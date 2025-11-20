
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

interface StoreSectionProps {
  storeName: string;
  storeLocation: string;
  storeLogo?: string;
}

const StoreSection: React.FC<StoreSectionProps> = ({
  storeName,
  storeLocation,
  storeLogo,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.storeHeader}>
        {storeLogo ? (
          <Image source={{ uri: storeLogo }} style={styles.storeLogo} />
        ) : (
          <View style={styles.storePlaceholder}>
            <Text style={styles.storePlaceholderText}>
              {storeName.substring(0, 2).toUpperCase()}
            </Text>
          </View>
        )}
        <View style={styles.storeInfo}>
          <Text style={styles.storeName}>{storeName}</Text>
          <Text style={styles.storeLocation} numberOfLines={1}>
            {storeLocation}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  storeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  storeLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f5f5f5',
  },
  storePlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#9B59B6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storePlaceholderText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 2,
  },
  storeLocation: {
    fontSize: 12,
    color: '#666',
  },
});

export default StoreSection;
