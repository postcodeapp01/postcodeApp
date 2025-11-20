import React, {useEffect, useCallback} from 'react';
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

const getStatusInfo = (status?: string) => {
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

const getStoreLogo = (storeName?: string) => {
  const name = (storeName || '').toLowerCase();
  if (name.includes('max') || name.includes('zudio')) {
    return require('../../../sources/images/hm-b.png');
  }
  return null;
};

const MyOrdersScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders) || [];
  const loading = useSelector(selectOrdersLoading);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleOrderPress = useCallback(
    async (order: any) => {
      const orderId = String(order?.orderId ?? order?.id ?? '');
      if (!orderId) {
        Alert.alert('Invalid order', 'Unable to determine order id');
        return;
      }

      try {
        // fetch full order details (same as before)
        const fetched = await dispatch(fetchOrderById({orderId})).unwrap();

        // decide navigation target based on fetched order status (prefer backend truth)
        const status = (fetched?.orderStatus || fetched?.status || order?.orderStatus || '')
          .toString()
          .toUpperCase();

        if (status === 'DELIVERED') {
          navigation.navigate('OrderDetails', {orderId});
        } else {
          navigation.navigate('OrderTracking', {orderId});
        }
      } catch (err) {
        Alert.alert('Error', 'Failed to load order details');
      }
    },
    [dispatch, navigation],
  );

  const onMorePress = useCallback(
    (item: any) => {
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
                `Delete order #${item.orderNumber ?? item.orderId}? This action cannot be undone.`,
                [
                  {text: 'No', style: 'cancel'},
                  {
                    text: 'Yes, delete',
                    style: 'destructive',
                    onPress: async () => {
                      try {
                        dispatch(deleteOrder({orderId: String(item.orderId)}));
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
    },
    [dispatch],
  );

  const formatDate = useCallback((dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', {month: 'short'});
    const time = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    return `${day} ${month}, placed at ${time}`;
  }, []);

  const renderOrder = useCallback(
    ({item}: {item: any}) => {
      const statusInfo = getStatusInfo(item?.orderStatus);
      const storeLogos = (item?.storeGroups || []).map((sg: any) =>
        getStoreLogo(sg?.storeName),
      );

      // hide cancelled orders same as before
      if (String(statusInfo.text).toUpperCase() === 'CANCELLED') return null;

      return (
        <TouchableOpacity
          style={styles.orderCard}
          onPress={() => handleOrderPress(item)}
          activeOpacity={0.7}>
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

          <Text style={styles.orderNumber}>
            Order ID #{item?.orderNumber ?? item?.orderId}
          </Text>
          <Text style={styles.orderDate}>{formatDate(item?.placedAt)}</Text>

          <View style={styles.storeLogosContainer}>
            {storeLogos?.map((logo: any, index: number) => (
              <View key={String(index)} style={styles.logoContainer}>
                <Image
                  style={styles.storeLogo}
                  source={logo || require('../../../sources/images/hm-b.png')}
                />
              </View>
            ))}
          </View>
        </TouchableOpacity>
      );
    },
    [handleOrderPress, onMorePress, formatDate],
  );

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithNoIcons title="My Orders" onBack={() => navigation.goBack()} />

      {loading ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : orders.length === 0 ? (
        <EmptyOrdersState onTakeHome={() => navigation.navigate('Home')} />
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={item => String(item.orderId ?? item.id)}
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
  loader: {marginTop: 50},
  ordersList: {
    paddingHorizontal: 12,
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
    // gap isn't supported on all RN versions; use margin on children instead if needed
  },
  logoContainer: {
    width: 50,
    height: 50,
    marginRight: 10,
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
