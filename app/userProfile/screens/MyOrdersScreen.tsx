import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import EmptyOrdersState from '../components/MyOrders/EmptyOrderState';
import OrderCard from '../components/MyOrders/OrderCard';

type Order = {
  id: string;
  productName: string;
  brand: string;
  imageUrl: string;
  currentPrice: number;
  originalPrice: number;
  discount: number;
  size: string;
  orderDate: string;
  status: 'delivered' | 'shipped' | 'processing' | 'cancelled';
  trackingStatus: string;
  productRating: number;
  deliveryRating: number;
  hasReordered: boolean;
};

type Props = {
  navigation: any;
};

const MyOrdersScreen: React.FC<Props> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Toggle this to test empty/filled states
  const [hasOrders] = useState(true); // Change to false to see empty state

  const dummyOrders: Order[] = [
    {
      id: '1',
      productName: 'Women V-Neck Regular Fit Top',
      brand: 'Max',
      imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop',
      currentPrice: 400,
      originalPrice: 1340,
      discount: 70,
      size: 'XS',
      orderDate: '13 Aug, 1:30PM',
      status: 'delivered',
      trackingStatus: 'Delivered',
      productRating: 4,
      deliveryRating: 5,
      hasReordered: false,
    },
    {
      id: '2',
      productName: 'Women V-Neck Regular Fit Top',
      brand: 'Max',
      imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop',
      currentPrice: 400,
      originalPrice: 1340,
      discount: 70,
      size: 'XS',
      orderDate: '10 Aug, 2:15PM',
      status: 'delivered',
      trackingStatus: 'Delivered',
      productRating: 5,
      deliveryRating: 4,
      hasReordered: true,
    },
    {
      id: '3',
      productName: 'Cotton Casual Shirt',
      brand: 'Levis',
      imageUrl: 'https://images.unsplash.com/photo-1602810316693-3667d34f56d0?w=400&h=600&fit=crop',
      currentPrice: 800,
      originalPrice: 1200,
      discount: 33,
      size: 'M',
      orderDate: '05 Aug, 11:45AM',
      status: 'shipped',
      trackingStatus: 'Out for Delivery',
      productRating: 0,
      deliveryRating: 0,
      hasReordered: false,
    },
  ];

  const filteredOrders = dummyOrders.filter(order =>
    order.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTrackOrder = (order: Order) => {
    navigation.navigate('OrderTracking', { orderId: order.id });
  };

  const handleReorder = (order: Order) => {
    navigation.navigate('ProductDetails', { productId: order.id });
  };

  const handleRateOrder = (order: Order) => {
    navigation.navigate('OrderRating', { orderId: order.id });
  };

  const handleTakeHome = () => {
    navigation.navigate('Home');
  };

  const renderOrderItem = ({ item }: { item: Order }) => (
    <OrderCard
      order={item}
      onTrackOrder={() => handleTrackOrder(item)}
      onReorder={() => handleReorder(item)}
      onRateOrder={() => handleRateOrder(item)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#282C3F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon name="search" size={20} color="#94969F" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#94969F"
          />
        </View>
      </View>

      {/* Content */}
      {!hasOrders || filteredOrders.length === 0 ? (
        <EmptyOrdersState onTakeHome={handleTakeHome} />
      ) : (
        <FlatList
          data={filteredOrders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.ordersList}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </SafeAreaView>
  );
};

export default MyOrdersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#282C3F',
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },

  // Search
  searchContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#282C3F',
  },

  // Orders List
  ordersList: {
    paddingVertical: 16,
  },
  separator: {
    height: 16,
  },
});