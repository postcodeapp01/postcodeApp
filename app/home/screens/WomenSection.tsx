import React, {useMemo} from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import {useSelector} from 'react-redux';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootState} from '../../../Store';
import CategoriesScroll from '../../common/CategoriesScroll';

type SectionProps = {
  parentId: number;
};

export const WomenSection: React.FC<SectionProps> = ({parentId}) => {
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
        title: sub.name,
        image: sub.image,
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
