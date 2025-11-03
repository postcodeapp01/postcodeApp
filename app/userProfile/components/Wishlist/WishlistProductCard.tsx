// import React from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import ProductCard from '../../../components/ProductCard';

// type WishlistProduct = {
//   id: string;
//   name: string;
//   brand: string;
//   imageUrl: string;
//   currentPrice: number;
//   originalPrice: number;
//   discount: number;
//   isInStock: boolean;
// };

// type Props = {
//   product: WishlistProduct;
//   onRemove: () => void;
//   onAddToCart: () => void;
//   onPress: () => void;
//   width: number; 
// };

// const WishlistProductCard: React.FC<Props> = ({
//   product,
//   onRemove,
//   onAddToCart,
//   onPress,
//   width,
// }) => {
//   const IMAGE_HEIGHT = width * 1.05; // keep a consistent aspect ratio

//   return (
//     // <View style={[styles.card, {width}]}>
//     //   {/* Product Image */}
//     //   <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
//     //     <Image
//     //       source={require('../../../../sources/images/c1.png')}
//     //       style={[styles.productImage, {width, height: IMAGE_HEIGHT}]}
//     //     />
//     //   </TouchableOpacity>

//     //   {/* Product Info */}
//     //   <View style={styles.productInfo}>
//     //     <Text style={styles.brandName}>{product.brand}</Text>
//     //     <Text style={styles.productName} numberOfLines={1}>
//     //       {product.name}
//     //     </Text>

//     //     {/* Price Row */}
//     //     <View style={styles.priceContainer}>
//     //       <Text style={styles.currentPrice}>₹ {product.currentPrice}</Text>
//     //       <Text style={styles.originalPrice}>₹ {product.originalPrice}</Text>
//     //       <Text style={styles.discountPercentage}>{product.discount}% OFF</Text>
//     //     </View>

//     //     {/* Bottom Buttons */}
//     //     <View style={styles.actionsRow}>
//     //       <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
//     //         <Icon name="delete-outline" size={15} color="#AAA" />
//     //       </TouchableOpacity>

//     //       <TouchableOpacity
//     //         style={styles.addToCartButton}
//     //         onPress={onAddToCart}
//     //         activeOpacity={0.8}>
//     //         <Icon name="shopping-cart" size={16} color="#FFFFFF" />
//     //         <Text style={styles.addToCartText}>Add to Cart</Text>
//     //       </TouchableOpacity>
//     //     </View>
//     //   </View>
//     // </View>
//     <ProductCard product={product} onPress={onPress} />
//   );
// };

// export default WishlistProductCard;

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     overflow: 'hidden',
//   },
//   productImage: {
//     borderTopRightRadius: 10,
//     borderTopLeftRadius: 10,
//     resizeMode: 'cover',
//   },
//   productInfo: {
//     padding: 8,
//   },
//   brandName: {
//     fontSize: 12,
//     fontWeight: '500',
//     color: '#000',
//   },
//   productName: {
//     fontSize: 10,
//     fontWeight: '500',
//     color: '#AAAAAA',
//   },
//   priceContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 4,
//     flexWrap: 'wrap',
//   },
//   currentPrice: {
//     fontSize: 12,
//     fontWeight: '600',
//     marginRight: 5,
//     color: '#222',
//   },
//   originalPrice: {
//     fontSize: 12,
//     color: '#AAAAAA',
//     textDecorationLine: 'line-through',
//     marginRight: 5,
//   },
//   discountPercentage: {
//     fontSize: 10,
//     color: '#B51C0F',
//     fontWeight: '600',
//   },
//   actionsRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 6,
//   },
//   removeButton: {
//     width: 28,
//     height: 28,
//     borderRadius: 6,
//     borderWidth: 1,
//     borderColor: '#CCC',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   addToCartButton: {
//     flex: 1,
//     flexDirection: 'row',
//     backgroundColor: '#FF5964',
//     marginLeft: 8,
//     borderRadius: 6,
//     paddingVertical: 5,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   addToCartText: {
//     fontSize: 10,
//     fontWeight: '600',
//     color: '#fff',
//     marginLeft: 4,
//   },
// });



// import React from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import ProductCard from '../../../components/ProductCard';

// type WishlistProduct = {
//   id: string;
//   name: string;
//   brand: string;
//   imageUrl: string;
//   currentPrice: number;
//   originalPrice: number;
//   discount: number;
//   isInStock: boolean;
//   // optional store fields if any:
//   store?: {
//     id?: string | number;
//     name?: string;
//     location?: string;
//     latitude?: number;
//     longitude?: number;
//   };
// };

// type Props = {
//   product: WishlistProduct;
//   onRemove: () => void;
//   onAddToCart: () => void;
//   onPress: () => void;
//   width: number;
// };

// const WishlistProductCard: React.FC<Props> = ({
//   product,
//   onRemove,
//   onAddToCart,
//   onPress,
//   width,
// }) => {
//   const mappedProduct = {
//     id: product.id,
//     name: product.name,
//     brand: product.brand,
//     image: product.imageUrl || null,
//     price: product.currentPrice ?? 0,
//     originalPrice: product.originalPrice ?? null,
//     discount: product.discount ?? null,
//     store: product.store ?? undefined,
//   };


