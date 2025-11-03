import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../config/Api';

// ---------- Types ----------
export type CartItemType = {
  cartId?: string | number;
  productId: string | number;
  name?: string;
  brand?: string;
  image?: string | null;
  price: number | string;
  originalPrice?: number | string;
  discount?: number;
  qty: number;
  size?: string | null;
  color?: string | null;
  color_id?: number | null;
  store_id?: number;
  store_name?: string;
  store_latitude?: number | null;
  store_longitude?: number | null;
};

export type StoreGroup = {
  store_id: number;
  store_name: string;
  store_latitude?: number | null;
  store_longitude?: number | null;
  items: CartItemType[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  isCompleted?: boolean;
  image?: string;
};

export type CartState = {
  items: CartItemType[];
  storeGroups: StoreGroup[];
  subtotal: number;
  deliveryFee: number;
  gst: number;
  platformFee: number;
  total: number;
  loading: boolean;
  error: string | null;
};

// ---------- Initial ----------
const initialState: CartState = {
  items: [],
  storeGroups: [],
  subtotal: 0,
  deliveryFee: 0,
  gst: 0,
  platformFee: 8,
  total: 0,
  loading: false,
  error: null,
};

// ---------- Helpers ----------
const buildGroupsFromItems = (items: CartItemType[]): StoreGroup[] => {
  const map = new Map<number, StoreGroup>();

  for (const it of items) {
    const sid = Number(it.store_id);
    if (!map.has(sid)) {
      map.set(sid, {
        store_id: sid,
        store_name: it.store_name ?? `Store ${sid}`,
        store_latitude: it.store_latitude ?? null,
        store_longitude: it.store_longitude ?? null,
        items: [],
        subtotal: 0,
        deliveryFee: 0,
        total: 0,
        isCompleted: false,
      });
    }
    map.get(sid)!.items.push(it);
  }

  const groups = Array.from(map.values());
  groups.forEach(g => {
    g.subtotal = g.items.reduce((s, i) => s + Number(i.price) * Number(i.qty), 0);
    g.deliveryFee = g.subtotal > 500 ? 0 : 40;
    g.total = g.subtotal + g.deliveryFee;
  });

  return groups;
};

const recalcTotals = (groups: StoreGroup[]) => {
  const subtotal = groups.reduce((s, g) => s + g.subtotal, 0);
  const deliveryFee = groups.reduce((s, g) => s + (g.deliveryFee || 0), 0);
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + deliveryFee;
  return { subtotal, deliveryFee, gst, total };
};

// ---------- Async Helpers ----------
const buildGroupsFromItemsAsync = async (items: CartItemType[]): Promise<StoreGroup[]> => {
  const groups = buildGroupsFromItems(items);
  const storeIds = groups.map(g => g.store_id).filter(id => id !== -1);

  if (storeIds.length === 0) return groups;

  const storeCache = new Map<number, { latitude?: number; longitude?: number; name?: string }>();

  await Promise.all(
    storeIds.map(async sid => {
      try {
        if (storeCache.has(sid)) return;
        const res = await axiosInstance.get(`/stores/details/${sid}`);
        const store = res?.data ?? {};
        storeCache.set(sid, {
          latitude: store.latitude ? parseFloat(store.latitude) : null,
          longitude: store.longitude ? parseFloat(store.longitude) : null,
          name: store.name,
        });
      } catch (err) {
        console.warn(`Failed to fetch store details for ${sid}`, err);
        storeCache.set(sid, {});
      }
    }),
  );

  for (const g of groups) {
    const cached = storeCache.get(g.store_id);
    if (cached) {
      if (cached.latitude != null) g.store_latitude = cached.latitude;
      if (cached.longitude != null) g.store_longitude = cached.longitude;
      if (cached.name) g.store_name = cached.name;
    }
  }

  return groups;
};

// ---------- Async Thunks ----------
export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, thunkAPI) => {
  const res = await axiosInstance.get('/cart');
  const items: CartItemType[] = res.data || [];
  const storeGroups = await buildGroupsFromItemsAsync(items);
  const totals = recalcTotals(storeGroups);
  return { items, storeGroups, ...totals };
});

export const addItemToCart = createAsyncThunk<
  CartItemType,
  CartItemType,
  { rejectValue: string }
>('cart/addItemToCart', async (payload, thunkAPI) => {
  try {
    const res = await axiosInstance.post('/cart', payload);
    const createdItem: CartItemType = res.data?.item ?? res.data;
    await thunkAPI.dispatch(fetchCart() as any);
    return createdItem;
  } catch (err: any) {
    console.error('addItemToCart API error', err);
    return thunkAPI.rejectWithValue(err?.message ?? 'Failed to add item');
  }
});

export const updateCartItemOnServer = createAsyncThunk(
  'cart/updateCartItem',
  async (args: { cartId: string; qty: number; size?: string; colorId?: string }, thunkAPI) => {
    const { cartId, qty, size, colorId } = args;
    await axiosInstance.put(`/cart/${cartId}`, { qty, size, colorId });
    await thunkAPI.dispatch(fetchCart() as any);
    return { cartId, qty, size, colorId };
  },
);

export const removeCartItemOnServer = createAsyncThunk(
  'cart/removeCartItem',
  async (cartId: string, thunkAPI) => {
    await axiosInstance.delete(`/cart/${cartId}`);
    await thunkAPI.dispatch(fetchCart() as any);
    return cartId;
  },
);

// ---------- Slice ----------
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartFromServer: (
      state,
      action: PayloadAction<{ items: CartItemType[]; storeGroups: StoreGroup[] }>,
    ) => {
      const { items, storeGroups } = action.payload;
      state.items = items;
      state.storeGroups = storeGroups;
      const totals = recalcTotals(storeGroups);
      Object.assign(state, totals);
    },
    clearCartLocal: state => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: builder => {
    builder
      // fetchCart
      .addCase(fetchCart.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        Object.assign(state, action.payload);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch cart';
      })
      // addItemToCart
      .addCase(addItemToCart.fulfilled, (state, _action) => {
        state.error = null;
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.error = action.payload || action.error.message || 'Failed to add item';
      })
      // updateCartItemOnServer
      .addCase(updateCartItemOnServer.pending, state => {
        state.loading = true;
      })
      .addCase(updateCartItemOnServer.fulfilled, state => {
        state.loading = false;
      })
      .addCase(updateCartItemOnServer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update item';
      })
      // removeCartItemOnServer
      .addCase(removeCartItemOnServer.pending, state => {
        state.loading = true;
      })
      .addCase(removeCartItemOnServer.fulfilled, state => {
        state.loading = false;
      })
      .addCase(removeCartItemOnServer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to remove item';
      });
  },
});

export const { setCartFromServer, clearCartLocal } = cartSlice.actions;
export default cartSlice.reducer;
