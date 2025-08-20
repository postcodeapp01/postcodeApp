import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Image} from 'react-native';

interface Props {
  colors: {name: string; image: string}[]; // color name + image URL
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

const ColorSelector: React.FC<Props> = ({
  colors,
  selectedColor,
  onSelectColor,
}) => {
  // Find selected color for label
  const selectedColorObj = colors.find(c => c.name === selectedColor);

  return (
    <View style={styles.outerContainer}>
      <View style={styles.wrapper}>
        {/* Label */}
        <Text style={styles.label}>
          Color : {selectedColorObj ? selectedColorObj.name : 'Select'}
        </Text>

        {/* Swatches */}
        <View style={styles.container}>
          {colors.map(color => (
            <TouchableOpacity
              key={color.name}
              style={[
                styles.colorCircle,
                selectedColor === color.name && styles.selectedBorder,
              ]}
              onPress={() => onSelectColor(color.name)}>
              <Image source={{uri:color.image}} style={styles.image} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

export default ColorSelector;

const styles = StyleSheet.create({
  outerContainer: {
    height: 85,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  wrapper: {
    height: 65,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    marginBottom: 8,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  selectedBorder: {
    borderColor: 'red', // highlight color
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    resizeMode: 'cover',
  },
});
