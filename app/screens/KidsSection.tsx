// KidsSection.tsx
import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useSelector } from 'react-redux';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootState } from '../../../Store';

type SectionProps = {
  parentId: number;
};

export const KidsSection: React.FC<SectionProps> = ({ parentId }) => {
  const { categories } = useSelector((state: RootState) => state.categories);
  const navigation = useNavigation<NavigationProp<any>>();

  // compute second-level children of the given parent (level === 2)
  const subCategories = useMemo(
    () => categories.filter((c: any) => c.parent_id === parentId && c.level === 2),
    [categories, parentId],
  );

  const handlePress = (sub: any) => {
    // check if there are level-3 children for this subcategory
    const hasThirdLevel = categories.some((c: any) => c.parent_id === sub.id && c.level === 3);

    if (hasThirdLevel) {
      // navigate to CategoryScreen with simple serializable params only
      navigation.navigate('CategoryScreen', {
        id: sub.id,
        title: typeof sub.name === 'string' ? sub.name : String(sub.id),
        image: typeof sub.image === 'string' ? sub.image : '',
      });
    } else {
      // no deeper categories -> go straight to product listing
      navigation.navigate('ProductsScreen', { id: sub.id });
    }
  };

  return (
    <View style={styles.sectionContainer}>
      {subCategories.length > 0 && (
        <ScrollView
          horizontal
          nestedScrollEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.secondscrollRow}
        >
          {subCategories.map((sub: any, idx: number) => (
            <TouchableOpacity
              key={sub.id ?? `kids-${parentId}-${idx}`}
              style={styles.subItem}
              activeOpacity={0.8}
              onPress={() => handlePress(sub)}
            >
              <View style={styles.imageWrapper}>
                {/* Safe image rendering: show Image only when a valid uri exists, otherwise a placeholder view */}
                {sub.image ? (
                  <Image source={{ uri: sub.image }} style={styles.subImage} />
                ) : (
                  <View style={styles.placeholder}>
                    <Text numberOfLines={1} style={styles.placeholderText}>
                      {sub.name ?? 'Item'}
                    </Text>
                  </View>
                )}

                <View style={styles.overlay}>
                  <Text style={styles.subText} numberOfLines={1}>
                    {sub.name}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    // container remains flexible for the page layout
  },
  secondscrollRow: {
    paddingHorizontal: 10,
    height: 110,
    alignItems: 'center',
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
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  subImage: {
    width: 72,
    height: 100,
    resizeMode: 'cover',
  },
  placeholder: {
    width: 72,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEE',
  },
  placeholderText: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
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
