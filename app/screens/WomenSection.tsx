import React, {useMemo} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useSelector} from 'react-redux';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootState} from '../../Store';
import CategoriesScroll from '../common/CategoriesScroll';

type SectionProps = {
  parentId: number;
};

export const WomenSection: React.FC<SectionProps> = ({parentId}) => {
  const {categories} = useSelector((state: RootState) => state.categories);
  const navigation = useNavigation<NavigationProp<any>>();

  // Get level 2 subcategories for the given parent
  const subCategories = useMemo(
    () =>
      categories.filter((c: any) => c.parent_id === parentId && c.level === 2),
    [categories, parentId],
  );

  const handlePress = (sub: any) => {
    // Check if this subcategory has level 3 children
    const hasThirdLevel = categories.some(
      (c: any) => c.parent_id === sub.id && c.level === 3,
    );

    if (hasThirdLevel) {
      // Go to CategoryScreen if deeper level exists
      navigation.navigate('CategoryScreen', {
        id: sub.id,
        title: sub.name,
        image: sub.image,
      });
    } else {
      // Otherwise go directly to product listing
      navigation.navigate('ProductsScreen', {id: sub.id});
    }
  };

  return (
    <View style={styles.sectionContainer}>
      {subCategories.length > 0 && (
       
        <CategoriesScroll
        items={subCategories}
        onItemPress={(sub)=>handlePress(sub)}
        backgroundColor='#F6C7CF'
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    // padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  banner: {
    width: '100%',
    height: 150,
    marginBottom: 16,
    borderRadius: 8,
  },
  
});
