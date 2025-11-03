// import React, { useEffect, useState, useMemo } from 'react';
// import {
//   View,
//   Text,
//   SafeAreaView,
//   TouchableOpacity,
//   StyleSheet,
//   TextInput,
//   FlatList,
//   ActivityIndicator,
//   Image,
//   Alert,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import EmptyOrdersState from '../components/MyOrders/EmptyOrderState';
// import axiosInstance from '../../../config/Api';

// type Driver = {
//   driverId: string | null;
//   lat: number | null;
//   lng: number | null;
//   status: string | null;
// };

// type OrderItem = {
//   orderItemId: string;
//   productId: string;
//   productName: string;
//   quantity: number;
//   price: number;
//   discount: number;
//   finalPrice: number;
//   itemStatus: string;
//   brand: string | null;
//   productImageUrl: string | null;
//   colorImage: string | null;
//   size?: string | null;
//   color?: string | null;
//   driver: Driver;
// };

// type StoreGroup = {
//   storeGroupId: string;
//   storeOrderNumber: string;
//   storeId: string | null;
//   storeName: string | null;
//   storeSubtotal: number;
//   storeTotal: number;
//   storeStatus: string;
//   trackingNumber?: string | null;
//   items: OrderItem[];
// };

// type Order = {
//   orderId: string;
//   orderNumber: string;
//   orderStatus: string;
//   placedAt: string;
//   storeGroups: StoreGroup[];
// };

// const mapStatusToBadge = (storeStatus: string) => {
//   switch ((storeStatus || '').toUpperCase()) {
//     case 'DELIVERED': return { text: 'Delivered', color: '#16A34A' };
//     case 'SHIPPED': return { text: 'Shipped', color: '#0EA5E9' };
//     case 'OUT_FOR_DELIVERY': return { text: 'Out for delivery', color: '#F59E0B' };
//     case 'CANCELLED': return { text: 'Cancelled', color: '#EF4444' };
//     case 'PACKED': return { text: 'Packed', color: '#7C3AED' };
//     case 'CONFIRMED': return { text: 'Confirmed', color: '#059669' };
//     default: return { text: storeStatus || 'Processing', color: '#6B7280' };
//   }
// };

// const MyOrdersScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(1);

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       const res = await axiosInstance.get(`/orders`);
//       const data: Order[] = res.data.data ?? [];
//       // console.log("Data getting from the backend",data);
//       setOrders(data);
//     } catch (error) {
//       console.log('Error fetching orders:', error);
//       Alert.alert('Error', 'Failed to fetch orders');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders(page);
//   }, [page]);

//   // Flatten for searching: we want to filter order if any storeGroup or item matches query
//   const filteredOrders = useMemo(() => {
//     const q = searchQuery.trim().toLowerCase();
//     if (!q) return orders;

//     return orders.filter(order => {
//       if (order.orderNumber?.toLowerCase().includes(q)) return true;
//       // search store names and product/brand names
//       return order.storeGroups.some(sg => {
//         if (sg.storeName && sg.storeName.toLowerCase().includes(q)) return true;
//         return sg.items.some(it =>
//           (it.productName ?? '').toLowerCase().includes(q) ||
//           (it.brand ?? '').toLowerCase().includes(q)
//         );
//       });
//     });
//   }, [orders]);

//   const handleTrackStoreGroup = (order: Order, storeGroup: StoreGroup) => {
//     // Pass orderId + storeGroupId so tracking screen can show per-store tracking
//     navigation.navigate('OrderTracking', { order: order, storeGroup: storeGroup });
//   };

//   const handleReorderItem = (item: OrderItem) => {
//     // navigate to product page
//     navigation.navigate('ProductDetails', { productId: Number(item.productId) });
//   };

//   const handleRateItem = (item: OrderItem) => {
//     navigation.navigate('OrderRating', { orderItemId: item.orderItemId });
//   };

