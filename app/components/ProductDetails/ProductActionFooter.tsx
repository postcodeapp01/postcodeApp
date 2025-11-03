// // ProductActionFooter.tsx
// import React from 'react';
// import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// interface ProductActionFooterProps {
//   onWishlistToggle: () => void;
//   onAddToCart: () => void;
//   isWishlisted?: boolean;

//   isCartLoading?: boolean;
//   buyDisabled?: boolean;
//   cartDisabled?: boolean;
// }

// const ProductActionFooter: React.FC<ProductActionFooterProps> = ({
//   onWishlistToggle,
//   onAddToCart,
//   isWishlisted = false,
//   isCartLoading = false,
//   cartDisabled = false,
// }) => {
//   return (
//     <View style={styles.footer}>
//       {/* Wishlist Button */}
//       <TouchableOpacity
//         style={styles.iconBtn}
//         onPress={onWishlistToggle}
//         activeOpacity={0.7}
//       >
//         <FontAwesome
//           name={isWishlisted ? 'heart' : 'heart-o'}
//           size={20}
//           color="#fff"
//         />
//       </TouchableOpacity>

     

//       {/* Add to Cart Button */}
//       <TouchableOpacity
//         style={[styles.actionBtn, styles.addToCartBtn]}
//         onPress={onAddToCart}
//         disabled={cartDisabled || isCartLoading}
//         activeOpacity={0.8}
//       >
//         <MaterialCommunityIcons name="shopping-outline" size={18} color="#FFF" />
//         <Text style={styles.addToCartText}>Add to cart</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   footer: {
//     height: 60,
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FF5964',
//     paddingVertical: 10,
//     paddingHorizontal: 12,
//     justifyContent: 'space-between',
//   },
//   iconBtn: {
//     width: 40,
//     height: 40,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: 20,
//     backgroundColor: 'transparent',
//   },
//   actionBtn: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     height: 35,
//     borderRadius: 10,
//     borderWidth: 2,
//     marginHorizontal: 6,
//   },
 
//   addToCartText: {
//     color: '#FFF',
//     fontWeight: '700',
//     fontSize: 14,
//     marginLeft: 6,
//   },
// });

// export default ProductActionFooter;




import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';

interface ProductActionFooterProps {
  onShare: () => void;
  onWishlistToggle: () => void;
  onAddToCart: () => void;
  isWishlisted?: boolean;
  isCartLoading?: boolean;
  buyDisabled?: boolean;
  cartDisabled?: boolean;
}

const ProductActionFooter: React.FC<ProductActionFooterProps> = ({
  onShare,
  onWishlistToggle,
  onAddToCart,
  isWishlisted = false,
  isCartLoading = false,
  cartDisabled = false,
}) => {
  return (
    <View style={styles.footer}>
      {/* Share Button */}
      <TouchableOpacity
        style={styles.iconBtn}
        onPress={onShare}
        activeOpacity={0.7}
      >
        <Entypo name="share" size={20} color="#333" />
      </TouchableOpacity>

      {/* Wishlist Button */}
      <TouchableOpacity
        style={styles.iconBtn}
        onPress={onWishlistToggle}
        activeOpacity={0.7}
      >
        <FontAwesome
          name={isWishlisted ? 'heart' : 'heart-o'}
          size={20}
          color="#333"
        />
      </TouchableOpacity>

      {/* Add to Cart Button */}
      <TouchableOpacity
        style={[styles.actionBtn, cartDisabled ? styles.disabled : null]}
        onPress={onAddToCart}
        disabled={cartDisabled || isCartLoading}
        activeOpacity={0.8}
      >
        <Text style={styles.addToCartText}>Add to cart</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F1F1',
    gap:10,
    padding:10,
  },
  iconBtn: {
    width: 50,
    height: 40,
    borderRadius: 8,
    padding:5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  actionBtn: {
    flex: 1,
    height: 40,
    backgroundColor: '#FF5964',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    // marginLeft: 8,
  },
  addToCartText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  disabled: {
    opacity: 0.6,
  },
});

export default ProductActionFooter;
