import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  InteractionManager,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import WishlistProductCard from '../components/Wishlist/WishlistProductCard';
import axiosInstance from '../../../config/Api';
// import AddToCartModal from '../../components/ProductDetails/AddToCartModal';
import HeaderWithNoIcons from '../components/Profile/HeaderWithNoIcons';
import AddToCartModal from '../../home/components/ProductDetails/AddToCartModal';

const screenWidth = Dimensions.get('window').width;
const H_PADDING = 16; // screen horizontal padding
const GAP = 12;
const NUM_COLUMNS = 2;

const CARD_WIDTH =
  (screenWidth - H_PADDING * 2 - GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS;
type WishlistProduct = {
  id: string;
  name: string;
  brand: string;
  imageUrl: string;
  currentPrice: number;
  originalPrice: number;
  discount: number;
  isInStock: boolean;
  sizes?: string[];
  fitNotes?: string;
};

type Props = {
  navigation: any;
};

const WishlistScreen: React.FC<Props> = ({navigation}) => {
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<WishlistProduct | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [wishlistItems, setWishlistItems] = useState<WishlistProduct[]>([]);
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await axiosInstance.get('/wishlist');
        console.log('whishlist items', res.data[0]);
        setWishlistItems(res.data); // ✅ backend already matches frontend format
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      }
    };

    fetchWishlist();
  }, []);
  const handleRemoveFromWishlist = (productId: string) => {
    Alert.alert(
      'Remove from Wishlist',
      'Are you sure you want to remove this item from your wishlist?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await axiosInstance.delete(`/wishlist/${productId}`);
              setWishlistItems(prev =>
                prev.filter(item => item.id !== productId),
              );
            } catch (err) {
              console.error('❌ Failed to remove from wishlist', err);
              Alert.alert('Failed to remove from wishlist');
            }
          },
        },
      ],
    );
  };

  const handleAddToCart = async (wishlistItem: WishlistProduct) => {
    try {
      if (wishlistItem.sizes && wishlistItem.sizes.length > 0) {
        // open modal if size needed
        setSelectedProduct(wishlistItem);
        setShowSizeModal(true);
      } else {
        await axiosInstance.post('/cart', {
          productId: wishlistItem.id,
          qty: 1,
          size: null,
        });
        Alert.alert('Added to cart!');
      }
    } catch (err) {
      console.error('❌ Failed to add to cart', err);
      Alert.alert('Failed to add to cart');
    }
  };

  const handleProductPress = (product: WishlistProduct) => {
    navigation.navigate('ProductDetails', {id: product.id});
  };

  const renderWishlistItem = ({
    item,
    index,
  }: {
    item: WishlistProduct;
    index: number;
  }) => (
    <WishlistProductCard
      product={item}
      onRemove={() => handleRemoveFromWishlist(item.id)}
      onAddToCart={() => handleAddToCart(item)}
      onPress={() => handleProductPress(item)}
      width={CARD_WIDTH}
    />
  );

  const renderEmptyWishlist = () => (
    <View style={styles.emptyContainer}>
      <Icon name="favorite-border" size={64} color="#E0E0E0" />
      <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
      <Text style={styles.emptySubtitle}>
        Browse products and add them to your wishlist
      </Text>
      <TouchableOpacity
        style={styles.browseButton}
        onPress={() => navigation.navigate('Home')}>
        <Text style={styles.browseButtonText}>Start Shopping</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}

      <HeaderWithNoIcons title="Wishlist" onBack={() => navigation.goBack()} navigation={navigation} showCart={true}/>
      {/* Wishlist Items */}
      {wishlistItems.length > 0 ? (
        <FlatList
          data={wishlistItems}
          renderItem={renderWishlistItem}
          keyExtractor={item => item.id}
          numColumns={NUM_COLUMNS}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={false}
        />
      ) : (
        renderEmptyWishlist()
      )}

      <AddToCartModal
        visible={showSizeModal}
        sizes={selectedProduct?.sizes ?? []}
        selectedSize={selectedSize}
        onSelectSize={size => setSelectedSize(size)}
        onConfirm={async () => {
          if (!selectedProduct || !selectedSize) {
            Alert.alert('Please select a size');
            return;
          }
          try {
            await axiosInstance.post('/cart', {
              productId: selectedProduct.id,
              qty: 1,
              size: selectedSize,
            });
            Alert.alert('Added to cart!');
            setShowSizeModal(false);
            setSelectedProduct(null);
            setSelectedSize(null);
          } catch (err) {
            console.error('❌ Failed to add to cart', err);
            Alert.alert('Failed to add to cart');
          }
        }}
        onClose={() => {
          setShowSizeModal(false);
          setSelectedProduct(null);
          setSelectedSize(null);
        }}
        sizeChart={undefined} 
        guideImage={undefined} 
        fitNotes={selectedProduct?.fitNotes}
      />
    </SafeAreaView>
  );
};

export default WishlistScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: H_PADDING,
    paddingTop: 8,
    paddingBottom: 24,
  },
  row: {
    justifyContent: 'space-between',
  },
  itemSeparator: {
    height: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#282C3F',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: '#FF3366',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
