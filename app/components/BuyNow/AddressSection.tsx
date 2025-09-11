import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo'; // For home icon

const AddressSection = ({address, onChange}) => {
  return (
    <View style={styles.container}>
      <View style={{flex: 1}}>
        {/* First row: Home + Name */}
        <View style={styles.topRow}>
          <Icon
            name="home"
            size={16}
            color="#FF5964"
            style={{marginRight: 4}}
          />
          <Text style={styles.homeText}>Home</Text>
          <Text style={styles.separator}> | </Text>
          <Text style={styles.name}>{address.name}</Text>
          <TouchableOpacity style={styles.changeBtn} onPress={onChange}>
            <Text style={styles.changeBtnText}>CHANGE</Text>
          </TouchableOpacity>
        </View>

        {/* Address & Phone */}
        <Text style={styles.addressText}>{address.address}</Text>
        <Text style={styles.phoneText}>{address.phone}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,

    marginVertical: 8,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    flexWrap: 'wrap',
    height: 34,
  },
  homeText: {
    fontSize: 14,
    color: '#FF5964',
    fontWeight: '500',
  },
  separator: {
    fontSize: 14,
    color: '#333',
    marginHorizontal: 2,
  },
  name: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  addressText: {
    fontSize: 12,
    color: '#222222',
    lineHeight: 20,
    fontWeight: '500',
    marginBottom: 4,
  },
  phoneText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '400',
    lineHeight: 20,
  },
  changeBtn: {
    left: 150,
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    alignSelf: 'center',
  },
  changeBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
});

export default AddressSection;
