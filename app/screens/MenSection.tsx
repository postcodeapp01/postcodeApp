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
    // check if there are level-3 children for this subcategory
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
      // no deeper categories -> go straight to product listing
      navigation.navigate('ProductsScreen', {id: sub.id});
    }
  };

  return (
    <View style={styles.sectionContainer}>
      {subCategories.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.secondscrollRow}>
          {subCategories.map((sub: any) => (
            <TouchableOpacity
              key={sub.id}
              style={styles.subItem}
              onPress={() => handlePress(sub)}>
              <View style={styles.imageWrapper}>
                <Image source={{uri: sub.image}} style={styles.subImage} />
                <View style={styles.overlay}>
                  <Text style={styles.subText}>{sub.name}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
      <OnlyForYouSection/>
      <FestivalOffersSection/>
    </View>
  );
};

// const styles = StyleSheet.create({
//   sectionContainer: { paddingVertical: 8 },
//   secondscrollRow: { paddingHorizontal: 12 },
//   subItem: { marginRight: 12 },
//   imageWrapper: { width: 120, height: 160, borderRadius: 8, overflow: 'hidden' },
//   subImage: { width: '100%', height: '100%' },
//   overlay: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: 6, backgroundColor: 'rgba(0,0,0,0.35)' },
//   subText: { color: '#fff', fontSize: 13 },
// });

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
  secondscrollRow: {
    // backgroundColor: '#0cf53fff',
    width: '100%',
    height: 110,
    left: 10,
  },
  subItem: {
    marginRight: 12,
    alignItems: 'center',
    height: 111,
  },
  imageWrapper: {
    position: 'relative',
    width: 72,
    height: 100,
    // borderRadius: 10,
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
    ...StyleSheet.absoluteFillObject, // fills entire image
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  subText: {
    color: '#fff',
    fontWeight: 'bold',
    width: '100%',
    fontSize: 10,
    textAlign: 'center',
    backgroundColor: '#9747FF',
  },
});
