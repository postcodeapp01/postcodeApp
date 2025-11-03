// // screens/MyStoresScreen.tsx
// import React, {useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   SafeAreaView,
//   StyleSheet,
//   FlatList,
//   ActivityIndicator,
//   Alert,
//   TouchableOpacity,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import EmptyStoresState from '../components/MyStores/EmptyStoresState';
// import HeaderWithNoIcons from '../components/Profile/HeaderWithNoIcons';
// import axiosInstance from '../../../config/Api';
// import StoreCard , {Store}from '../components/MyStores/StoreCard';

// const MyStoresScreen: React.FC<{navigation: any}> = ({navigation}) => {
// //   const [stores, setStores] = useState<Store[]>([]);
//   const [loading, setLoading] = useState(true);


//   const handleViewStore = (store: Store) => {
//     navigation.navigate('StoreDetails', {storeId: store.id});
//   };
// const stores: Store[] = [
//   {
//     id: '1',
//     name: 'Max',
//     location: 'Banjara Hills, Hyderabad',
//     isOpen: true,
//     logo: 'https://example.com/logos/max.png',
//     category: 'Fashion',
//     distance: '2.5 km',
//     rating: 4.3,
//     reviewCount: '2k+',
//     deliveryTime: '45-50 Mins',
//     discount: 'Upto 35% Off',
//   },
//   {
//     id: '2',
//     name: 'Zudio',
//     location: 'Kothapet, Hyderabad',
//     isOpen: false,
//     logo: 'https://example.com/logos/zudio.png',
//     category: 'Fashion',
//     distance: '3.2 km',
//     rating: 4.1,
//     reviewCount: '1.5k+',
//     deliveryTime: '50-55 Mins',
//     discount: 'Upto 40% Off',
//   },
//   {
//     id: '3',
//     name: 'H&M',
//     location: 'Jubilee Hills, Hyderabad',
//     isOpen: true,
//     logo: 'https://example.com/logos/hm.png',
//     category: 'Fashion',
//     distance: '4.1 km',
//     rating: 4.5,
//     reviewCount: '3k+',
//     deliveryTime: '40-45 Mins',
//     discount: 'Upto 30% Off',
//   },
//   {
//     id: '4',
//     name: 'Centro',
//     location: 'Somajiguda, Hyderabad',
//     isOpen: true,
//     logo: 'https://example.com/logos/centro.png',
//     category: 'Footwear',
//     distance: '1.8 km',
//     rating: 4.2,
//     reviewCount: '1k+',
//     deliveryTime: '35-40 Mins',
//     discount: 'Upto 25% Off',
//   },
//   {
//     id: '5',
//     name: 'Pantaloons',
//     location: 'Begumpet, Hyderabad',
//     isOpen: false,
//     logo: 'https://example.com/logos/pantaloons.png',
//     category: 'Fashion',
//     distance: '5.3 km',
//     rating: 4.4,
//     reviewCount: '2.5k+',
//     deliveryTime: '55-60 Mins',
//     discount: 'Upto 45% Off',
//   },
//   {
//     id: '6',
//     name: 'Westside',
//     location: 'Gachibowli, Hyderabad',
//     isOpen: true,
//     logo: 'https://example.com/logos/westside.png',
//     category: 'Fashion',
//     distance: '6.7 km',
//     rating: 4.3,
//     reviewCount: '1.8k+',
//     deliveryTime: '60-65 Mins',
//     discount: 'Upto 35% Off',
//   },
//   {
//     id: '7',
//     name: 'Lifestyle',
//     location: 'Madhapur, Hyderabad',
//     isOpen: true,
//     logo: 'https://example.com/logos/lifestyle.png',
//     category: 'Fashion',
//     distance: '4.5 km',
//     rating: 4.6,
//     reviewCount: '3.5k+',
//     deliveryTime: '45-50 Mins',
//     discount: 'Upto 40% Off',
//   },
//   {
//     id: '8',
//     name: 'Reliance Trends',
//     location: 'Kukatpally, Hyderabad',
//     isOpen: false,
//     logo: 'https://example.com/logos/reliance.png',
//     category: 'Fashion',
//     distance: '7.2 km',
//     rating: 4.0,
//     reviewCount: '900+',
//     deliveryTime: '65-70 Mins',
//     discount: 'Upto 50% Off',
//   },
// ];
//   const handleRemoveStore = (storeId: string) => {
//     // Alert.alert(
//     //   'Remove Store',
//     //   'Are you sure you want to remove this store from your favorites?',
//     //   [
//     //     {text: 'Cancel', style: 'cancel'},
//     //     {
//     //       text: 'Remove',
//     //       style: 'destructive',
//     //       onPress: async () => {
//     //         try {
//     //           await axiosInstance.delete(`/user/stores/${storeId}`);
//     //           setStores(stores.filter(s => s.id !== storeId));
//     //           Alert.alert('Success', 'Store removed successfully');
//     //         } catch (error) {
//     //           console.error('Error removing store:', error);
//     //           Alert.alert('Error', 'Failed to remove store');
//     //         }
//     //       },
//     //     },
//     //   ],
//     // );
//     console.log("Handle reomve store")
// };