//   const renderOrderItemRow = (it: OrderItem) => (
//     <View style={styles.itemRow}>
//       <Image source={ it.productImageUrl ? { uri: it.productImageUrl } : require('../../../sources/images/c1.png') } style={styles.itemImage} />
//       <View style={styles.itemInfo}>
//         <Text style={styles.itemName} numberOfLines={2}>{it.productName}</Text>
//         <Text style={styles.itemBrand}>{it.brand ?? ''}</Text>
//         <View style={styles.priceRow}>
//           <Text style={styles.currentPrice}>₹{it.finalPrice.toFixed(2)}</Text>
//           {it.price !== it.finalPrice && <Text style={styles.originalPrice}>₹{it.price.toFixed(2)}</Text>}
//           {!!it.discount && <Text style={styles.discountText}>{it.discount}%</Text>}
//         </View>
//         <Text style={styles.qtyText}>Qty: {it.quantity}</Text>
//       </View>

//       <View style={styles.itemActions}>
//         <TouchableOpacity style={styles.smallButton} onPress={() => handleReorderItem(it)}>
//           <Text style={styles.smallButtonText}>Reorder</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={[styles.smallButton, { marginTop: 8 }]} onPress={() => handleRateItem(it)}>
//           <Text style={styles.smallButtonText}>Rate</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   const renderStoreGroup = (order: Order, sg: StoreGroup) => {
//     const badge = mapStatusToBadge(sg.storeStatus);
//     return (
//       <View key={sg.storeGroupId} style={styles.storeGroup}>
//         <View style={styles.storeHeader}>
//           <View style={{ flex: 1 }}>
//             <Text style={styles.storeName}>{sg.storeName ?? `Store ${sg.storeId ?? ''}`}</Text>
//             <Text style={styles.storeOrderNumber}>#{sg.storeOrderNumber}</Text>
//           </View>
//           <View style={styles.storeMeta}>
//             <View style={[styles.statusBadge, { backgroundColor: badge.color + '22', borderColor: badge.color }]}>
//               <Text style={[styles.statusBadgeText, { color: badge.color }]}>{badge.text}</Text>
//             </View>
//             <TouchableOpacity style={styles.trackButton} onPress={() => handleTrackStoreGroup(order, sg)}>
//               <Text style={styles.trackButtonText}>Track</Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* items list */}
//         {sg.items.map(it => (
//           <View key={it.orderItemId}>
//             {renderOrderItemRow(it)}
//           </View>
//         ))}

//         {/* store totals */}
//         <View style={styles.storeFooter}>
//           <Text style={styles.storeTotalText}>Subtotal: ₹{sg.storeSubtotal.toFixed(2)}</Text>
//           <Text style={styles.storeTotalText}>Total: ₹{sg.storeTotal.toFixed(2)}</Text>
//         </View>
//       </View>
//     );
//   };

//   const renderOrder = ({ item }: { item: Order }) => {
//     return (
//       <View style={styles.orderCard}>
//         <View style={styles.orderHeader}>
//           <View>
//             <Text style={styles.orderNumber}>Order #{item.orderNumber}</Text>
//             <Text style={styles.orderDate}>{new Date(item.placedAt).toLocaleString()}</Text>
//           </View>
//           <Text style={styles.orderStatusText}>{item.orderStatus}</Text>
//         </View>

//         {/* store groups */}
//         <View style={styles.orderBody}>
//           {item.storeGroups.map(sg => renderStoreGroup(item, sg))}
//         </View>
//       </View>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
//           <Icon name="arrow-back" size={24} color="#282C3F" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>My Orders</Text>
//         <View style={styles.placeholder} />
//       </View>

