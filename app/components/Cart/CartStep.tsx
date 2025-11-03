// import React, {useEffect, useMemo} from 'react';
// import {View, FlatList, StyleSheet, Text, RefreshControl} from 'react-native';
// import CartItem, {CartItemType} from './CartItem';
// import CartSummary from './CartSummary';
// import NearbyStores from '../../home/components/NearbyStores/NearbyStores';
// import StoreProducts from './StoreProducts';
// import NearbyCartStores from './NearbyCartStores';
// import {store} from '../../../Store';

// interface CartStepProps {
//   cartData: any;
//   storeId?: number | string | null;
//   storeName?: string;
//   onUpdateItem: (
//     cartId: string,
//     qty: number,
//     size?: string,
//     colorId?: string,
//   ) => void;
//   onRemoveItem: (cartId: string, productId?: string) => void;
//   onNext: () => void;
//   onItemAdded?: (item: CartItemType) => void;
//   onStoresChange?: (stores: any[]) => void;
//   refreshing?: boolean;
// }

// const CartStep: React.FC<CartStepProps> = ({
//   cartData,
//   storeId,
//   onUpdateItem,
//   onRemoveItem,
//   onNext,
//   onItemAdded,
//   onStoresChange,
//   refreshing = false,
// }) => {
//   console.log('storeid', cartData.storeGroups);
//   const [extraStores, setExtraStores] = React.useState<any[]>([]);

//   useEffect(() => {
//     console.log('Cart items updated:', (cartData?.items || []).length);
//   }, [cartData?.items, cartData?.items?.length]);
//   const storesToRender = useMemo(() => {
//     const groups = Array.isArray(cartData?.storeGroups)
//       ? cartData.storeGroups
//       : [];

//     let baseStores = [];
//     if (storeId != null) {
//       baseStores = groups.filter(
//         (g: any) => String(g.store_id) === String(storeId),
//       );
//     } else {
//       baseStores = groups.filter(
//         (g: any) => Array.isArray(g.items) && g.items.length > 0,
//       );
//     }
//     const mergedStores = [...baseStores];
//     extraStores.forEach(extra => {
//       if (!mergedStores.some(s => s.store_id === extra.store_id)) {
//         mergedStores.push(extra);
//       }
//     });

//     return mergedStores;
//   }, [cartData?.storeGroups, storeId, extraStores]);
//   const renderedStoreIds = storesToRender.map(s => s.store_id);

//   const listKey = `stores-${storesToRender.length}-${
//     (cartData?.items || []).length
//   }`;
//   useEffect(() => {
//     setExtraStores([]);
//   }, [storeId]);
//   useEffect(() => {
//     if (typeof onStoresChange === 'function') {
//       onStoresChange(storesToRender);
//     }
//   }, [storesToRender]);
//   const renderStore = ({item: store}: {item: any}) => {
//     return (
//       <View style={styles.storeBlock}>
//         <View style={styles.storeHeaderRow}>
//           <Text style={styles.storeTitle}>
//             {store.store_name ?? `Store ${store.store_id}`}
//           </Text>
//           <Text style={styles.itemCount}>
//             {store.items?.length ?? 0} item
//             {(store.items?.length ?? 0) > 1 ? 's' : ''}
//           </Text>
//         </View>

//         {Array.isArray(store.items) && store.items.length > 0 ? (
//           <View style={styles.itemsList}>
//             {store.items.map((it: CartItemType) => (
//               <CartItem
//                 key={`${it.cartId}-${it.productId || ''}`}
//                 item={it}
//                 onQtyChange={qty => onUpdateItem(it.cartId.toString(), qty)}
//                 onRemove={() =>
//                   onRemoveItem(it.cartId.toString(), it?.productId?.toString())
//                 }
//               />
//             ))}
//           </View>
//         ) : null}
//       </View>
//     );
//   };
//   console.log('stores to render', storesToRender);
//   return (
//     <View style={styles.container}>
//       {storesToRender.length > 0 && (
//         <NearbyCartStores
//           currentStore={storesToRender[0]}
//           allStores={cartData.storeGroups}
//           renderedStoreIds={renderedStoreIds}
//           onAddStores={stores => {
//             console.log(
//               '[CartStep] onAddStores called. stores:',
//               stores.map(s => s.store_id),
//             );
//             setExtraStores(prev => {
//               const newIds = stores.map(s => s.store_id);
//               const merged = [
//                 ...prev.filter(p => !newIds.includes(p.store_id)),
//                 ...stores,
//               ];
//               console.log(
//                 '[CartStep] updated extraStores:',
//                 merged.map(s => s.store_id),
//               );
//               return merged;
//             });
//           }}
//         />
//       )}

