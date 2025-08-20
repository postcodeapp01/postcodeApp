import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {Category} from './types';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParamList} from '../../../../navigators/stacks/HomeStack';

interface CategoryCardProps {
  category: Category;
  isLarge?: boolean;

  onPress: () => void;
}
type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;
const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  isLarge,

  onPress,
}) => {
  const navigation = useNavigation<NavigationProp>();

  const handlePress = () => {
    if (onPress) {
      onPress(); // run custom action first
    }
    // Navigate to products screen with category parameter
    // console.log("hiii ???????",category.name,category.subcategory);
    navigation.navigate('ProductsScreen', {
      id: category.id,
    });
    // console.log('hiii.......', category.id);
  };
  return (
    <TouchableOpacity
      style={[
        styles.card,
        isLarge ? styles.largeCard : styles.smallCard,
        // isMainCategory && styles.mainCategoryCard, // ✅ apply special style
      ]}
      onPress={handlePress}>
      <Image
        source={{uri: category.image}}
        style={[styles.image, isLarge ? styles.largeImage : styles.smallImage]}
        resizeMode="cover"
      />
      <Text
        style={[styles.text, isLarge ? styles.largeText : styles.smallText]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 80,
    height: 86,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 6,
    marginTop: 0,
  },
  largeCard: {
    width: 92.07,
    height: 86,
    borderWidth: 2,
    borderColor: '##AAAAAA',
    margin: 0,
  },
  smallCard: {
    width: 80,
    height: 86,
    margin: 0,
  },
  image: {
    width: '100%',
  },
  largeImage: {
    width: 70,
    height: 50,
    borderRadius: 0,
  },
  smallImage: {
    marginTop: 8,
    width: 50,
    height: 40,
  },
  text: {
    marginTop: 6,
    fontWeight: '500',
    color: '#000',
  },
  largeText: {
    fontSize: 8,
    fontWeight: '500',
    lineHeight: 10,
    marginTop: 5,
  },
  smallText: {
    fontSize: 8,
    marginTop: 3,
    height: 10,
  },
});

export default CategoryCard;
