// import React, {useEffect, useState, useCallback, memo} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   GestureResponderEvent,
//   TextInput,
//   ActivityIndicator,
//   Alert,
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import { AppDispatch } from '../../../Store';
// import { useDispatch } from 'react-redux';
// import { removeCartItemOnServer } from '../../../reduxSlices/cartSlice';
// import axiosInstance from '../../../config/Api';

// export interface CartItemType {
//   cartId: string | number;
//   productId?: string | number;
//   name: string;
//   brand?: string;
//   price: string | number;
//   originalPrice?: string | number;
//   discount?: number;
//   qty: number;
//   image: string;
//   returns?: string;
//   estimatedTime?: string;
//   deliveryTag?: string;
//   size?: string;
//   store_id?: string | number;
//   store_latitude?: number;
//   store_longitude?: number;
//   store_name?: string;
//   store_address?: string;
// }

// interface Props {
//   item: CartItemType;
//   onQtyChange: (qty: number) => void;
//   onRemove: () => void;
//   onSizeChange?: (size: string) => void;
// }

// const sampleSizes = ['XS', 'S', 'M', 'L', 'XL'];

// const formatPrice = (p: string | number) => {
//   const price = typeof p === 'string' ? parseFloat(p) : p;
//   return `₹${price.toFixed(0)}`;
// };

// const CartItem: React.FC<Props> = memo(
//   ({item, onQtyChange, onRemove, onSizeChange}) => {
//     const {
//       name,
//       brand,
//       price,
//       originalPrice,
//       discount,
//       qty,
//       image,
//       returns: ret,
//       estimatedTime,
//       size,
//     } = item;
//     // console.log("Item",item)
//     const [qtyInput, setQtyInput] = useState(String(qty));
//     const [isRemoving, setIsRemoving] = useState(false); // Track removal state
//     const deliveryTag = 'Delivery in 60mins';
//     const dispatch = useDispatch<AppDispatch>();
//     // Update qty input when prop changes
//     useEffect(() => {
//       if (!isRemoving) {
//         // Only update if not in removal process
//         setQtyInput(String(qty));
//       }
//     }, [qty, isRemoving]);

//     const handleQtyIncrease = useCallback(
//       (e?: GestureResponderEvent) => {
//         if (isRemoving) return;
//         const next = qty + 1;
//         setQtyInput(String(next));
//         onQtyChange(next);
//       },
//       [qty, onQtyChange, isRemoving],
//     );

//     const handleQtyDecrease = useCallback(
//       (e?: GestureResponderEvent) => {
//         if (isRemoving) return;
//         const next = qty <= 1 ? 1 : qty - 1;
//         setQtyInput(String(next));
//         onQtyChange(next);
//       },
//       [qty, onQtyChange, isRemoving],
//     );

//     const handleSizePress = useCallback(() => {
//       if (!onSizeChange || isRemoving) return;
//       const curIndex = sampleSizes.indexOf(size ?? 'XS');
//       const next = sampleSizes[(curIndex + 1) % sampleSizes.length];
//       onSizeChange(next);
//     }, [size, onSizeChange, isRemoving]);

//     const handleQtyInputChange = useCallback(
//       (text: string) => {
//         if (isRemoving) return;

//         const numericValue = text.replace(/[^0-9]/g, '');
//         setQtyInput(numericValue);

//         if (numericValue) {
//           const parsedQty = Math.max(
//             1,
//             Math.min(99, parseInt(numericValue, 10)),
//           );
//           onQtyChange(parsedQty);
//         } else {
//           // If empty, reset to 1
//           setQtyInput('1');
//           onQtyChange(1);
//         }
//       },
//       [onQtyChange, isRemoving],
//     );

//     // inside CartItem component (replace existing handleRemove)
//     // const handleRemove = useCallback(async () => {
//     //   if (isRemoving) return;