//       <FlatList
//         key={listKey}
//         data={storesToRender}
//         keyExtractor={(store: any) => String(store.store_id)}
//         renderItem={renderStore}
//         contentContainerStyle={styles.listContainer}
//         removeClippedSubviews={false}
//         extraData={[cartData?.items, cartData?.storeGroups]}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={() => {}} // parent handles refresh
//             colors={['#FF6B6B']}
//           />
//         }
//         showsVerticalScrollIndicator={false}
//         ListFooterComponent={
//           <>
//             <StoreProducts
//               key={`store-products-${storeId}-${
//                 (cartData?.items || []).length
//               }`}
//               storeId={storeId ?? cartData?.items?.[0]?.store_id ?? null}
//               existingItems={cartData?.items ?? []}
//               onAddSuccess={onItemAdded}
//             />
//             <NearbyStores
//               distance={1}
//               title="Add Items with no extra delivery charges"
//               latitude={storesToRender[0].store_latitude}
//               longitude={storesToRender[0].store_longitude}
//             />
//           </>
//         }
//         ListEmptyComponent={
//           <View style={{padding: 16}}>
//             <Text style={{color: '#666'}}>No items in the cart yet.</Text>
//           </View>
//         }
//       />

//       <CartSummary
//         total={cartData?.total}
//         subtotal={cartData?.subtotal}
//         deliveryFee={cartData?.deliveryFee}
//         buttonText="Review Order"
//         onConfirm={onNext}
//       />
//     </View>
//   );
// };

// export default CartStep;
// const styles = StyleSheet.create({
//   container: {flex: 1, backgroundColor: '#F8F9FA'},
//   storeBlock: {marginBottom: 12},
//   storeHeaderRow: {
//     backgroundColor: '#FFF',
//     padding: 12,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     borderBottomWidth: 1,
//     borderBottomColor: '#E9ECEF',
//   },
//   storeTitle: {fontSize: 16, fontWeight: '700'},
//   itemCount: {fontSize: 13, color: '#666'},
//   itemsList: {paddingHorizontal: 8, paddingTop: 8},
//   listContainer: {paddingBottom: 100},
// });


import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  RefreshControl,
} from 'react-native';
import CartItem, { CartItemType } from './CartItem';
import CartSummary from './CartSummary';
import NearbyCartStores from './NearbyCartStores';
import StoreProducts from './StoreProducts';
import NearbyStores from '../../home/components/NearbyStores/NearbyStores';
import StoreAndProducts from './StoreAndProducts';

interface CartStepProps {
  cartData: {
    items: CartItemType[];
    subtotal?: number;
    deliveryFee?: number;
    total?: number;
    storeGroups?: any[];
    store_name?: string;
  };
  storeId?: number | string | null;
  storeName?: string;
  onUpdateItem: (
    cartId: string,
    qty: number,
    size?: string,
    colorId?: string,
  ) => void;
  onRemoveItem: (cartId: string, productId?: string) => void;
  onNext: () => void;
  refreshing?: boolean;
  onStoresChange?: (stores: any[]) => void;
  onItemAdded?: (item: CartItemType) => void;
  storeGroups?: any[];
}

