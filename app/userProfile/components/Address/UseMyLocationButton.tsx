import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

type Props = {
  onPress: () => void;
};

const UseMyLocationButton: React.FC<Props> = ({ onPress }) => {
  return (
    <View style={styles.outer}>
      <TouchableOpacity onPress={onPress} style={styles.button}>
        <Text style={styles.buttonText}>Use My Location</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UseMyLocationButton;

const styles = StyleSheet.create({
  outer: {
    paddingHorizontal: 8,
    marginVertical: 12,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF5964',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