//   const handleRemove = () => {
//     onRemove();
//   };
//   console.log("Product in the wishlist ",product)
//   return (
//     <View style={[styles.wrapper, { width }]}>
//       {/* Render the shared ProductCard; force horizontal mode so we can set width */}
//       <ProductCard
//         product={mappedProduct}
//         horizontalCardWidth={width}
//         onPress={onPress}
//         onToggleFavorite={() => {
//           /* If ProductCard's favorite should toggle wishlist, you can forward remove or toggle logic here */
//         }}
//         isFavorite={true} // wishlist items are favorites by default
//       />

//       {/* Actions row below the ProductCard */}
//       <View style={styles.actionsRow}>
//         <TouchableOpacity
//           style={[styles.iconButton, styles.removeButton]}
//           onPress={handleRemove}
//           activeOpacity={0.8}
//           accessibilityLabel="Remove from wishlist"
//         >
//           <Icon name="delete-outline" size={24} color="#666" />
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[styles.addToCartButton]}
//           onPress={onAddToCart}
//           activeOpacity={0.85}
//           accessibilityLabel="Add to cart"
//         >
//           <Icon name="shopping-cart" size={18} color="#fff" />
//           <Text style={styles.addToCartText}>Add to cart</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default WishlistProductCard;

// const styles = StyleSheet.create({
//   wrapper: {
//     // width is supplied via prop
//   },
  
//   actionsRow: {
//     backgroundColor: '#8ee95eff',
//     flexDirection: 'row',
//     alignItems: 'center',
//     height:50,
//     paddingHorizontal: 10,
//     paddingVertical:5,
//     justifyContent: 'space-between',
//     marginBottom: 10,
//   },

//   iconButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#E6E6E6',
//     elevation: 1,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.06,
//     shadowRadius: 2,
//   },

//   removeButton: {
//     // keep it neutral; icon-only button on left
//   },

//   addToCartButton: {
//     flex: 1,
//     marginLeft: 8,
//     height: 40,
//     backgroundColor: '#FF5964',
//     borderRadius: 5,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   addToCartText: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: '600',
//     marginLeft: 8,
//     lineHeight:20,
//     letterSpacing: -0.32,
//   },
// });
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ProductCard from '../../../components/ProductCard';

type WishlistProduct = {
  id: string;
  name: string;
  brand: string;
  imageUrl: string;
  currentPrice: number;
  originalPrice: number;
  discount: number;
  isInStock: boolean;
  store?: {
    id?: string | number;
    name?: string;
    location?: string;
    latitude?: number;
    longitude?: number;
  };
};

type Props = {
  product: WishlistProduct;
  onRemove: () => void;
  onAddToCart: () => void;
  onPress: () => void;
  width: number;
};

const WishlistProductCard: React.FC<Props> = ({
  product,
  onRemove,
  onAddToCart,
  onPress,
  width,
}) => {
  const mappedProduct = {
    id: product.id,
    name: product.name,
    brand: product.brand,
    image: product.imageUrl || null,
    price: product.currentPrice ?? 0,
    originalPrice: product.originalPrice ?? null,
    discount: product.discount ?? null,
    store: product.store ?? undefined,
  };

  const handleRemove = () => {
    onRemove();
  };

  console.log('Product in the wishlist ', product);

  return (
    <View style={[styles.wrapper, {width}]}>
      {/* Product Card */}
      <View style={styles.productCardContainer}>
        <ProductCard
          product={mappedProduct}
          horizontalCardWidth={width}
          onPress={onPress}
          onToggleFavorite={() => {}}
          isFavorite={true}
        />

        {/* Out of Stock Overlay */}
        {!product.isInStock && (
          <View style={styles.outOfStockOverlay}>
            <Text style={styles.outOfStockText}>Out of stock</Text>
          </View>
        )}
      </View>

      {/* Actions Row */}
      {!product.isInStock ? (
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.iconButton, styles.removeButton]}
            onPress={handleRemove}
            activeOpacity={0.8}
            accessibilityLabel="Remove from wishlist">
            <Icon name="delete-outline" size={22} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={onAddToCart}
            activeOpacity={0.85}
            accessibilityLabel="Add to cart">
            <Icon name="shopping-cart" size={18} color="#fff" />
            <Text style={styles.addToCartText}>Add to cart</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.outOfStockActionsRow}>
          <TouchableOpacity
            style={styles.removeButtonOutOfStock}
            onPress={handleRemove}
            activeOpacity={0.8}
            accessibilityLabel="Remove from wishlist">
            <Icon name="delete-outline" size={21} color="#222" />
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default WishlistProductCard;

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
  },
  productCardContainer: {
    position: 'relative',
  },
  outOfStockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: -4,
    bottom: 120,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
  },
  outOfStockText: {
    borderTopColor: 'rgba(255, 255, 255, 0.5)',
    borderTopWidth: 1,
    color: '#fff',
    fontSize: 12,
    width: '100%',
    fontWeight: '600',
    paddingHorizontal: 16,
    paddingVertical: 8,
    textAlign: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    paddingHorizontal: 10,
    paddingVertical: 8,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    gap: 8,
  },

  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E6E6E6',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },

  removeButton: {
    paddingHorizontal: 8,
  },
  addToCartButton: {
    flex: 1,
    height: 40,
    backgroundColor: '#FF5964',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 20,
    letterSpacing: -0.32,
  },
  outOfStockActionsRow: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#fff',
    height:50,
  },

  removeButtonOutOfStock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#FF5964',
    backgroundColor: '#fff',
    height: 40,
  },

  removeButtonText: {
    color: '#222',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
    lineHeight: 20,
    letterSpacing: -0.32,
  },
});
