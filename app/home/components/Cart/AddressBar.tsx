// src/components/cart/AddressBar.tsx
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface Props {
  address: string;
  onChange?: () => void;
}

const AddressBar: React.FC<Props> = ({address, onChange}) => {
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        {/* Location Icon */}
        <Ionicons
          name="location"
          size={18}
          color="#000000"
          style={styles.locIcon}
        />
        <Text style={styles.addressText} numberOfLines={1}>
          {address}
        </Text>
      </View>
      <TouchableOpacity onPress={onChange}>
        <Text style={styles.change}>Change</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddressBar;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e9effbff',
    padding: 10,
    height: 40,
    marginBottom: 10,
  },
  left: {flexDirection: 'row', alignItems: 'center', flex: 1},
  locIcon: {marginRight: 8},
  addressText: {flex: 1, fontSize: 13, color: '#333'},
  change: {color: '#000000', fontWeight: '700',fontSize:10},
});