//     //   setIsRemoving(true);
//     //   try {
//     //     // onRemove must return a Promise<boolean | void>
//     //     const result = await onRemove(); // parent should return a promise that resolves when removal (and optional wishlist addition) is finished

//     //     // If parent resolves "false" or throws, we treat as cancel/failure
//     //     // If it resolved successfully and parent removed the item, this component will unmount
//     //     // If parent decided not to remove (user cancelled), parent should resolve false — revert
//     //     if (result === false) {
//     //       // removal canceled on parent side -> reset removing state so item re-renders correctly
//     //       setIsRemoving(false);
//     //     }
//     //     // If result === true or undefined (we treat as success) -> the item will likely unmount because parent updated the list.
//     //   } catch (error) {
//     //     console.error('Error while removing item:', error);
//     //     Alert.alert('Error', 'Failed to remove item. Please try again.');
//     //     setIsRemoving(false);
//     //   }
//     // }, [isRemoving, onRemove]);
//     const handleRemove = useCallback(() => {
//   if (isRemoving) return;

//   Alert.alert(
//     'Remove Item',
//     'Do you want to add this item to your wishlist before removing it from the cart?',
//     [
//       {
//         text: 'Yes, add to Wishlist',
//         onPress: async () => {
//           setIsRemoving(true);
//           try {
//             // Add to wishlist first
//             await axiosInstance.post(`/wishlist/`, {
//               productId: item.productId, // make sure item has productId
//             });

//             Alert.alert('Success', 'Added to wishlist!');

//             // Then remove from cart
//             await dispatch(removeCartItemOnServer(String(item.cartId))).unwrap();
//           } catch (error) {
//             console.error('Error while moving to wishlist:', error);
//             Alert.alert('Error', 'Failed to move item. Please try again.');
//           } finally {
//             setIsRemoving(false);
//           }
//         },
//       },
//       {
//         text: 'No, just remove',
//         style: 'destructive',
//         onPress: async () => {
//           setIsRemoving(true);
//           try {
//             await dispatch(removeCartItemOnServer(String(item.cartId))).unwrap();
//           } catch (error) {
//             console.error('Remove cart item error:', error);
//             Alert.alert('Error', 'Failed to remove item. Please try again.');
//           } finally {
//             setIsRemoving(false);
//           }
//         },
//       },
//       {text: 'Cancel', style: 'cancel'},
//     ],
//   );
// }, [dispatch, item.cartId, item.productId, isRemoving]);
//     return (
//       <View style={styles.card}>
//         {/* Delivery Tag Overlapping */}
//         {deliveryTag ? (
//           <View style={styles.topBadge}>
//             <Ionicons
//               name="time-outline"
//               size={24}
//               color="#FF5964"
//               style={{marginRight: 6}}
//             />
//             <Text style={styles.topBadgeText}>{deliveryTag}</Text>
//           </View>
//         ) : null}

//         {/* Main Content */}
//         <View style={styles.row}>
//           <Image
//             source={
//               image ? {uri: image} : require('../../../sources/images/c1.png')
//             }
//             style={styles.image}
//           />

//           <View style={styles.main}>
//             {/* Title + subname */}
//             <View>
//               <Text style={styles.name} numberOfLines={2}>
//                 {name}
//               </Text>
//               {brand ? <Text style={styles.subname}>{brand}</Text> : null}
//             </View>

//             {/* Price row */}
//             <View style={styles.priceRow}>
//               <Text style={styles.priceText}>{formatPrice(price)}</Text>
//               {originalPrice ? (
//                 <Text style={styles.originalPrice}>
//                   {formatPrice(originalPrice)}
//                 </Text>
//               ) : null}
//               {discount ? (
//                 <View style={styles.discountPill}>
//                   <Text style={styles.discountText}>{discount}% OFF</Text>
//                 </View>
//               ) : null}
//             </View>

