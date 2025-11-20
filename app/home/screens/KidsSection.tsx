import React, {useMemo} from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import {useSelector} from 'react-redux';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import CategoriesScroll from '../../common/CategoriesScroll';
import { RootState } from '../../../Store';

type SectionProps = {
  parentId: number;
};

export const KidsSection: React.FC<SectionProps> = ({parentId}) => {
  const {categories} = useSelector((state: RootState) => state.categories);
  const navigation = useNavigation<NavigationProp<any>>();

  const subCategories = useMemo(
    () =>
      categories.filter((c: any) => c.parent_id === parentId && c.level === 2),
    [categories, parentId],
  );

  const handlePress = (sub: any) => {
    const hasThirdLevel = categories.some(
      (c: any) => c.parent_id === sub.id && c.level === 3,
    );

    if (hasThirdLevel) {
      navigation.navigate('CategoryScreen', {
        id: sub.id,
        title: typeof sub.name === 'string' ? sub.name : String(sub.id),
        image: typeof sub.image === 'string' ? sub.image : '',
      });
    } else {
      navigation.navigate('ProductsScreen', {id: sub.id});
    }
  };

  return (
    <View style={styles.sectionContainer}>
      {subCategories.length > 0 && (
       
        <CategoriesScroll
          items={subCategories}
          onItemPress={sub => handlePress(sub)}
          backgroundColor="#85D99B"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
  },
  
});
