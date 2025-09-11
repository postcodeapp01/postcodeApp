import React from 'react';
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';

type Props = {
  onPress: () => void;
};

const AddAddressButton: React.FC<Props> = ({onPress}) => (
  <TouchableOpacity
    style={styles.btn}
    onPress={onPress}
    accessibilityRole="button">
    <Text style={styles.text}>Add new address</Text>
  </TouchableOpacity>
);

export default AddAddressButton;

const styles = StyleSheet.create({
  btn: {
    height: 70,
    marginHorizontal: 20,
    width:'100%',
    justifyContent: 'center',
    paddingHorizontal:22,
    left:-20,
    borderTopColor: '#e3e2ddff',
    borderTopWidth: 2,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0072F0',
    lineHeight:20,
    letterSpacing:0.1,
  },
});
