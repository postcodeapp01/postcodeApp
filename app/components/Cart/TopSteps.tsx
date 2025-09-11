// src/components/cart/TopSteps.tsx
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

interface Props {
  activeIndex?: number; // 0 = My Cart, 1 = Review, 2 = Payment, 3 = Track
}

const steps = [
  {label: 'My Cart', icon: <FontAwesome5 name="shopping-cart" size={18} />},
  {label: 'Review', icon: <MaterialIcons name="credit-card" size={18} />},
  {
    label: 'Payment',
    icon: <MaterialCommunityIcons name="credit-card-outline" size={18} />,
  },
  {
    label: 'Track',
    icon: <MaterialCommunityIcons name="truck-delivery" size={18} />,
  },
];

const TopSteps: React.FC<Props> = ({activeIndex = 0}) => {
  return (
    <View style={styles.row}>
      {steps.map((s, i) => {
        const active = i <= activeIndex;
        return (
          <View key={s.label} style={styles.step}>
            <View style={[styles.circle, active && styles.activeCircle]}>
              {React.cloneElement(s.icon, {
                color: active ? '#fff' : '#000',
              })}
            </View>
            <Text style={[styles.label, active && styles.activeLabel]}>
              {s.label}
            </Text>
            {i < steps.length - 1 && (
              <View style={[styles.sep, active && styles.activeSep]} />
            )}
          </View>
        );
      })}
    </View>
  );
};

export default TopSteps;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical:10,
    backgroundColor:'#fff',
    height: 80,
  },
  step: {
    alignItems: 'center',
    width: '25%',
    position: 'relative',
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: '#EEE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeCircle: {
    backgroundColor: '#5B54E3',
  },
  label: {
    marginTop: 6,
    fontSize: 10,
    color: '#000',
    textAlign: 'center',
    lineHeight:20,
    fontWeight: '400',
  },
  activeLabel: {
    color: '#5B54E3',
    fontWeight: '500',
  },
  sep: {
    position: 'absolute',
    right: -33,
    top: 18,
    height: 2,
    width: 66,
    backgroundColor: '#E6E6E6',
  },
  activeSep: {
    backgroundColor: '#5B54E3',
  },
});
