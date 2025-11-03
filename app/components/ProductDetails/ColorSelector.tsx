import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Image} from 'react-native';

interface Props {
  colors: {name: string; image: string}[]; 
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

const ColorSelector: React.FC<Props> = ({
  colors,
  selectedColor,
  onSelectColor,
}) => {
  const selectedColorObj = colors.find(c => c.name === selectedColor);
  console.log("",colors)
  return (
    <View style={styles.outerContainer}>
      <View style={styles.wrapper}>
        {/* Label */}
        <Text style={styles.label}>
          Color : {selectedColorObj ? selectedColorObj.name : 'Select'}
        </Text>

        {/* Swatches */}
        <View style={styles.container}>
          {colors.map((color,index) => (
            <TouchableOpacity
              key={`${color.name}_${index}`}
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
    height: 130,
    paddingVertical: 10,
    paddingHorizontal: 20,
    // backgroundColor:'#d9b3b3ff'
  },
  wrapper: {
    height: 65,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    marginBottom: 10,
    color:'#222',
    letterSpacing:0.1,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorCircle: {
    width: 80,
    height: 80,
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  selectedBorder: {
    borderColor: '#FF5964',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    resizeMode: 'cover',
  },
});
