// MenSection.tsx (only the important changed parts)
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
import OnlyForYouSection from '../components/Men/OnlyForYouSection';
import FestivalOffersSection from '../components/Men/FestiveSection';
import CategoriesScroll from '../common/CategoriesScroll';

type SectionProps = {parentId: number};

export const MenSection: React.FC<SectionProps> = ({parentId}) => {
  const {categories} = useSelector((s: RootState) => s.categories);
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
    onItemPress={(sub) => handlePress(sub)}
    backgroundColor="#C3D9F6"    
  />
      )}
      <OnlyForYouSection/>
      <FestivalOffersSection/>
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
    marginBottom: 16,
    borderRadius: 8,
  },
  secondscrollRow: {
    backgroundColor: '#C3D9F6',
    width: '100%',
    height: 130,
    paddingVertical: 10,
  },
  subItem: {
    marginLeft: 6,
    alignItems: 'center',
  },
  imageWrapper: {
    position: 'relative',
    width: 72,
    height: 110,
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    overflow: 'hidden',
  },
  subImage: {
    width: 72,
    height: 100,
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, 
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  subText: {
    color: '#fff',
    fontWeight: '600',
    width: '100%',
    fontSize: 10,
    textAlign: 'center',
    backgroundColor: '#9747FF',
    lineHeight:20,
    letterSpacing:-0.32,
  },
});
