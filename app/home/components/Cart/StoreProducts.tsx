
import React, {useEffect, useState, useCallback, useMemo} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import axiosInstance from '../../../../config/Api';
import {
  addItemToCart,
  rollbackAddLocal,
} from '../../../../reduxSlices/cartSlice';
import ProductCard from '../ProductCard';
import { useNavigation } from '@react-navigation/native';

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
  const cartItems: any[] = useSelector((s: any) => s.cart?.items ?? []);
  const navigation=useNavigation();
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

    const payloadForServer = {
      productId: product.id ?? product.productId,
      qty: 1,
      size: 'M',

    };

    const tempCartId = `optimistic-${Date.now()}`;

    try {
      const resultAction = await dispatch(addItemToCart(payloadForServer));

      if (addItemToCart.fulfilled.match(resultAction)) {
        Alert.alert(
          'Added',
          `${product.name ?? product.title ?? 'Product'} added to cart.`,
        );
      } else {
        throw (
          resultAction.payload ??
          resultAction.error ??
          new Error('Failed to add')
        );
      }
    } catch (err: any) {
      console.error('Failed to add to cart', err);
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
                // actionLabel={'Add'}
                onPress={() => {
                  console.log("lsajfoofio")
                  navigation.navigate('ProductDetails', {id: item.id});
                }}
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
