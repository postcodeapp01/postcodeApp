// import React, {useMemo} from 'react';
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   TouchableOpacity,
//   FlatList,
//   Dimensions,
// } from 'react-native';
// import {
//   RouteProp,
//   useRoute,
//   useNavigation,
//   NavigationProp,
// } from '@react-navigation/native';
// import {useSelector} from 'react-redux';
// import {RootState} from '../../Store';
// import ProductsHeader from '../components/Products/ProductsHeader';
// import CategoriesScroll from '../common/CategoriesScroll';

// type Params = {
//   CategoryScreen: {
//     id: number;
//     title?: string;
//     image?: string; // URL string
//   };
// };

// const {width} = Dimensions.get('window');
// const NUM_COLUMNS = 3;
// const GAP = 12;
// const ITEM_WIDTH = Math.floor((width - GAP * (NUM_COLUMNS + 1)) / NUM_COLUMNS);

// const CategoryScreen: React.FC = () => {
//   const route = useRoute<RouteProp<Params, 'CategoryScreen'>>();
//   const navigation = useNavigation<NavigationProp<any>>();
//   const {id, title, image} = route.params || ({} as any);

//   const {categories} = useSelector((s: RootState) => s.categories);

//   // compute third level once per id/categories change
//   const thirdLevel = useMemo(
//     () => categories.filter((c: any) => c.parent_id === id && c.level === 3),
//     [categories, id],
//   );


//   const handleOpenProducts = (cid: number) =>
//     navigation.navigate('ProductsScreen', {id: cid});

//   const renderGridItem = ({item}: {item: any}) => (
//     <TouchableOpacity
//       key={item.id}
//       style={[styles.gridItem, {width: ITEM_WIDTH}]}
//       onPress={() => handleOpenProducts(item.id)}
//       activeOpacity={0.85}
//     >
//       <View style={styles.imageWrapper}>
//         <Image source={{uri: item.image}} style={styles.subImage} />
//         <View style={styles.overlay}>
//           <Text style={styles.subText}>{item.name}</Text>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );

//   // Header for the FlatList that contains ProductsHeader, banner and categories scroll
//   const ListHeader = () => (
//     <View>
//       <ProductsHeader title={title} onBack={() => navigation.goBack()} />
      

//       {/* Categories horizontal scroll */}
//       {thirdLevel.length > 0 && (
//         <CategoriesScroll
//           items={thirdLevel}
//           onItemPress={(item) => handleOpenProducts(item.id)}
//           backgroundColor="#C3D9F6"
//           containerHeight={130}
//           itemWidth={72}
//           imageHeight={100}
//           activeItemId={null}
//         />
//       )}
//     </View>
//   );

//   // if (!thirdLevel.length) {
//   //   return (
//   //     <View style={styles.fallbackContainer}>
//   //       <View style={styles.headerRow}>
//   //         <TouchableOpacity
//   //           onPress={() => navigation.goBack()}
//   //           style={styles.iconBtn}>
//   //           <Text style={styles.backArrow}>‹</Text>
//   //         </TouchableOpacity>
//   //         <Text style={styles.headerTitle}>{title || 'Categories'}</Text>
//   //         <View style={{width: 36}} />
//   //       </View>

//   //       {bannerImage ? (
//   //         <Image source={bannerImage} style={styles.banner} />
//   //       ) : (
//   //         <View style={[styles.banner, styles.bannerPlaceholder]} />
//   //       )}

//   //       <View style={styles.empty}>
//   //         <Text style={styles.emptyText}>No subcategories found.</Text>
//   //         <TouchableOpacity
//   //           style={styles.btn}
//   //           onPress={() => handleOpenProducts(id)}>
//   //           <Text style={styles.btnText}>View products</Text>
//   //         </TouchableOpacity>
//   //       </View>
//   //     </View>
//   //   );
//   // }

