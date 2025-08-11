import React from 'react';
import {
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
  ImageSourcePropType,
} from 'react-native';

interface Brand {
  id: string;
  name: string;
  logo: ImageSourcePropType;
}

interface BrandCardProps {
  brand: Brand;
  onPress: () => void;
}

const BrandCard: React.FC<BrandCardProps> = ({brand, onPress}) => {
  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
      <View style={styles.card}>
        <Image source={brand.logo} style={styles.logo} resizeMode="contain" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 8,
  },
  card: {
    width: 86,
    height: 40,
    borderWidth: 1,
    borderColor: '#B1B1B1',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
},
logo: {
    // borderRadius: 10,
    // backgroundColor:'red',
    width: 86,
    height: 40,
  },
});

export default BrandCard;
export type {Brand};
