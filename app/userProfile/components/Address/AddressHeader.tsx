import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

type Props = {
  title?: string;
  onBack?: () => void;
};

const AddressHeader: React.FC<Props> = ({title = 'Addresses', onBack}) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={onBack} style={styles.backButton}>
      <Icon name="arrow-back" size={24} color="#000" />
    </TouchableOpacity>
    <Text style={styles.title}>{title}</Text>
    <View style={styles.placeholder} />
  </View>
);

export default AddressHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#282C3F',
  },
  placeholder: {
    width: 40,
  },
});
