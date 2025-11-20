
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
} from '../../../reduxSlices/bookmarkSlice';

const MyStoresScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();

  const stores = useSelector(selectBookmarkedStores);
  const loading = useSelector((state: RootState) => state.bookmarks.loading);
  const isUpdating = useSelector((state: RootState) => state.bookmarks.updating);
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
