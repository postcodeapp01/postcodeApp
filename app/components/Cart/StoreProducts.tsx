// import React, {useEffect, useState, useCallback} from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   Image,
//   StyleSheet,
//   ActivityIndicator,
//   Alert,
// } from 'react-native';
// import axiosInstance from '../../../config/Api';

// type Product = {
//   id?: number | string;
//   productId?: number | string;
//   name?: string;
//   title?: string;
//   price?: number | string;
//   originalPrice?: number | string;
//   image?: string;
//   images?: string[];
//   store_id?: number | string;
//   brand?: string;
//   [key: string]: any;
// };

// interface Props {
//   storeId: number | string | null;
//   limit?: number;
//   existingItems?: any[];
//   title?: string;
//   onAddSuccess?: (newCartItem: any) => void;
// }

// const StoreProducts: React.FC<Props> = ({
//   storeId,
//   limit = 12,
//   existingItems = [],
//   title = 'More from this store',
//   onAddSuccess,
// }) => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [addingMap, setAddingMap] = useState<Record<string, boolean>>({});
//   const [error, setError] = useState<string | null>(null);

//   const fetchProducts = useCallback(async () => {
//     if (!storeId) {
//       setProducts([]);
//       return;
//     }
//     setLoading(true);
//     setError(null);
//     try {
//       let res;
//       try {
//         res = await axiosInstance.get(`/stores/${storeId}/products`);
//       } catch (e) {
//         res = await axiosInstance.get(`/products?store_id=${storeId}&limit=${limit}`);
//       }

//       const data = res?.data;
//       const list = Array.isArray(data) ? data : data?.products ?? data?.items ?? [];

//       // ✅ Filter out items that are already in cart
//       const existingIds = new Set(
//         existingItems.map(i => String(i.productId ?? i.id ?? i.product_id))
//       );
//       const filtered = list.filter(
//         p => !existingIds.has(String(p.id ?? p.productId ?? p.product_id))
//       );

//       setProducts(filtered.slice(0, limit));
//     } catch (err) {
//       console.error('Failed to load store products', err);
//       setError('Failed to load products');
//       setProducts([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [storeId, limit, existingItems]);

//   useEffect(() => {
//     fetchProducts();
//   }, [fetchProducts]);

//   const handleAdd = async (product: Product) => {
//     const pid = String(product.id ?? product.productId ?? Math.random());
//     setAddingMap(m => ({...m, [pid]: true}));

//     try {
//       const res = await axiosInstance.post('/cart', {
//         productId: product.id ?? product.productId,
//         qty: 1,
//         size: null,
//       });

//       const payload = res?.data;
//       const newCartItem = {
//         cartId: payload?.item?.cartId ?? payload?.cartId ?? `tmp-${Date.now()}`,
//         productId: payload?.item?.productId ?? payload?.productId ?? product.id,
//         name: product.name ?? product.title,
//         price: product.price,
//         qty: 1,
//         store_id: product.store_id,
//         image: product.image ?? product.images?.[0],
//       };

//       if (typeof onAddSuccess === 'function') {
//         onAddSuccess(newCartItem);
//       }

//       Alert.alert('Added', `${product.name ?? product.title ?? 'Product'} added to cart.`);
//       setProducts(prev =>
//         prev.filter(p => String(p.id ?? p.productId) !== String(product.id ?? product.productId))
//       );
//     } catch (err) {
//       console.error('Failed to add to cart', err);
//       Alert.alert('Failed', 'Could not add product to cart.');
//     } finally {
//       setAddingMap(m => ({...m, [pid]: false}));
//     }
//   };

//   if (!storeId) return null;

//   return (
//     <View style={styles.wrapper}>
//       <Text style={styles.title}>{title}</Text>

//       {loading ? (
//         <ActivityIndicator style={{marginVertical: 12}} />
//       ) : error ? (
//         <View style={styles.empty}>
//           <Text style={styles.emptyText}>{error}</Text>
//         </View>
//       ) : products.length === 0 ? (
//         <View style={styles.empty}>
//           <Text style={styles.emptyText}>No products found</Text>
//         </View>
//       ) : (
//         <FlatList
//           horizontal
//           data={products}
//           keyExtractor={item =>
//             String(item.id ?? item.productId ?? item.product_id ?? Math.random())
//           }
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={styles.list}
//           renderItem={({item}) => {
//             const price = Number(item.price ?? item.current_price ?? 0);
//             const original = Number(item.originalPrice ?? item.old_price ?? item.mrp ?? 0);
//             const pid = String(item.productId ?? item.id ?? item.product_id ?? Math.random());
//             const adding = !!addingMap[pid];

