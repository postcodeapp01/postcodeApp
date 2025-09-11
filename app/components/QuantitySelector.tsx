// src/components/common/QuantitySelector.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
  value: number;
  onChange: (newVal: number) => void;
  min?: number;
  max?: number;
}

const QuantitySelector: React.FC<Props> = ({ value, onChange, min = 1, max = 99 }) => {
  const dec = () => {
    if (value > min) onChange(value - 1);
  };
  const inc = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={dec} style={styles.btn}><Text style={styles.btnText}>−</Text></TouchableOpacity>
      <View style={styles.valueBox}><Text style={styles.valueText}>{value}</Text></View>
      <TouchableOpacity onPress={inc} style={styles.btn}><Text style={styles.btnText}>+</Text></TouchableOpacity>
    </View>
  );
};

export default QuantitySelector;

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center' },
  btn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    borderRadius: 6,
  },
  btnText: { fontSize: 18, fontWeight: '700' },
  valueBox: { paddingHorizontal: 14, alignItems: 'center' },
  valueText: { fontSize: 15, fontWeight: '700' },
});