//       {/* Content */}
//       {loading ? (
//         <ActivityIndicator size="large" style={{ marginTop: 50 }} />
//       ) : filteredOrders.length === 0 ? (
//         <EmptyOrdersState onTakeHome={() => navigation.navigate('Home')} />
//       ) : (
//         <FlatList
//           data={filteredOrders}
//           renderItem={renderOrder}
//           keyExtractor={(o) => o.orderId}
//           contentContainerStyle={styles.ordersList}
//           showsVerticalScrollIndicator={false}
//           ItemSeparatorComponent={() => <View style={styles.separator} />}
//         />
//       )}
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//      flex: 1, backgroundColor: '#F8FAFC' },
//   header: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#fff' },
//   backButton: { padding: 6 },
//   headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '700', color: '#111' },
//   placeholder: { width: 36 },
//   searchContainer: { padding: 12, backgroundColor: '#F8FAFC' },
//   searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 10, height: 44 },
//   searchIcon: { marginRight: 8 },
//   searchInput: { flex: 1, fontSize: 14, color: '#111' },

//   ordersList: { padding: 12, paddingBottom: 40 },
//   orderCard: { backgroundColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 12, overflow: 'hidden' },
//   orderHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
//   orderNumber: { fontWeight: '700' },
//   orderDate: { color: '#6B7280', fontSize: 12 },
//   orderStatusText: { color: '#6B7280', fontSize: 12, alignSelf: 'center' },

//   storeGroup: { marginTop: 8, borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 8 },
//   storeHeader: { flexDirection: 'row', alignItems: 'center' },
//   storeName: { fontWeight: '700' },
//   storeOrderNumber: { color: '#6B7280', fontSize: 12 },
//   storeMeta: { alignItems: 'flex-end' },
//   statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, borderWidth: 1 },
//   statusBadgeText: { fontSize: 12, fontWeight: '600' },
//   trackButton: { marginTop: 8, backgroundColor: '#EEF2FF', paddingHorizontal: 8, paddingVertical: 6, borderRadius: 8 },
//   trackButtonText: { color: '#3730A3', fontWeight: '700' },

//   itemRow: { flexDirection: 'row', paddingVertical: 10, alignItems: 'center' },
//   itemImage: { width: 68, height: 68, borderRadius: 8, backgroundColor: '#fff', marginRight: 10 },
//   itemInfo: { flex: 1 },
//   itemName: { fontWeight: '600' },
//   itemBrand: { color: '#6B7280', fontSize: 12, marginTop: 4 },
//   priceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
//   currentPrice: { fontWeight: '700', marginRight: 8 },
//   originalPrice: { textDecorationLine: 'line-through', color: '#6B7280', marginRight: 8 },
//   discountText: { color: '#EF4444', fontWeight: '600' },
//   qtyText: { color: '#6B7280', fontSize: 12 },

//   itemActions: { marginLeft: 8, alignItems: 'flex-end' },
//   smallButton: { backgroundColor: '#EEF2FF', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8 },
//   smallButtonText: { color: '#3730A3', fontWeight: '700' },

//   storeFooter: { flexDirection: 'row', justifyContent: 'flex-end', paddingTop: 8 },
//   storeTotalText: { fontWeight: '700', marginLeft: 12 },

//   separator: { height: 12 },
// });

// export default MyOrdersScreen;

// import React, { useEffect, useState, useMemo } from 'react';
// import {
//   View,
//   Text,
//   SafeAreaView,
//   TouchableOpacity,
//   StyleSheet,
//   FlatList,
//   ActivityIndicator,
//   Image,
//   Alert,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import EmptyOrdersState from '../components/MyOrders/EmptyOrderState';
// import axiosInstance from '../../../config/Api';

// type Driver = {
//   driverId: string | null;
//   lat: number | null;
//   lng: number | null;
//   status: string | null;
// };

// type OrderItem = {
//   orderItemId: string;
//   productId: string;
//   productName: string;
//   quantity: number;
//   price: number;
//   discount: number;
//   finalPrice: number;
//   itemStatus: string;
//   brand: string | null;
//   productImageUrl: string | null;
//   colorImage: string | null;
//   size?: string | null;
//   color?: string | null;
//   driver: Driver;
// };