//             return (
//               <View style={styles.card}>
//                 {item.image || (item.images && item.images[0]) ? (
//                   <Image
//                     source={{uri: item.image ?? item.images?.[0]}}
//                     style={styles.image}
//                   />
//                 ) : (
//                   <View style={styles.imagePlaceholder}>
//                     <Text style={styles.imagePlaceholderText}>
//                       {(item.name ?? item.title ?? 'P')[0]}
//                     </Text>
//                   </View>
//                 )}

//                 <Text style={styles.name} numberOfLines={2}>
//                   {item.name ?? item.title ?? 'Product'}
//                 </Text>

//                 <View style={styles.priceRow}>
//                   <Text style={styles.price}>₹{price.toFixed(2)}</Text>
//                   {original > price ? (
//                     <Text style={styles.original}>₹{original.toFixed(0)}</Text>
//                   ) : null}
//                 </View>

//                 <TouchableOpacity
//                   style={[styles.addBtn]}
//                   disabled={adding}
//                   onPress={() => handleAdd(item)}>
//                   {adding ? (
//                     <ActivityIndicator color="#fff" />
//                   ) : (
//                     <Text style={styles.addBtnText}>Add</Text>
//                   )}
//                 </TouchableOpacity>
//               </View>
//             );
//           }}
//         />
//       )}
//     </View>
//   );
// };

// export default StoreProducts;

// const styles = StyleSheet.create({
//   wrapper: {marginTop: 16},
//   title: {fontSize: 18, fontWeight: '600', marginBottom: 12, marginLeft: 16},
//   list: {paddingHorizontal: 16},
//   card: {
//     width: 140,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     marginRight: 12,
//     padding: 10,
//     elevation: 2,
//   },
//   image: {width: '100%', height: 120, borderRadius: 8, resizeMode: 'cover'},
//   imagePlaceholder: {
//     width: '100%',
//     height: 120,
//     backgroundColor: '#eee',
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   imagePlaceholderText: {fontSize: 32, fontWeight: 'bold', color: '#aaa'},
//   name: {fontSize: 14, marginVertical: 6, fontWeight: '500'},
//   priceRow: {flexDirection: 'row', alignItems: 'center'},
//   price: {fontSize: 14, fontWeight: '600', color: '#222', marginRight: 6},
//   original: {fontSize: 12, color: '#888', textDecorationLine: 'line-through'},
//   addBtn: {
//     backgroundColor: '#007bff',
//     borderRadius: 6,
//     paddingVertical: 6,
//     marginTop: 8,
//     alignItems: 'center',
//   },
//   addBtnText: {color: '#fff', fontWeight: '600'},
//   empty: {alignItems: 'center', paddingVertical: 16},
//   emptyText: {color: '#777'},
// });
import React, {useEffect, useState, useCallback, useMemo} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import axiosInstance from '../../../config/Api';
import {
  addItemLocal,
  addItemToCart,
  rollbackAddLocal,
} from '../../../reduxSlices/cartSlice';
import ProductCard from '../ProductCard';

type Product = {
  id?: number | string;
  productId?: number | string;
  name?: string;
  title?: string;
  price?: number | string;
  originalPrice?: number | string;
  image?: string;
  images?: string[];
  store_id?: number | string;
  brand?: string;
  [key: string]: any;
};

interface Props {
  storeId: number | string | null;
  limit?: number;
  title?: string;
}

