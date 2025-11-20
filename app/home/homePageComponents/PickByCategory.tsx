import React, {useMemo, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  useWindowDimensions,
} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../../../Store';
import {HomeStackParamList} from '../../../navigators/stacks/HomeStack';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

export default function PickByCategory({onCategoryPress}: any) {
  const {categories} = useSelector((state: RootState) => state.categories);
  const navigation = useNavigation<NavigationProp>();

  const topCategories = useMemo(
    () => categories.filter((c: any) => c.level === 1),
    [categories],
  );

  const allCategory = {
    id: -1,
    name: 'All',
    image:
      'https://res.cloudinary.com/dy6bwdhet/image/upload/v1756704897/Rectangle_5379_fvvvlu.png',
    parent_id: 0,
    level: 0,
  };
  const displayCategories = [allCategory, ...topCategories];

  const [activeParentId, setActiveParentId] = useState<number>(allCategory.id);

  const {width: screenWidth} = useWindowDimensions();

  const maxVisible = 5;
  const paddingHorizontal = 12;
  const gap = 12;
  const totalGap = gap * (maxVisible - 1);
  const totalPadding = paddingHorizontal * 2;
  const available = Math.max(screenWidth - totalPadding - totalGap, 0);
  const itemWidth = Math.floor(available / maxVisible);

  const imageWidth = Math.round(itemWidth * 0.7);
  const imageHeight = Math.round(itemWidth * 0.7);
  const underlineWidth = Math.round(itemWidth * 0.6);
  const containerHeight = imageHeight + 42;

  const firstFive = displayCategories.slice(0, maxVisible);
  const slots = Array.from(
    {length: maxVisible},
    (_, i) => firstFive[i] ?? null,
  );

  return (
    <View
      style={[
        styles.container,
        {
          paddingHorizontal,
          height: containerHeight,
        },
      ]}>
      <View style={[styles.row]}>
        {slots.map((cat: any, idx: number) => {
          const isPlaceholder = cat === null;
          const isLast = idx === maxVisible - 1;
          const isActive = !isPlaceholder && activeParentId === cat.id;

          if (isPlaceholder) {
            return (
              <View
                key={`ph-${idx}`}
                style={[
                  styles.topItem,
                  {
                    width: itemWidth,
                    marginRight: isLast ? 0 : gap,
                    opacity: 0,
                    height: containerHeight,
                  },
                ]}
              />
            );
          }

          return (
            <TouchableOpacity
              key={cat.id}
              activeOpacity={0.85}
              style={[
                styles.topItem,
                {
                  width: itemWidth,
                  marginRight: isLast ? 0 : gap,
                  height: containerHeight,
                },
              ]}
              onPress={() => {
                onCategoryPress(cat.id);
                setActiveParentId(cat.id);
              }}>
              <View style={styles.imageWrapper}>
                <Image
                  source={{uri: cat.image}}
                  style={[
                    styles.topImage,
                    {
                      width: imageWidth,
                      height: imageHeight,
                      borderRadius: Math.round(imageWidth / 2),
                    },
                  ]}
                  resizeMode="cover"
                />
              </View>

              <Text
                numberOfLines={1}
                allowFontScaling={false}
                ellipsizeMode="tail"
                style={[
                  styles.topText,
                  isActive && styles.topTextActive,
                  {width: itemWidth - 8, marginTop: 6},
                ]}>
                {cat.name}
              </Text>

              {isActive && (
                <View
                  style={[
                    styles.underline,
                    {
                      width: underlineWidth,
                      left: Math.round((itemWidth - underlineWidth) / 2),
                      bottom: 6,
                    },
                  ]}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    overflow: 'hidden',
    borderColor: '#0c0b0bff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  topItem: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingVertical: 6,
  },
  imageWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  topImage: {
    resizeMode: 'cover',
    backgroundColor: '#F5F5F5',
  },
  topText: {
    fontSize: 12,
    color: '#444',
    textAlign: 'center',
  },
  topTextActive: {
    color: '#FF4D4D',
    fontWeight: '600',
  },
  underline: {
    position: 'absolute',
    height: 2,
    backgroundColor: '#FF4D4D',
    borderRadius: 1,
  },
});