// type StoreGroup = {
//   storeGroupId: string;
//   storeOrderNumber: string;
//   storeId: string | null;
//   storeName: string | null;
//   storeSubtotal: number;
//   storeTotal: number;
//   storeStatus: string;
//   trackingNumber?: string | null;
//   items: OrderItem[];
// };

// type Order = {
//   orderId: string;
//   orderNumber: string;
//   orderStatus: string;
//   placedAt: string;
//   storeGroups: StoreGroup[];
// };

// const getStatusInfo = (status: string) => {
//   const statusUpper = (status || '').toUpperCase();
//   switch (statusUpper) {
//     case 'DELIVERED':
//       return { text: 'DELIVERED', color: '#16A34A' };
//     case 'CANCELLED':
//       return { text: 'CANCELLED', color: '#EF4444' };
//     case 'SHIPPED':
//     case 'OUT_FOR_DELIVERY':
//       return { text: 'ON THE WAY', color: '#F59E0B' };
//     case 'CONFIRMED':
//     case 'PACKED':
//     case 'PROCESSING':
//       return { text: 'ON THE WAY', color: '#F59E0B' };
//     default:
//       return { text: status || 'Processing', color: '#6B7280' };
//   }
// };

// const getStoreLogo = (storeName: string) => {
//   const name = (storeName || '').toLowerCase();
//   if (name.includes('max')) {
//     return require('../../../sources/images/hm-b.png'); // Add your max logo
//   }
//   if (name.includes('zudio')) {
//     return require('../../../sources/images/hm-b.png'); // Add your zudio logo
//   }
//   // Default placeholder
//   return null;
// };

// const MyOrdersScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       const res = await axiosInstance.get(`/orders`);
//       const data: Order[] = res.data.data ?? [];
//       console.log("order data from the backend",data)
//       setOrders(data);
//     } catch (error) {
//       console.log('Error fetching orders:', error);
//       Alert.alert('Error', 'Failed to fetch orders');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const handleOrderPress = (order: Order) => {
//     // console.log("data sendig to oreder tracking",order)
//     navigation.navigate('OrderTracking', { order });
//   };

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     const day = date.getDate();
//     const month = date.toLocaleDateString('en-US', { month: 'short' });
//     const time = date.toLocaleTimeString('en-US', {
//       hour: 'numeric',
//       minute: '2-digit',
//       hour12: true
//     });
//     return `${day} ${month}, placed at ${time}`;
//   };

//   const renderOrder = ({ item }: { item: Order }) => {
//     const statusInfo = getStatusInfo(item.orderStatus);
//     const storeLogos = item.storeGroups.map(sg => getStoreLogo(sg.storeName || ''));

//     return (
//       <TouchableOpacity
//         style={styles.orderCard}
//         onPress={() => handleOrderPress(item)}
//         activeOpacity={0.7}>

//         {/* Status Row */}
//         <View style={styles.statusRow}>
//           <Text style={styles.statusPrefix}>Your order is </Text>
//           <Text style={[styles.statusText, { color: statusInfo.color }]}>
//             {statusInfo.text}
//           </Text>
//           <TouchableOpacity style={styles.moreButton}>
//             <Icon name="more-vert" size={20} color="#999" />
//           </TouchableOpacity>
//         </View>

//         {/* Order Info */}
//         <Text style={styles.orderNumber}>
//           Order ID #{item.orderNumber}
//         </Text>
//         <Text style={styles.orderDate}>
//           {formatDate(item.placedAt)}
//         </Text>