//             {/* Qty & Size */}
//             <View style={styles.selectRow}>
//               <View style={styles.selectBox}>
//                 <Text style={styles.selectLabel}>Qty</Text>
//                 <View style={styles.selectValueRow}>
//                   <TextInput
//                     value={qtyInput}
//                     onChangeText={handleQtyInputChange}
//                     keyboardType="numeric"
//                     maxLength={2}
//                     style={[styles.selectValue, styles.qtyInput]}
//                     editable={!isRemoving}
//                   />
//                   <View
//                     style={{
//                       flexDirection: 'column',
//                       alignItems: 'center',
//                       left: -11,
//                     }}>
//                     <TouchableOpacity
//                       onPress={handleQtyIncrease}
//                       disabled={isRemoving}>
//                       <MaterialIcons
//                         name="arrow-drop-up"
//                         color={isRemoving ? '#E0E0E0' : '#B1B1B1'}
//                         size={20}
//                       />
//                     </TouchableOpacity>
//                     <TouchableOpacity
//                       onPress={handleQtyDecrease}
//                       disabled={isRemoving}>
//                       <MaterialIcons
//                         name="arrow-drop-down"
//                         color={isRemoving ? '#E0E0E0' : '#B1B1B1'}
//                         size={20}
//                         style={{marginTop: -11}}
//                       />
//                     </TouchableOpacity>
//                   </View>
//                 </View>
//               </View>

//               <TouchableOpacity
//                 style={[styles.selectBox, {marginLeft: 10}]}
//                 onPress={handleSizePress}
//                 activeOpacity={0.75}
//                 disabled={isRemoving}>
//                 <Text style={styles.selectLabel}>Size</Text>
//                 <View style={styles.selectValueRow}>
//                   <Text style={styles.selectValue}>{size ? size : 'S'}</Text>
//                 </View>
//               </TouchableOpacity>
//             </View>

//             {/* Pills */}
//             <View style={styles.pillRow}>
//               <View style={styles.pill}>
//                 <MaterialIcons
//                   name="autorenew"
//                   size={16}
//                   color="#2F80ED"
//                   style={{marginRight: 8, left: 4}}
//                 />
//                 <Text style={styles.pillText}>
//                   {ret ?? '1 day Return and Exchange'}
//                 </Text>
//               </View>

//               <View style={[styles.pill, styles.estimatedPill]}>
//                 <MaterialCommunityIcons
//                   name="clock-outline"
//                   size={14}
//                   color="#18B58A"
//                   style={{marginRight: 8, left: 1}}
//                 />
//                 <Text style={styles.pillText2}>
//                   {estimatedTime ?? 'Estimated time within 45mins'}
//                 </Text>
//               </View>
//             </View>
//           </View>
//         </View>

//         <View style={styles.separatorAndRemove}>
//           <View style={styles.dashedSeparator} />
//           <TouchableOpacity
//             style={[styles.removeBtn, isRemoving && styles.removeBtnDisabled]}
//             onPress={handleRemove}
//             activeOpacity={0.75}
//             disabled={isRemoving}>
//             {isRemoving ? (
//               <ActivityIndicator
//                 size="small"
//                 color="#888"
//                 style={{marginRight: 8}}
//               />
//             ) : (
//               <MaterialCommunityIcons
//                 name="trash-can-outline"
//                 size={15}
//                 color="#AAAAAAAA"
//               />
//             )}
//             <Text
//               style={[
//                 styles.removeText,
//                 isRemoving && styles.removeTextDisabled,
//               ]}>
//               {isRemoving ? 'Removing...' : 'Remove'}
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   },
// );

// // Add displayName for debugging
// CartItem.displayName = 'CartItem';

// export default CartItem;

// const styles = StyleSheet.create({
//   card: {
//     height: 230,
//     backgroundColor: '#fff',
//     padding: 12,
//     marginBottom: 5,
//     overflow: 'hidden',
//     position: 'relative',
//   },