//   return (
//     <FlatList
//       key={`cat-${id}`}
//       data={thirdLevel}
//       keyExtractor={(i: any) => String(i.id)}
//       numColumns={NUM_COLUMNS}
//       ListHeaderComponent={<ListHeader />}
//       removeClippedSubviews={false}
//       initialNumToRender={12}
//       maxToRenderPerBatch={12}
//       windowSize={7}
//       contentContainerStyle={styles.flatListContent}
//     />
//   );
// };

// const styles = StyleSheet.create({
//   headerRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     backgroundColor: '#fff',
//   },
//   leftRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   rightRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   iconBtn: {},
//   headerTitle: {
//     marginLeft: 6,
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#000',
//     textTransform: 'uppercase',
//   },

//   bannerWrap: {paddingBottom: 12},
//   banner: {width: '100%', height: 180},
//   bannerPlaceholder: {backgroundColor: '#eee'},

//   chipsContainer: {paddingHorizontal: 12, paddingVertical: 8},
//   chip: {width: 120, marginRight: 12, alignItems: 'center'},
//   chipImage: {width: 120, height: 140, borderRadius: 8, overflow: 'hidden'},
//   chipText: {marginTop: 6, fontSize: 13, textAlign: 'center'},

//   flatListContent: {
//     paddingHorizontal: GAP,
//     paddingTop: 12,
//     paddingBottom: 40,
//     backgroundColor: '#fff',
//   },

//   gridItem: {
//     marginLeft: GAP,
//     marginBottom: GAP,
//     borderRadius: 8,
//     overflow: 'hidden',
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   gridImage: {width: '100%', height: ITEM_WIDTH, borderRadius: 8},
//   gridText: {padding: 6, fontSize: 13, textAlign: 'center'},

//   fallbackContainer: {flex: 1, backgroundColor: '#fff'},
//   empty: {padding: 24, alignItems: 'center'},
//   emptyText: {marginBottom: 12, color: '#444'},
//   btn: {
//     backgroundColor: '#000',
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     borderRadius: 6,
//   },
//   btnText: {color: '#fff'},
//   subItem: {
//     marginRight: 12,
//     alignItems: 'center',
//     height: 111,
//   },
//   imageWrapper: {
//     position: 'relative',
//     width: 72,
//     height: 100,
//     borderTopEndRadius: 10,
//     borderTopStartRadius: 10,
//     overflow: 'hidden',
//   },
//   subImage: {
//     width: 72,
//     height: 100,
//     resizeMode: 'cover',
//   },
//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//   },
//   subText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     width: '100%',
//     fontSize: 10,
//     textAlign: 'center',
//     backgroundColor: '#9747FF',
//   },
// });

// export default CategoryScreen;
import React, { useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import {
  RouteProp,
  useRoute,
  useNavigation,
  NavigationProp,
} from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../Store';
import ProductsHeader from '../components/Products/ProductsHeader';
import CategoriesScroll from '../common/CategoriesScroll';

type Params = {
  CategoryScreen: {
    id: number;
    title?: string;
    image?: string;
  };
};

const { width } = Dimensions.get('window');
const NUM_COLUMNS = 3;
const GAP = 12;
const ITEM_WIDTH = Math.floor((width - GAP * (NUM_COLUMNS + 1)) / NUM_COLUMNS);

const CategoryScreen: React.FC = () => {
  const route = useRoute<RouteProp<Params, 'CategoryScreen'>>();
  const navigation = useNavigation<NavigationProp<any>>();
  const { id, title } = route.params || ({} as any);

  const { categories } = useSelector((s: RootState) => s.categories);

  // compute third level once per id/categories change
  const thirdLevel = useMemo(
    () => categories.filter((c: any) => c.parent_id === id && c.level === 3),
    [categories, id],
  );

  const handleOpenProducts = (cid: number) =>
    navigation.navigate('ProductsScreen', { id: cid });

  return (
    <View style={styles.container}>
      <ProductsHeader title={title} onBack={() => navigation.goBack()} />

      {/* Only render the horizontal categories scroll */}
      <CategoriesScroll
        items={thirdLevel}
        onItemPress={(item) => handleOpenProducts(item.id)}
        // backgroundColor="#C3D9F6"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default CategoryScreen;