const CartStep: React.FC<CartStepProps> = ({
  cartData,
  storeId,
  storeName,
  onUpdateItem,
  onRemoveItem,
  onNext,
  refreshing = false,
  onStoresChange,
  onItemAdded,
  storeGroups,
}) => {
  const [extraStores, setExtraStores] = useState<any[]>([]);

  
  // Pick the active store group for this step
  const selectedStoreGroup = useMemo(() => {
    if (storeId != null) {
      return storeGroups.find(
        g => String(g.store_id) === String(storeId),
      );
    }
    return null;
  }, [storeId, storeGroups]);
  const storesToRender = useMemo(() => {
    if (!selectedStoreGroup) return [];
    const merged = [selectedStoreGroup, ...extraStores.filter(
      s => s.store_id !== selectedStoreGroup.store_id,
    )];
    return merged;
  }, [selectedStoreGroup, extraStores]);

  useEffect(() => {
    if (typeof onStoresChange === 'function') {
      onStoresChange(storesToRender);
    }
  }, [storesToRender]);

  const handleAddStores = (stores: any[]) => {
    setExtraStores(prev => {
      const newIds = stores.map(s => s.store_id);
      const merged = [
        ...prev.filter(p => !newIds.includes(p.store_id)),
        ...stores,
      ];
      return merged;
    });
  };
   const handleRemoveStores = (storeIds: number[]) => {
    // remove store groups from cart state
    setExtraStores(prev => prev.filter(s => !storeIds.includes(s.store_id)));
    // If using redux, dispatch an action to remove store items from cart there
    // dispatch(removeStoreFromCart(storeIds[0]));
  };

  const renderStore = ({ item: store }: { item: any }) => (
    <StoreAndProducts store={store}/>
  );

  if (!selectedStoreGroup) {
    return (
      <View style={{ padding: 20 }}>
        <Text>No store data found for this cart.</Text>
      </View>
    );
  }

  const renderedStoreIds = storesToRender.map(s => s.store_id);
  return (
    <View style={styles.container}>
      {/* Top Store Toggle (NearbyCartStores) */}
      <NearbyCartStores
        currentStore={selectedStoreGroup}
        allStores={storeGroups}
        renderedStoreIds={renderedStoreIds}
        onAddStores={handleAddStores}
        onRemoveStores={handleRemoveStores}
      />

      {/* Cart List */}
      <FlatList
        data={storesToRender}
        keyExtractor={store => String(store.store_id)}
        renderItem={renderStore}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {}}
            colors={['#FF6B6B']}
          />
        }
        ListFooterComponent={
          <>
            <StoreProducts
              key={`store-products-${storeId}-${cartData?.items?.length ?? 0}`}
              storeId={storeId ?? selectedStoreGroup.store_id}
              existingItems={cartData?.items ?? []}
              onAddSuccess={onItemAdded}
              title={selectedStoreGroup.store_name}            />
            <NearbyStores
              distance={1}
              title="Add Items with no extra delivery charges"
              latitude={selectedStoreGroup.store_latitude}
              longitude={selectedStoreGroup.store_longitude}
            />
          </>
        }
        ListEmptyComponent={
          <View style={{ padding: 16 }}>
            <Text style={{ color: '#666' }}>No items in the cart yet.</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Cart Summary */}
      <CartSummary
        total={selectedStoreGroup.total ?? cartData.total}
        subtotal={selectedStoreGroup.subtotal ?? cartData.subtotal}
        deliveryFee={selectedStoreGroup.deliveryFee ?? cartData.deliveryFee}
        buttonText="Review Order"
        onConfirm={onNext}
      />
    </View>
  );
};

export default CartStep;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  storeBlock: { marginBottom: 12 },
  storeContainer: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  storeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8F9FA',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  storeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#58c24dff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  storeIconText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  itemCount: {
    fontSize: 13,
    color: '#666',
    fontWeight: '400',
  },
  itemsList: {
    backgroundColor: '#fff',
  },
  storeHeaderRow: {
    backgroundColor: '#FFF',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  storeTitle: { fontSize: 16, fontWeight: '700' ,color: '#000'},
  // itemCount: { fontSize: 13, color: '#666' },
  // itemsList: { paddingHorizontal: 8, paddingTop: 8 },
  listContainer: { paddingBottom: 100 },
});