const StoreProducts: React.FC<Props> = ({storeId, limit = 12, title}) => {
  const dispatch = useDispatch<any>();
  // pull live cart items from redux
  const cartItems: any[] = useSelector((s: any) => s.cart?.items ?? []);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [addingMap, setAddingMap] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    if (!storeId) {
      setProducts([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let res;
      try {
        res = await axiosInstance.get(`/stores/${storeId}/products`);
      } catch (e) {
        res = await axiosInstance.get(
          `/products?store_id=${storeId}&limit=${limit}`,
        );
      }

      const data = res?.data;
      const list: Product[] = Array.isArray(data)
        ? data
        : data?.products ?? data?.items ?? [];

      setProducts(list.slice(0, limit));
    } catch (err) {
      console.error('Failed to load store products', err);
      setError('Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [storeId, limit]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // filter using live redux cart to remove items that have been added
  const filteredProducts = useMemo(() => {
    const existingIds = new Set(
      cartItems.map(i => String(i.productId ?? i.id ?? i.product_id)),
    );
    return products.filter(
      p => !existingIds.has(String(p.id ?? p.productId ?? p.product_id)),
    );
  }, [products, cartItems]);

  const handleAdd = async (product: Product) => {
    console.log('Handle add', product);
    const localPid = String(
      product.id ?? product.productId ?? `local-${Date.now()}`,
    );
    setAddingMap(prev => ({...prev, [localPid]: true}));

    // Prepare payload for server as your slice expects.
    const payloadForServer = {
      productId: product.id ?? product.productId,
      qty: 1,
      size: 'M',
      // include any other fields your backend expects; cartSlice will pass it to axios
      // don't include cartId here — server will return one. We'll also create a local optimistic id.
    };

    // Create optimistic item that matches CartItemType shape so cart UI updates immediately.
    // Give it a temporary cartId (we want to control this so we can rollback by id).
    const tempCartId = `optimistic-${Date.now()}`;

    try {
      // 2) push to server via your thunk
      // If your backend expects a different payload shape adjust payloadForServer accordingly
      const resultAction = await dispatch(addItemToCart(payloadForServer));

      // unwrap may be available depending on your store typings; handle success/failure:
      if (addItemToCart.fulfilled.match(resultAction)) {
        // success — server returned created item; cartSlice.extraReducers merges/replace optimistic item
        // no further action needed here; filtering by cartItems will hide the product automatically
        Alert.alert(
          'Added',
          `${product.name ?? product.title ?? 'Product'} added to cart.`,
        );
      } else {
        // This block is precautionary; if thunk rejected it'll be caught by catch
        throw (
          resultAction.payload ??
          resultAction.error ??
          new Error('Failed to add')
        );
      }
    } catch (err: any) {
      console.error('Failed to add to cart', err);
      // rollback the optimistic item by its temp id
      try {
        dispatch(rollbackAddLocal({tempCartId}));
      } catch (rollbackErr) {
        console.warn('Rollback failed', rollbackErr);
      }
      Alert.alert('Failed', 'Could not add product to cart.');
    } finally {
      setAddingMap(prev => ({...prev, [localPid]: false}));
    }
  };

  if (!storeId) return null;

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>View More from {title}</Text>

      {loading ? (
        <ActivityIndicator style={{marginVertical: 12}} />
      ) : error ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>{error}</Text>
        </View>
      ) : filteredProducts.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No products found</Text>
        </View>
      ) : (
        <FlatList
          horizontal
          data={filteredProducts}
          keyExtractor={item =>
            String(
              item.id ?? item.productId ?? item.product_id ?? Math.random(),
            )
          }
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.list}
          renderItem={({item}) => {
            return (
              
              <ProductCard
                product={item}
                horizontal={true}
                horizontalCardWidth={180}
                handleAdd={handleAdd}
                actionLabel={'Add'}
              />
            );
          }}
        />
      )}
    </View>
  );
};

export default StoreProducts;

const styles = StyleSheet.create({
  wrapper: {},
  title: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 15,
    marginLeft: 16,
    color: '#222',
  },
  list: {paddingHorizontal: 16},
  card: {
    width: 140,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginRight: 12,
    padding: 10,
    elevation: 2,
  },
  image: {width: '100%', height: 120, borderRadius: 8, resizeMode: 'cover'},
  imagePlaceholder: {
    width: '100%',
    height: 120,
    backgroundColor: '#eee',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderText: {fontSize: 32, fontWeight: 'bold', color: '#aaa'},
  name: {fontSize: 14, marginVertical: 6, fontWeight: '500'},
  priceRow: {flexDirection: 'row', alignItems: 'center'},
  price: {fontSize: 14, fontWeight: '600', color: '#222', marginRight: 6},
  original: {fontSize: 12, color: '#888', textDecorationLine: 'line-through'},
  addBtn: {
    backgroundColor: '#007bff',
    borderRadius: 6,
    paddingVertical: 6,
    marginTop: 8,
    alignItems: 'center',
  },
  addBtnText: {color: '#fff', fontWeight: '600'},
  empty: {alignItems: 'center', paddingVertical: 16},
  emptyText: {color: '#777'},
});