//   const renderStore = ({item}: {item: Store}) => (
//     <StoreCard
//       store={item}
//       onViewStore={() => handleViewStore(item)}
//       onRemoveStore={() => handleRemoveStore(item.id)}
//     />
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Header */}
//       <HeaderWithNoIcons title="My Stores" onBack={() => navigation.goBack()} />

//       {/* Content */}
//       {!loading ? (
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#FF6B6B" />
//         </View>
//       ) : stores.length === 0 ? (
//         <EmptyStoresState
//           onBrowseStores={() => navigation.navigate('Home')}
//         />
//       ) : (
//         <FlatList
//           data={stores}
//           renderItem={renderStore}
//           keyExtractor={item => item.id}
//           contentContainerStyle={styles.listContainer}
//           showsVerticalScrollIndicator={false}
//         />
//       )}
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFF',
//   },
  
  
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   listContainer: {
//     paddingHorizontal: 11,
//   },
// });

// export default MyStoresScreen;
// screens/MyStoresScreen.tsx
import React, { useCallback, useEffect } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import StoreCard, { Store } from '../components/MyStores/StoreCard';
import EmptyStoresState from '../components/MyStores/EmptyStoresState';
import HeaderWithNoIcons from '../components/Profile/HeaderWithNoIcons';
import { AppDispatch, RootState } from '../../../Store';
import {
  toggleBookmark,
  fetchBookmarks,
  selectBookmarkedStores,
  selectBookmarkLoading,
  selectBookmarkUpdating,
} from '../../../reduxSlices/bookmarkSlice';

const MyStoresScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();

  // canonical array of bookmarked stores (from slice)
  const stores = useSelector(selectBookmarkedStores);

  // loading flag for initial fetch
  const loading = useSelector((state: RootState) => state.bookmarks.loading);

  // optional: per-store updating flags if you want to disable remove while network op is in progress
  const isUpdating = useSelector((state: RootState) => state.bookmarks.updating);

  // ensure bookmarks are loaded on mount (if you already fetch them on login/app startup you can remove this)
  useEffect(() => {
    dispatch(fetchBookmarks());
  }, [dispatch]);

 const handleViewStore = useCallback((store: Store) => {
  navigation.navigate('HomeTab', {
    screen: 'StoreScreen',
    params: { storeId: store.id },
  });
}, [navigation]);


  const handleRemoveStore = useCallback((storeId: number | string) => {
    const sid = String(storeId);

    // prevent sending request if already updating for this store
    if (isUpdating && isUpdating[sid]) return;

    Alert.alert(
      'Remove Store',
      'Are you sure you want to remove this store from your favorites?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            // use toggleBookmark for remove; pass string id
            dispatch(toggleBookmark({ storeId: sid }));
          },
        },
      ]
    );
  }, [dispatch, isUpdating]);

  const renderStore = ({ item }: { item: Store }) => (
    <StoreCard
      store={item}
      onViewStore={() => handleViewStore(item)}
      onRemoveStore={() => handleRemoveStore(item.id)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithNoIcons title="My Stores" onBack={() => navigation.goBack()} />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
        </View>
      ) : stores.length === 0 ? (
        <EmptyStoresState onBrowseStores={() => navigation.navigate('Home')} />
      ) : (
        <FlatList
          data={stores}
          renderItem={renderStore}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContainer: { paddingHorizontal: 11 },
});

export default MyStoresScreen;
