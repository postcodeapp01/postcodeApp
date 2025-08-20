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
        <Text style={styles.title}>Size: {selectedSize || '-'}</Text>
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
    height: 112,
    paddingVertical: 10,
    paddingHorizontal: 20,
    gap: 10,
    display: 'flex',
    justifyContent: 'center',
  },
  wrapper: {
    height: 76,
  },
  title: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
    fontWeight: '500',
    color: '#000000',
  },
  details: {
    fontSize: 12,
    color: '#B1B1B1',
    marginTop: 2,
  },
  container: {
    flexDirection: 'row',
    marginTop: 8,
  },
  sizeBox: {
    minWidth: 40, // enough for XXL
    height: 30,
    paddingHorizontal: 8,
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
    color: '#000000',
    fontWeight: '500',
  },

  selectedSize: {
    backgroundColor: '#FF5A5F',
    borderColor: '#FF5A5F',
  },
  selectedText: {
    color: '#fff',
    fontWeight: '500',
  },
});
