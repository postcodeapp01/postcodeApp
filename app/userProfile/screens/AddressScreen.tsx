import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import AddressList from '../components/Address/AddressList';

type Props = {navigation: any};

const AddressScreen: React.FC<Props> = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <AddressList navigation={navigation} />
    </SafeAreaView>
  );
};

export default AddressScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
});
