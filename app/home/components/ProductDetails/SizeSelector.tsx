import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';

interface Props {
  sizes: string[];
  selectedSize: string;
  onSelectSize: (size: string) => void;
  sizeDetails?: string; // e.g., "Bust: 32, Waist: 26, Hips: 34"
}

const SizeSelector: React.FC<Props> = ({
  sizes,
  selectedSize,
  onSelectSize,
  sizeDetails,
}) => {
  return (
    <View style={styles.outerContainer}>
      <View style={styles.wrapper}>
        <Text style={styles.title}>Selected Size: {selectedSize || '-'}</Text>
        {
          <Text style={styles.details}>
            {sizeDetails || 'No size details available'}
          </Text>
        }

        <View style={styles.container}>
          {sizes.map(size => (
            <TouchableOpacity
              key={size}
              style={[
                styles.sizeBox,
                selectedSize === size && styles.selectedSize,
              ]}
              onPress={() => onSelectSize(size)}>
              <Text
                style={[
                  styles.sizeText,
                  selectedSize === size && styles.selectedText,
                ]}>
                {size}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

export default SizeSelector;

const styles = StyleSheet.create({
  outerContainer: {
    height: 100,
    paddingVertical: 5,
    paddingHorizontal: 20,
    gap: 2,
    display: 'flex',
    justifyContent: 'center',
    // backgroundColor: '#eccacaff',
  },
  wrapper: {
    // height: 76,
  },
  title: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
    fontWeight: '500',
    color: '#222222',
  },
  details: {
    fontSize: 10,
    fontWeight: '500',
    color: '#B1B1B1',
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  container: {
    flexDirection: 'row',
    // marginTop: 8,
  },
  sizeBox: {
    minWidth: 40, 
    height: 30,
    // paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#AAAAAA',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  sizeText: {
    fontSize: 12,
    lineHeight: 14,
    color: '#222222',
    fontWeight: '500',
  },

  selectedSize: {
    backgroundColor: '#FF5964',
    borderColor: '#FF5964',
  },
  selectedText: {
    color: '#fff',
    fontWeight: '500',
  },
});
