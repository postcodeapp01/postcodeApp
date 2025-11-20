
import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';

interface Props {
  onEnable: () => void;
}

const LocationPermissionBanner: React.FC<Props> = ({ onEnable}) => (
  <View style={styles.banner}>
    <Image source={{uri:'https://res.cloudinary.com/dy6bwdhet/image/upload/v1761584231/e09a2b6ce0ba3e50d615913852660853ae99de1f_atjq0t.png'}} style={styles.icon} resizeMode="contain" />
    <View style={styles.info}>
      <Text style={styles.title}>Location permission denied</Text>
      <Text style={styles.subtitle}>
        Enable location permissions to auto-fill your address and show delivery options.
      </Text>
    </View>
    <TouchableOpacity style={styles.button} onPress={onEnable} activeOpacity={0.8}>
      <Text style={styles.buttonText}>Enable</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 25,
    height:82,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 2},
    elevation: 2,
  },
  icon: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 8,
  },
  title: {
    fontWeight: '600',
    color: '#222',
    fontSize: 14,
    lineHeight:20,
    letterSpacing:0.1,
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 10,
    color: '#B1B1B1',
    lineHeight: 12,
    letterSpacing: 0.1,
  },
  button: {
    borderColor: '#FF5964',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#fff',
    width: 60,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: '#FF5964',
    fontWeight: '600',
    fontSize: 10,
    lineHeight:20,
    letterSpacing:0.1,
  },
});

export default LocationPermissionBanner;
