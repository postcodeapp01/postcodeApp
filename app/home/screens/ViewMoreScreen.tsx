import React, {useMemo} from 'react';
import {View, Text, StyleSheet, FlatList, SafeAreaView} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import StoreCard from '../homePageComponents/NearbyStores/StoreCard';
import HeaderWithNoIcons from '../../userProfile/components/Profile/HeaderWithNoIcons';

type Store = {
  id?: string | number;
  _id?: string | number;
  name?: string;
  logo?: string | {uri: string} | number;
  distance?: number;
  distanceMeters?: number;
  distanceKm?: string;
  friendlyDistance?: string;
};

type RouteParams = {
  viewmorescreen: {
    stores?: Store[];
    previewLimit?: number;
    latitude?: number;
    longitude?: number;
    distance?: number;
  };
};

const ViewMoreScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RouteParams, 'viewmorescreen'>>();

  const {stores = [], previewLimit = 1} = route.params ?? {};

  const remainingStores = useMemo(() => {
    if (!Array.isArray(stores) || stores.length === 0) return [];
    const limit = Math.max(0, Number(previewLimit) || 0);
    return stores.slice(limit);
  }, [stores, previewLimit]);

  const keyExtractor = (item: Store, index: number) =>
    String(item.id ?? item._id ?? index);

  const renderItem = ({item}: {item: Store}) => {
    return (
      <View style={styles.cardWrapper}>
        <StoreCard
          store={item}
          onPress={() =>
            navigation.navigate(
              'StoreScreen' as never,
              {storeId: item.id} as never,
            )
          }
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithNoIcons
        title="All Nearby Stores"
        onBack={() => navigation.goBack()}
      />

      {remainingStores.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No more stores to show.</Text>
        </View>
      ) : (
        <FlatList
          data={remainingStores}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default ViewMoreScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  listContent: {
    padding: 6,
    paddingBottom: 32,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardWrapper: {
    flex: 1,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    color: '#666',
    fontSize: 15,
  },
});
