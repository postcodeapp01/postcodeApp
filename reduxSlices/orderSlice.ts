
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import axiosInstance from '../config/Api'; 
import type {RootState} from '../Store';

export type OrderItem = {
  orderItemId: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  finalPrice?: number;
  itemStatus?: string;
  brand?: string | null;
  image?: string | null;
};

export type OrderStoreGroup = {
  storeGroupId: string;
  storeOrderNumber?: string;
  storeId?: string | null;
  storeName?: string | null;
  storeSubtotal?: number;
  storeTax?: number;
  storeTotal?: number;
  storeTotalItems?: number;
  storeStatus?: string;
  driver?: any;
  items?: OrderItem[];
};

export type Order = {
  orderId: string;
  orderNumber?: string;
  orderStatus?: string;
  placedAt?: string;
  subtotal?: number;
  tax?: number;
  shippingFee?: number;
  grandTotal?: number;
  storeGroups?: OrderStoreGroup[];
  metadata?: any;
  shippingAddress?: any | null;
};

type OrdersState = {
  list: Order[];
  loading: boolean;
  error: string | null;
  fetchingOrderId?: string | null;
  deletingStore: {[key: string]: boolean}; // key: `${orderId}:${storeGroupId}`
  deletingOrders: {[orderId: string]: boolean};
};

const initialState: OrdersState = {
  list: [],
  loading: false,
  error: null,
  fetchingOrderId: null,
  deletingStore: {},
  deletingOrders: {},
};

function recalcOrderFromStoreGroups(order: Order): Partial<Order> {
  const groups = order.storeGroups ?? [];
  const subtotal = groups.reduce((s, g) => s + Number(g.storeSubtotal ?? 0), 0);
  const tax = groups.reduce((s, g) => s + Number(g.storeTax ?? 0), 0);
  const shippingFee = Number(order.shippingFee ?? 0);
  const grandTotal = Number((subtotal + tax + shippingFee).toFixed(2));
  return {subtotal, tax, shippingFee, grandTotal};
}

export const fetchOrders = createAsyncThunk<
  Order[],
  {page?: number; limit?: number} | void,
  {state: RootState}
>('orders/fetchAll', async (params, {rejectWithValue}) => {
  try {
    const p = params ?? {};
    const q = [];
    if (p.page) q.push(`page=${p.page}`);
    if (p.limit) q.push(`limit=${p.limit}`);
    const url = `/orders${q.length ? '?' + q.join('&') : ''}`;
    const res = await axiosInstance.get(url);
    return res.data?.data ?? [];
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message ?? err?.message ?? 'Failed to fetch orders',
    );
  }
});

export const deleteOrderStoreGroup = createAsyncThunk<
  {
    orderId: string;
    storeGroupId: string;
    updatedOrder?: Order;
    remainingGroups?: OrderStoreGroup[];
  },
  {orderId: string; storeGroupId: string},
  {state: RootState}
>(
  'orders/deleteStoreGroup',
  async ({orderId, storeGroupId}, {getState, rejectWithValue}) => {
    try {
      const res = await axiosInstance.delete(
        `/orders/${orderId}/store-groups/${storeGroupId}`,
      );
      // backend should return updated order + remaining groups
      const data = res.data ?? {};
      // normalize to a simple shape:
      return {
        orderId,
        storeGroupId,
        updatedOrder: data.order ?? undefined,
        remainingGroups: data.storeGroups ?? undefined,
      };
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data ?? err?.message ?? 'Failed to delete store group',
      );
    }
  },
);
export const updateOrderStatus = createAsyncThunk<
  {orderId: string; order?: Order},
  {orderId: string; orderStatus: string; updatedAt?: string},
  {state: RootState}
