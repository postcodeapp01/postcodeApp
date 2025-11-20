import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';

const DeliveryOptions = ({delivery}) => (
  <View style={styles.container}>
    <View style={styles.content}>
      <Image
        source={require('../../../../sources/images/delivery.png')}
        style={styles.icon}
      />
      <Text style={styles.text}>Delivery in {delivery.eta}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    height: 50,
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 5,
  },
  content: {
    flexDirection: 'row',
    left:8,
    alignItems: 'center',
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },

  text: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '400',
    color: '#000',
  },
});

export default DeliveryOptions;
