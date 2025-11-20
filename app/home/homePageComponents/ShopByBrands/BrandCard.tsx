import React from 'react';
import {TouchableOpacity, View, Image, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Brand} from './ShopByBrands';

interface BrandCardProps {
  brand: Brand;
  onPress: () => void;
}

const BrandCard: React.FC<BrandCardProps> = ({brand, onPress}) => {
  // console.log('brand', brand);
  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
      <LinearGradient
        colors={['#FF6B9D', '#306CFE']}
        start={{x: 1, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.gradientBorder}>
        <View style={styles.card}>
          <Image
            source={{uri: brand?.logo}}
            style={styles.logo}
            resizeMode="cover"
          />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginLeft: 12,
  },
  gradientBorder: {
    width: 86,
    height: 49,
    borderRadius: 8,
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: 82,
    height: 45,
    borderRadius: 6,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 43,
  },
});

export default BrandCard;
export type {Brand};