//         {/* Store Logos */}
//         <View style={styles.storeLogosContainer}>
//           {storeLogos.map((logo, index) => (
//             <View key={index} style={styles.logoContainer}>
//               {/* {logo ? ( */}
//                 <Image style={styles.storeLogo} source={require('../../../sources/images/hm-b.png')} />
//               {/* ) : (
//                 <View style={styles.logoPlaceholder}>
//                   <Text style={styles.logoText}>
//                     {item.storeGroups[index]?.storeName?.charAt(0) || 'S'}
//                   </Text>
//                 </View>
//               )} */}
//             </View>
//           ))}
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity
//           style={styles.backButton}
//           onPress={() => navigation.goBack()}>
//           <Icon name="arrow-back" size={24} color="#000" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>My Orders</Text>
//         <View style={styles.placeholder} />
//       </View>

//       {/* Content */}
//       {loading ? (
//         <ActivityIndicator size="large" style={styles.loader} />
//       ) : orders.length === 0 ? (
//         <EmptyOrdersState onTakeHome={() => navigation.navigate('Home')} />
//       ) : (
//         <FlatList
//           data={orders}
//           renderItem={renderOrder}
//           keyExtractor={(item) => item.orderId}
//           contentContainerStyle={styles.ordersList}
//           showsVerticalScrollIndicator={false}
//           ItemSeparatorComponent={() => <View style={styles.separator} />}
//         />
//       )}
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F5F5F5',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E5E5',
//   },
//   backButton: {
//     padding: 4,
//   },
//   headerTitle: {
//     flex: 1,
//     textAlign: 'center',
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#000',
//     marginRight: 32, // Compensate for back button
//   },
//   placeholder: {
//     width: 32,
//   },
//   loader: {
//     marginTop: 50,
//   },
//   ordersList: {
//     padding: 16,
//     paddingBottom: 40,
//   },
//   orderCard: {
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     padding: 16,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 1,
//     },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 1,
//   },
//   statusRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   statusPrefix: {
//     fontSize: 14,
//     color: '#666',
//   },
//   statusText: {
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   moreButton: {
//     marginLeft: 'auto',
//     padding: 4,
//   },
//   orderNumber: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#000',
//     marginBottom: 4,
//   },
//   orderDate: {
//     fontSize: 13,
//     color: '#666',
//     marginBottom: 16,
//   },
//   storeLogosContainer: {
//     flexDirection: 'row',
//     gap: 8,
//   },
//   logoContainer: {
//     width: 32,
//     height: 32,
//   },
//   storeLogo: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: '#F0F0F0',
//   },
//   logoPlaceholder: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: '#E0E0E0',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   logoText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#666',
//   },
//   separator: {
//     height: 12,
//   },
// });

// export default MyOrdersScreen;

import React, {useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useSelector, useDispatch} from 'react-redux';
import EmptyOrdersState from '../components/MyOrders/EmptyOrderState';
import {
  deleteOrder,
  fetchOrderById,
  fetchOrders,
  selectOrders,
  selectOrdersLoading,
} from '../../../reduxSlices/orderSlice';
import HeaderWithNoIcons from '../components/Profile/HeaderWithNoIcons';

const getStatusInfo = (status: string) => {
  const statusUpper = (status || '').toUpperCase();
  switch (statusUpper) {
    case 'DELIVERED':
      return {text: 'DELIVERED', color: '#16A34A'};
    case 'CANCELLED':
      return {text: 'CANCELLED', color: '#EF4444'};
    case 'SHIPPED':
    case 'OUT_FOR_DELIVERY':
      return {text: 'ON THE WAY', color: '#F59E0B'};
    case 'CONFIRMED':
    case 'PACKED':
    case 'PROCESSING':
      return {text: 'ON THE WAY', color: '#F59E0B'};
    default:
      return {text: status || 'Processing', color: '#6B7280'};
  }
};

const getStoreLogo = (storeName: string) => {
  const name = (storeName || '').toLowerCase();
  if (name.includes('max')) {
    return require('../../../sources/images/hm-b.png');
  }
  if (name.includes('zudio')) {
    return require('../../../sources/images/hm-b.png');
  }
  return null;
};

const MyOrdersScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const dispatch = useDispatch();

  const orders = useSelector(selectOrders);
  const loading = useSelector(selectOrdersLoading);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleOrderPress = async (order: any) => {
    try {
      await dispatch(fetchOrderById({orderId: String(order.orderId)})).unwrap();
      navigation.navigate('OrderTracking', {orderId: String(order.orderId)});
    } catch (err) {
      Alert.alert('Failed to load order details');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', {month: 'short'});
    const time = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    return `${day} ${month}, placed at ${time}`;
  };

  const onMorePress = (item: any) => {
    // simple cross-platform popup via Alert
    Alert.alert(
      'Order actions',
      undefined,
      [
        {
          text: 'Delete Order',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Confirm delete',
              `Delete order #${
                item.orderNumber ?? item.orderId
              }? This action cannot be undone.`,
              [
                {text: 'No', style: 'cancel'},
                {
                  text: 'Yes, delete',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      // dispatch thunk
                      dispatch(deleteOrder({orderId: String(item.orderId)}));
                      // optionally show a toast or feedback here
                    } catch (err) {
                      console.warn('Delete failed', err);
                    }
                  },
                },
              ],
              {cancelable: true},
            );
          },
        },
        {text: 'Cancel', style: 'cancel'},
      ],
      {cancelable: true},
    );
  };
  const renderOrder = ({item}: {item: any}) => {
    const statusInfo = getStatusInfo(item.orderStatus);
    const storeLogos = item.storeGroups?.map((sg: any) =>
      getStoreLogo(sg.storeName || ''),
    );

    // 👇 Skip cancelled orders
    if (
      statusInfo.text === 'CANCELLED' ||
      statusInfo.text === 'cancelled' ||
      statusInfo.text === 'Cancelled'
    )
      return null;

    return (
      <TouchableOpacity
        style={styles.orderCard}
        onPress={() => handleOrderPress(item)}
        activeOpacity={0.7}>
        {/* Status Row */}
        <View style={styles.statusRow}>
          <Text style={styles.statusPrefix}>Your order is </Text>
          <Text style={[styles.statusText, {color: statusInfo.color}]}>
            {statusInfo.text}
          </Text>
          <TouchableOpacity
            style={styles.moreButton}
            onPress={() => onMorePress(item)}>
            <Icon name="more-vert" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Order Info */}
        <Text style={styles.orderNumber}>Order ID #{item.orderNumber}</Text>
        <Text style={styles.orderDate}>{formatDate(item.placedAt)}</Text>

        {/* Store Logos */}
        <View style={styles.storeLogosContainer}>
          {storeLogos?.map((logo: any, index: number) => (
            <View key={index} style={styles.logoContainer}>
              <Image
                style={styles.storeLogo}
                source={logo || require('../../../sources/images/hm-b.png')}
              />
            </View>
          ))}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <HeaderWithNoIcons title="My Orders" onBack={() => navigation.goBack()} />
      {/* Content */}
      {loading ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : orders.length === 0 ? (
        <EmptyOrdersState onTakeHome={() => navigation.navigate('Home')} />
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={item => item.orderId}
          contentContainerStyle={styles.ordersList}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  // loader: {marginTop: 50},
  ordersList: {
    paddingHorizontal: 12,
    // paddingBottom: 40,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusPrefix: {
    fontSize: 16,
    fontWeight: '500',
    color: '#222',
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '500',
  },
  moreButton: {
    marginLeft: 'auto',
    padding: 4,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 10,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  orderDate: {
    fontSize: 16,
    fontWeight: '400',
    color: '#222',
    marginBottom: 10,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  storeLogosContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  logoContainer: {
    width: 50,
    height: 50,
  },
  storeLogo: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: '#F0F0F0',
  },
  separator: {height: 12},
});

export default MyOrdersScreen;