>(
  'orders/updateStatus',
  async ({orderId, orderStatus, updatedAt}, {rejectWithValue}) => {
    try {
      const body: any = {orderStatus};
      if (updatedAt) body.updatedAt = updatedAt;
      const res = await axiosInstance.patch(`/orders/${orderId}`, body);
      const updatedOrder = res.data?.data ?? res.data ?? null;
      return {orderId: String(orderId), order: updatedOrder ?? undefined};
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data ?? err?.message ?? 'Failed to update order status',
      );
    }
  },
);
export const deleteOrder = createAsyncThunk<
  {orderId: string},
  {orderId: string},
  {state: RootState}
>('orders/deleteOrder', async ({orderId}, {rejectWithValue}) => {
  try {
    const res = await axiosInstance.delete(`/orders/${orderId}`);
    return {orderId: String(orderId)};
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data ?? err?.message ?? 'Failed to delete order',
    );
  }
});
export const fetchOrderById = createAsyncThunk<
  any,
  {orderId: string},
  {state: RootState}
>('orders/fetchById', async ({orderId}, {rejectWithValue}) => {
  try {
    const res = await axiosInstance.get(`/orders/${orderId}`);
    return res.data?.data ?? res.data ?? {};
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data ?? err?.message ?? 'Failed to fetch order',
    );
  }
});
const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders(state, action: PayloadAction<Order[]>) {
      state.list = action.payload;
    },
    upsertOrder(state, action: PayloadAction<Order>) {
      const idx = state.list.findIndex(
        o => String(o.orderId) === String(action.payload.orderId),
      );
      if (idx === -1) state.list.unshift(action.payload);
      else state.list[idx] = action.payload;
    },
    removeStoreGroupLocally(
      state,
      action: PayloadAction<{orderId: string; storeGroupId: string}>,
    ) {
      const {orderId, storeGroupId} = action.payload;
      const order = state.list.find(o => String(o.orderId) === String(orderId));
      if (!order) return;
      order.storeGroups = (order.storeGroups ?? []).filter(
        sg => String(sg.storeGroupId) !== String(storeGroupId),
      );
      // recalc
      const newVals = recalcOrderFromStoreGroups(order);
      order.subtotal = newVals.subtotal;
      order.tax = newVals.tax;
      order.grandTotal = newVals.grandTotal;
    },
    replaceOrder(
      state,
      action: PayloadAction<{orderId: string; orderSnapshot?: Order | null}>,
    ) {
      const {orderId, orderSnapshot} = action.payload;
      const idx = state.list.findIndex(
        o => String(o.orderId) === String(orderId),
      );
      if (idx !== -1) {
        if (orderSnapshot) state.list[idx] = orderSnapshot;
        else state.list.splice(idx, 1);
      } else if (orderSnapshot) {
        state.list.unshift(orderSnapshot);
      }
    },
    clearOrdersState(state) {
      state.list = [];
      state.error = null;
      state.loading = false;
      state.deletingStore = {};
    },
  },
  extraReducers: builder => {
    // fetch orders
    builder.addCase(fetchOrders.pending, state => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchOrders.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action.payload;
    });
    builder.addCase(fetchOrders.rejected, (state, action) => {
      state.loading = false;
      state.error =
        (action.payload as any) ??
        action.error.message ??
        'Failed to fetch orders';
    });

    // inside createSlice extraReducers builder:
    builder.addCase(fetchOrderById.pending, (state, action) => {
      state.fetchingOrderId = action.meta.arg.orderId;
      state.error = null;
    });

    builder.addCase(fetchOrderById.fulfilled, (state, action) => {
      state.fetchingOrderId = null;
      const order = action.payload;
      if (!order || !order.orderId) return;
      const idx = state.list.findIndex(
        o => String(o.orderId) === String(order.orderId),
      );
      if (idx === -1) state.list.unshift(order);
      else state.list[idx] = order;
    });

    builder.addCase(fetchOrderById.rejected, (state, action) => {
      state.fetchingOrderId = null;
      state.error =
        (action.payload as any) ??
        action.error.message ??
        'Failed to fetch order';
    });

    // delete store group optimistic workflow
    builder.addCase(deleteOrderStoreGroup.pending, (state, action) => {
      const {orderId, storeGroupId} = action.meta.arg;
      const key = `${orderId}:${storeGroupId}`;
      state.deletingStore[key] = true;
      state.error = null;
      const order = state.list.find(o => String(o.orderId) === String(orderId));
      if (order) {
        order.storeGroups = (order.storeGroups ?? []).filter(
          sg => String(sg.storeGroupId) !== String(storeGroupId),
        );
        const newVals = recalcOrderFromStoreGroups(order);
        order.subtotal = newVals.subtotal;
        order.tax = newVals.tax;
        order.grandTotal = newVals.grandTotal;
      }
    });

    builder.addCase(deleteOrderStoreGroup.fulfilled, (state, action) => {
      const {orderId, storeGroupId, updatedOrder, remainingGroups} =
        action.payload;
      const key = `${orderId}:${storeGroupId}`;
      delete state.deletingStore[key];

      if (updatedOrder) {
        const idx = state.list.findIndex(
          o => String(o.orderId) === String(orderId),
        );
        if (idx !== -1) state.list[idx] = updatedOrder;
        else state.list.unshift(updatedOrder);
      } else {
      }
    });

    builder.addCase(deleteOrderStoreGroup.rejected, (state, action) => {
      const {orderId, storeGroupId} = action.meta.arg;
      const key = `${orderId}:${storeGroupId}`;
      delete state.deletingStore[key];

      state.error =
        (action.payload as any)?.message ??
        action.error.message ??
        'Failed to cancel store';
    });
    builder.addCase(deleteOrder.pending, (state, action) => {
      const orderId = String(action.meta.arg.orderId);
      state.deletingOrders[orderId] = true;
      state.error = null;
      state.list = state.list.filter(o => String(o.orderId) !== orderId);
    });

    builder.addCase(deleteOrder.fulfilled, (state, action) => {
      const {orderId} = action.payload;
      delete state.deletingOrders[String(orderId)];
      state.list = state.list.filter(
        o => String(o.orderId) !== String(orderId),
      );
    });

    builder.addCase(deleteOrder.rejected, (state, action) => {
      const attemptedId = String(action.meta.arg.orderId);
      delete state.deletingOrders[attemptedId];
      state.error =
        (action.payload as any)?.message ??
        action.error.message ??
        'Failed to delete order';
    });
    builder.addCase(updateOrderStatus.pending, (state, action) => {
      state.fetchingOrderId = action.meta.arg.orderId;
    });

    builder.addCase(updateOrderStatus.fulfilled, (state, action) => {
      state.fetchingOrderId = null;
      const {orderId, order} = action.payload;
      if (!order) {
        return;
      }
      const idx = state.list.findIndex(
        o => String(o.orderId) === String(orderId),
      );
      if (idx === -1) {
        state.list.unshift(order);
      } else {
        state.list[idx] = order;
      }
    });

    builder.addCase(updateOrderStatus.rejected, (state, action) => {
      state.fetchingOrderId = null;
      state.error =
        (action.payload as any) ??
        action.error.message ??
        'Failed to update order status';
    });
  },
});

export const {
  setOrders,
  upsertOrder,
  removeStoreGroupLocally,
  replaceOrder,
  clearOrdersState,
} = ordersSlice.actions;

export default ordersSlice.reducer;

export const selectOrders = (state: RootState) => state.orders.list;
export const selectOrdersLoading = (state: RootState) => state.orders.loading;
export const selectOrdersError = (state: RootState) => state.orders.error;
export const selectOrderById = (state: RootState, orderId?: string | number) =>
  state.orders.list.find(o => String(o.orderId) === String(orderId ?? '')) ??
  null;

export const selectDeletingStore = (
  state: RootState,
  orderId?: string | number,
  storeGroupId?: string | number,
) => state.orders.deletingStore?.[`${orderId}:${storeGroupId}`] ?? false;
export const selectDeletingOrder = (
  state: RootState,
  orderId?: string | number,
) => state.orders.deletingOrders?.[String(orderId ?? '')] ?? false;