//   // Delivery Tag overlaps card
//   topBadge: {
//     top: -2,
//     height: 24,
//     backgroundColor: '#fff',
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   topBadgeText: {
//     top: 2,
//     fontSize: 14,
//     lineHeight: 15,
//     letterSpacing: 0.1,
//     fontWeight: '500',
//     color: '#000000',
//   },

//   row: {
//     top: -12,
//     height: 130,
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     marginTop: 20,
//   },

//   image: {
//     width: 100,
//     height: 130,
//     resizeMode: 'cover',
//     backgroundColor: '#f2f2f2',
//     marginRight: 10,
//   },

//   main: {
//     flex: 1,
//     justifyContent: 'space-between',
//   },

//   name: {
//     fontSize: 12,
//     fontWeight: '500',
//     color: '#000',
//     lineHeight: 15,
//   },
//   subname: {
//     fontSize: 10,
//     color: '#AAAAAA',
//     lineHeight: 15,
//   },

//   priceRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   priceText: {
//     fontSize: 12,
//     fontWeight: '600',
//     marginRight: 8,
//     color: '#111',
//     letterSpacing: -0.32,
//   },
//   originalPrice: {
//     fontSize: 12,
//     color: '#AAAAAA',
//     textDecorationLine: 'line-through',
//     marginRight: 1,
//   },
//   discountPill: {
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: 6,
//   },
//   discountText: {
//     fontSize: 11,
//     color: '#B51C0F',
//     fontWeight: '600',
//     letterSpacing: -0.32,
//   },

//   selectRow: {
//     flexDirection: 'row',
//     marginTop: 8,
//   },
//   selectBox: {
//     width: 55,
//     height: 20,
//     borderWidth: 1,
//     borderColor: '#000000',
//     borderRadius: 6,
//     paddingHorizontal: 7,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     backgroundColor: '#fff',
//   },
//   selectLabel: {
//     fontSize: 10,
//     color: '#B1B1B1',
//   },
//   selectValueRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   selectValue: {
//     color: '#000',
//     fontSize: 10,
//     fontWeight: '400',
//     marginRight: 4,
//   },
//   qtyInput: {
//     textAlign: 'center',
//     fontSize: 10,
//     fontWeight: '400',
//     paddingVertical: -1,
//     paddingHorizontal: -4,
//     width: 20,
//   },

//   pillRow: {
//     flexDirection: 'column',
//     alignItems: 'flex-start',
//     left: -8,
//   },
//   pill: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 5,
//     paddingVertical: 5,
//   },
//   estimatedPill: {
//     marginLeft: 8,
//     backgroundColor: '#F3F0F0',
//     borderRadius: 10,
//   },
//   pillText: {
//     fontSize: 10,
//     fontWeight: '500',
//     lineHeight: 15,
//     letterSpacing: 0.1,
//     color: '#AAAAAA',
//   },
//   pillText2: {
//     left: -1,
//     fontSize: 10,
//     fontWeight: '400',
//     lineHeight: 15,
//     letterSpacing: 0.1,
//     color: '#000',
//   },

//   separatorAndRemove: {
//     alignItems: 'flex-end',
//   },
//   dashedSeparator: {
//     borderTopWidth: 1,
//     borderStyle: 'dashed',
//     borderColor: '#AAAAAA',
//     width: '100%',
//     marginBottom: 10,
//   },
//   removeBtn: {
//     width: 150,
//     height: 26,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderWidth: 1,
//     borderColor: '#AAAAAA',
//     padding: 5,
//     borderRadius: 5,
//     backgroundColor: '#fff',
//   },
//   removeBtnDisabled: {
//     backgroundColor: '#F5F5F5',
//     borderColor: '#E0E0E0',
//   },
//   removeText: {
//     marginLeft: 6,
//     fontSize: 12,
//     color: '#AAAAAAAA',
//     fontWeight: '700',
//   },
//   removeTextDisabled: {
//     color: '#E0E0E0',
//   },
// });
import React, {useEffect, useState, useCallback, memo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  GestureResponderEvent,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppDispatch } from '../../../Store';
import { useDispatch } from 'react-redux';
import { removeCartItemOnServer } from '../../../reduxSlices/cartSlice';
import axiosInstance from '../../../config/Api';

export interface CartItemType {
  cartId: string | number;
  productId?: string | number;
  name: string;
  brand?: string;
  price: string | number;
  originalPrice?: string | number;
  discount?: number;
  qty: number;
  image: string;
  returns?: string;
  estimatedTime?: string;
  deliveryTag?: string;
  size?: string;
  store_id?: string | number;
  store_latitude?: number;
  store_longitude?: number;
  store_name?: string;
  store_address?: string;
}

interface Props {
  item: CartItemType;
  onQtyChange: (qty: number) => void;
  onRemove: () => void;
  onSizeChange?: (size: string) => void;
}

const sampleSizes = ['XS', 'S', 'M', 'L', 'XL'];

const formatPrice = (p: string | number) => {
  const price = typeof p === 'string' ? parseFloat(p) : p;
  return `₹${price.toFixed(0)}`;
};

const CartItem: React.FC<Props> = memo(
  ({item, onQtyChange, onRemove, onSizeChange}) => {
    const {
      name,
      brand,
      price,
      originalPrice,
      discount,
      qty,
      image,
      returns: ret,
      estimatedTime,
      size,
    } = item;

    const [qtyInput, setQtyInput] = useState(String(qty));
    const [isRemoving, setIsRemoving] = useState(false);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
      if (!isRemoving) {
        setQtyInput(String(qty));
      }
    }, [qty, isRemoving]);

    const handleQtyIncrease = useCallback(
      (e?: GestureResponderEvent) => {
        if (isRemoving) return;
        const next = qty + 1;
        setQtyInput(String(next));
        onQtyChange(next);
      },
      [qty, onQtyChange, isRemoving],
    );

    const handleQtyDecrease = useCallback(
      (e?: GestureResponderEvent) => {
        if (isRemoving) return;
        const next = qty <= 1 ? 1 : qty - 1;
        setQtyInput(String(next));
        onQtyChange(next);
      },
      [qty, onQtyChange, isRemoving],
    );

    const handleSizePress = useCallback(() => {
      if (!onSizeChange || isRemoving) return;
      const curIndex = sampleSizes.indexOf(size ?? 'XS');
      const next = sampleSizes[(curIndex + 1) % sampleSizes.length];
      onSizeChange(next);
    }, [size, onSizeChange, isRemoving]);

    const handleQtyInputChange = useCallback(
      (text: string) => {
        if (isRemoving) return;

        const numericValue = text.replace(/[^0-9]/g, '');
        setQtyInput(numericValue);

        if (numericValue) {
          const parsedQty = Math.max(
            1,
            Math.min(99, parseInt(numericValue, 10)),
          );
          onQtyChange(parsedQty);
        } else {
          setQtyInput('1');
          onQtyChange(1);
        }
      },
      [onQtyChange, isRemoving],
    );

    const handleRemove = useCallback(() => {
      if (isRemoving) return;

      Alert.alert(
        'Remove Item',
        'Do you want to add this item to your wishlist before removing it from the cart?',
        [
          {
            text: 'Yes, add to Wishlist',
            onPress: async () => {
              setIsRemoving(true);
              try {
                await axiosInstance.post(`/wishlist/`, {
                  productId: item.productId,
                });

                Alert.alert('Success', 'Added to wishlist!');

                await dispatch(removeCartItemOnServer(String(item.cartId))).unwrap();
              } catch (error) {
                console.error('Error while moving to wishlist:', error);
                Alert.alert('Error', 'Failed to move item. Please try again.');
              } finally {
                setIsRemoving(false);
              }
            },
          },
          {
            text: 'No, just remove',
            style: 'destructive',
            onPress: async () => {
              setIsRemoving(true);
              try {
                await dispatch(removeCartItemOnServer(String(item.cartId))).unwrap();
              } catch (error) {
                console.error('Remove cart item error:', error);
                Alert.alert('Error', 'Failed to remove item. Please try again.');
              } finally {
                setIsRemoving(false);
              }
            },
          },
          {text: 'Cancel', style: 'cancel'},
        ],
      );
    }, [dispatch, item.cartId, item.productId, isRemoving]);

    return (
      <View style={styles.card}>
        <View style={styles.cardContent}>
          {/* Left Side - Product Image */}
          <Image
            source={
              image ? {uri: image} : require('../../../sources/images/c1.png')
            }
            style={styles.productImage}
          />

          {/* Right Side - Product Details */}
          <View style={styles.detailsContainer}>
            {/* Close Button */}
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={handleRemove}
              disabled={isRemoving}>
              {isRemoving ? (
                <ActivityIndicator size="small" color="#888" />
              ) : (
                <Ionicons name="close" size={18} color="#AAA" />
              )}
            </TouchableOpacity>

            {/* Brand/Description */}
            <Text style={styles.brand} numberOfLines={1}>
              {brand || 'Women V-Neck Regular Fit Top'}
            </Text>
            {/* Product Name */}
            <Text style={styles.productName} numberOfLines={2}>
              {name}
            </Text>
            

            {/* Selectors Row */}
            <View style={styles.selectorsRow}>
              {/* Quantity Dropdown */}
              <TouchableOpacity style={styles.dropdown} disabled={isRemoving}>
                <Text style={styles.dropdownLabel}>Qty {qtyInput}</Text>
                <MaterialIcons name="arrow-drop-down" size={18} color="#333" />
              </TouchableOpacity>

              {/* Size Dropdown */}
              <TouchableOpacity 
                style={styles.dropdown}
                onPress={handleSizePress}
                disabled={isRemoving}>
                <Text style={styles.dropdownLabel}>Size {size || 'XS'}</Text>
                <MaterialIcons name="arrow-drop-down" size={18} color="#333" />
              </TouchableOpacity>
            </View>

            {/* Price Row */}
            <View style={styles.priceRow}>
              <Text style={styles.currentPrice}>{formatPrice(price)}</Text>
              {originalPrice && parseFloat(originalPrice.toString()) > parseFloat(price.toString()) && (
                <Text style={styles.strikePrice}>{formatPrice(originalPrice)}</Text>
              )}
              {discount && discount > 0 && (
                <Text style={styles.discountText}>{discount}% OFF</Text>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  },
);

CartItem.displayName = 'CartItem';

export default CartItem;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    height:90,
    marginBottom:25,
  },
  cardContent: {
    flexDirection: 'row',
  },
  productImage: {
    width: 75,
    height: 90,
    marginRight: 20,
    borderRadius: 5,
  },
  detailsContainer: {
    flex: 1,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  productName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#636363',
    lineHeight: 15,
    marginBottom: 5,
    letterSpacing:0.1,
  },
  brand: {
    fontSize: 14,
    color: '#222222',
    marginBottom: 2,
    lineHeight: 20,
    letterSpacing:0.1,
    fontWeight: '600',
  },
  selectorsRow: {
    flexDirection: 'row',
    gap: 5,
    marginBottom: 3,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#222',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#fff',
  },
  dropdownLabel: {
    fontSize: 10,
    color: '#222',
    fontWeight: '500',
    letterSpacing:0.1,
    lineHeight:15,
  },
  priceRow: {
    height:15,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 5,
  },
  currentPrice: {
    fontSize: 12,
    fontWeight: '600',
    color: '#222',
    lineHeight:15,
    letterSpacing:0.1,
  },
  strikePrice: {
    fontSize: 12,
    color: '#636363',
    textDecorationLine: 'line-through',
    lineHeight:15,
    letterSpacing:0.1,
  },
  discountText: {
    fontSize: 12,
    color: '#FF5964',
    fontWeight: '700',
    lineHeight:15,
    letterSpacing:0.1,
  },
});

