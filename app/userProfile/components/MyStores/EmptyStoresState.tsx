// components/stores/EmptyStoresState.tsx
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface Props {
  onBrowseStores: () => void;
}

const EmptyStoresState: React.FC<Props> = ({onBrowseStores}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="storefront-outline" size={64} color="#CCC" />
      </View>
      <Text style={styles.title}>No Stores Yet</Text>
      <Text style={styles.message}>
        You haven't added any stores to your favorites yet.
      </Text>
      <TouchableOpacity style={styles.button} onPress={onBrowseStores}>
        <Text style={styles.buttonText}>Browse Stores</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
});

export default EmptyStoresState;
