// import React, {useEffect} from 'react';
// import {View, Text, StyleSheet, ScrollView} from 'react-native';
// import CategoryCard from './CategoryCard';
// import {RootState} from '../../../../Store';
// import {useSelector} from 'react-redux';

// const PickByCategory: React.FC = () => {
//   const {categories} = useSelector(
//     (state: RootState) => state.categories,
//   );

//   // Level 1 categories
//   const womenCategory = categories.find(
//     c => c.name === 'Women' && c.level === 1,
//   );
//   const menCategory = categories.find(c => c.name === 'Men' && c.level === 1);

//   // Level 2 subcategories
//   const womenSubcategories = categories.filter(
//     c => c.parent_id === womenCategory?.id,
//   );
//   const menSubcategories = categories.filter(
//     c => c.parent_id === menCategory?.id,
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Pick By Category</Text>
//       <View style={styles.categoryContainer}>
//         {/* Women Row */}
//         <View style={styles.row}>
//           {womenCategory && (
//             <CategoryCard
//               category={{...womenCategory, subcategory: womenCategory.name}}
//               isLarge={true}
//               onPress={() => console.log(`Pressed ${womenCategory.name}`)}
//             />
//           )}
//           <ScrollView
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={styles.scrollRow}>
//             {womenSubcategories.map(category => (
//               <View key={category.id} style={styles.cardSpacing}>
//                 <CategoryCard
//                   category={{
//                     ...category,
//                     subcategory: category.name,
//                     category: 'Women',
//                   }}
//                   isLarge={false}
//                   onPress={() => console.log(`Pressed ........${category.name } ${category.id}`)}
//                 />
//               </View>
//             ))}
//           </ScrollView>
//         </View>

//         {/* Men Row */}
//         <View style={styles.row}>
//           {menCategory && (
//             <CategoryCard
//               category={{...menCategory, subcategory: menCategory.name}}
//               isLarge={true}
//               onPress={() => console.log(`Pressed ${menCategory.name}`)}
//             />
//           )}
//           <ScrollView
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={styles.scrollRow}>
//             {menSubcategories.map(category => (
//               <View key={category.id} style={styles.cardSpacing}>
//                 <CategoryCard
//                   category={{
//                     ...category,
//                     subcategory: category.name,
//                     category: 'Men',
//                   }}
//                   isLarge={false}
//                   onPress={() => console.log(`Pressed ${category.name}`)}
//                 />
//               </View>
//             ))}
//           </ScrollView>
//         </View>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     height: 221,
//     backgroundColor: '#fff',
//     padding: 16,
//     top: -30,
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#000000',
//     marginBottom: 16,
//   },
//   categoryContainer: {
//     height: 182,
//     flexDirection: 'column',
//   },
//   row: {
//     width: 401,
//     height: 86,
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     marginBottom: 10,
//     marginTop: 0,
//   },
//   scrollRow: {
//     height: 86,
//     width: 401,
//     flexDirection: 'row',
//     left: 10,
//   },
//   cardSpacing: {
//     marginRight: 6,
//   },
// });

// export default PickByCategory;
{/* {subCategories.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.secondscrollRow}>
          {' '}
          {subCategories.map(sub => (
            <TouchableOpacity
              key={sub.id}
              style={styles.subItem}
              onPress={() => {
                 
                  'Pressed id :',
                  sub.id,
                );
                navigation.navigate('ProductsScreen', {id: sub.id});
              }}>
              {' '}
              <View style={styles.imageWrapper}>
                {' '}
                <Image source={{uri: sub.image}} style={styles.subImage} />{' '}
                <View style={styles.overlay}>
                  {' '}
                  <Text style={styles.subText}>{sub.name}</Text>{' '}
                </View>{' '}
              </View>{' '}
            </TouchableOpacity>
          ))}{' '}
        </ScrollView>
      )} */}



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
import {RootState} from '../../../../Store';
import {HomeStackParamList} from '../../../../navigators/stacks/HomeStack';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

export default function PickByCategory({onCategoryPress}: any) {
  // Redux categories (unchanged)
  const {categories} = useSelector((state: RootState) => state.categories);
  const navigation = useNavigation<NavigationProp>();

  // Top-level categories (level === 1)
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

  // Selection state (unchanged)
  const [activeParentId, setActiveParentId] = useState<number>(allCategory.id);

  // second-level children (kept for functionality)
  const subCategories = useMemo(
    () =>
      categories.filter(
        (c: any) => c.parent_id === activeParentId && c.level === 2,
      ),
    [categories, activeParentId],
  );

  // ---------------- Responsive (exact 5 slots) ----------------
  const {width: screenWidth} = useWindowDimensions();

  const maxVisible = 5; // fixed requirement: exactly 5 slots
  const paddingHorizontal = 12; // left & right breathing room
  const gap = 12; // space between items
  const totalGap = gap * (maxVisible - 1);
  const totalPadding = paddingHorizontal * 2;
  const available = Math.max(screenWidth - totalPadding - totalGap, 0);
  const itemWidth = Math.floor(available / maxVisible);
  const imageWidth = Math.round(itemWidth * 0.92);
  const imageHeight = Math.round(itemWidth * 0.62);
  const underlineWidth = Math.round(itemWidth * 0.6);
  const containerHeight = imageHeight + 46;

  // Use only first 5 categories. If fewer, fill with invisible placeholders so layout stays fixed.
  const firstFive = displayCategories.slice(0, maxVisible);
  const slots = Array.from({length: maxVisible}, (_, i) => firstFive[i] ?? null);

  // ---------------- Render ----------------
  return (
    <View style={[styles.container, {paddingHorizontal, height: containerHeight}]}>
      <View style={styles.row}>
        {slots.map((cat: any, idx: number) => {
          const isPlaceholder = cat === null;
          const isLast = idx === maxVisible - 1;
          const isActive = !isPlaceholder && activeParentId === cat.id;

          if (isPlaceholder) {
            // Invisible slot to preserve layout
            return (
              <View
                key={`ph-${idx}`}
                style={[
                  styles.topItem,
                  {
                    width: itemWidth,
                    marginRight: isLast ? 0 : gap,
                    opacity: 0,
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
                },
              ]}
              onPress={() => {
                onCategoryPress(cat.id);
                setActiveParentId(cat.id);
              }}>
              <Image
                source={{uri: cat.image}}
                style={[
                  styles.topImage,
                  {
                    width: imageWidth,
                    height: imageHeight,
                    borderRadius: 8,
                  },
                ]}
                resizeMode="cover"
              />

              <Text
                numberOfLines={1}
                allowFontScaling={false} // prevents OS font scaling breaking layout
                ellipsizeMode="tail"
                style={[
                  styles.topText,
                  isActive && styles.topTextActive,
                  {width: imageWidth, marginTop: 6},
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
    marginTop: 10,
    marginBottom:-20,
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start', 
    height:60,
  },
  topItem: {
    alignItems: 'center',
    paddingBottom: 10,
    position: 'relative', 
  },
  topImage: {
    resizeMode: 'cover',
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
    bottom:100,
    height: 2,
    backgroundColor: '#FF4D4D',
    borderRadius: 1,
  },
});

