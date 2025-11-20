import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../config/Api";
import { RootState } from "../Store";

export interface Store {
  id: number | string;
  name: string;
  logo?: string;
  location?: string;
  latitude?: number | string;
  longitude?: number | string;
  status?: 'Open' | 'Closed';
  offer?: string;
  created_at?: string;
 
}

export type Bookmark = {
  id: string; 
  name?: string;
  logo?: string | null;
};

type BookmarkState = {
  byId: Record<string, Bookmark>;
  ids: string[];
  loading: boolean;
  error: string | null;
  updating: Record<string, boolean>;
  bookmarks: Store[];
};
const initialState: BookmarkState = {
  byId: {},
  ids: [],
  loading: false,
  error: null,
  updating: {},
  bookmarks: [],
};

export const fetchBookmarks = createAsyncThunk<
  Store[], 
  void,
  { rejectValue: string }
>("bookmarks/fetch", async (_, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get("/bookmarks");
    const data = Array.isArray(res.data) ? res.data : [];
    return data as Store[];
  } catch (err: any) {
    console.error("fetchBookmarks error", err);
    return rejectWithValue(err?.response?.data?.message ?? "Failed to fetch bookmarks");
  }
});

export const addBookmark = createAsyncThunk<
  { storeId: string; store?: Store },
  { storeId: string },
  { rejectValue: string }
>("bookmarks/add", async ({ storeId }, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post("/bookmarks", { store_id: storeId });
    const data = res?.data;
    
    if (data && (data.id || data.store_id || data.storeId)) {
      const id = String(data.id ?? data.store_id ?? data.storeId);
      return { storeId: id, store: data as Store };
    }
    return { storeId };
  } catch (err: any) {
    console.error("addBookmark error", err);
    return rejectWithValue(err?.response?.data?.message ?? "Failed to add bookmark");
  }
});


export const removeBookmark = createAsyncThunk<
  { storeId: string },
  { storeId: string },
  { rejectValue: string }
>("bookmarks/remove", async ({ storeId }, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/bookmarks/${storeId}`);
    return { storeId };
  } catch (err: any) {
    console.error("removeBookmark error", err);
    return rejectWithValue(err?.response?.data?.message ?? "Failed to remove bookmark");
  }
});


export const toggleBookmark = createAsyncThunk<
  { storeId: string; action: "added" | "removed" },
  { storeId: string; snapshot?: Partial<Store> },
  { state: RootState; rejectValue: string }
>("bookmarks/toggle", async ({ storeId, snapshot }, { dispatch, getState, rejectWithValue }) => {
  const state = getState();
  const isBookmarked = selectIsBookmarked(state, storeId);

  try {
    if (!isBookmarked) {
      dispatch(optimisticAddBookmark({ storeId, snapshot: snapshot ? { name: snapshot.name, logo: snapshot.logo } : undefined }));
      const result = await dispatch(addBookmark({ storeId })).unwrap();
      return { storeId, action: "added" };
    } else {
      const currentStore = state.bookmarks.bookmarks.find(s => String(s.id) === String(storeId));
      const snap = currentStore ? { name: currentStore.name, logo: currentStore.logo } : undefined;
      dispatch(optimisticRemoveBookmark({ storeId }));
      const result = await dispatch(removeBookmark({ storeId })).unwrap();
      return { storeId, action: "removed" };
    }
  } catch (err: any) {
    return rejectWithValue(err?.message ?? "Toggle failed");
  }
});

const bookmarkSlice = createSlice({
  name: "bookmarks",
  initialState,
  reducers: {
    setInitialBookmarks(state, action: PayloadAction<Store[]>) {
      state.bookmarks = action.payload.slice();
      state.byId = {};
      state.ids = [];
      for (const s of action.payload) {
        const sid = String(s.id);
        state.byId[sid] = { id: sid, name: s.name, logo: s.logo ?? undefined };
        state.ids.push(sid);
      }
      state.loading = false;
      state.error = null;
    },

    optimisticAddBookmark(state, action: PayloadAction<{ storeId: string; snapshot?: Partial<Bookmark> }>) {
      const sid = String(action.payload.storeId);
      if (!state.ids.includes(sid)) {
        state.ids.unshift(sid);
        state.byId[sid] = { id: sid, ...(action.payload.snapshot ?? {}) };
        state.bookmarks.unshift({
          id: sid,
          name: action.payload.snapshot?.name ?? "Store",
          logo: action.payload.snapshot?.logo ?? undefined,
        } as Store);
      }
      state.updating[sid] = true;
    },
    optimisticRemoveBookmark(state, action: PayloadAction<{ storeId: string }>) {
      const sid = String(action.payload.storeId);
      if (state.ids.includes(sid)) {
        state.ids = state.ids.filter((i) => i !== sid);
        delete state.byId[sid];
        state.bookmarks = state.bookmarks.filter(s => String(s.id) !== sid);
      }
      state.updating[sid] = true;
    },

    rollbackAdd(state, action: PayloadAction<{ storeId: string }>) {
      const sid = String(action.payload.storeId);
      state.ids = state.ids.filter((i) => i !== sid);
      delete state.byId[sid];
      state.bookmarks = state.bookmarks.filter(s => String(s.id) !== sid);
      delete state.updating[sid];
      state.error = "Failed to save bookmark";
    },
    rollbackRemove(state, action: PayloadAction<{ storeId: string; snapshot?: Partial<Store> }>) {
      const sid = String(action.payload.storeId);
      if (!state.ids.includes(sid)) {
        state.ids.unshift(sid);
      }
      if (!state.byId[sid]) {
        state.byId[sid] = { id: sid, name: action.payload.snapshot?.name, logo: action.payload.snapshot?.logo ?? undefined };
      }
      if (action.payload.snapshot) {
        state.bookmarks.unshift({
          id: sid,
          name: action.payload.snapshot.name ?? "Store",
          logo: action.payload.snapshot.logo ?? undefined,
        } as Store);
      }
      delete state.updating[sid];
      state.error = "Failed to remove bookmark";
    },

    clearBookmarkError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchBookmarks.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchBookmarks.fulfilled, (state, action: PayloadAction<Store[]>) => {
      state.loading = false;
      state.error = null;
      state.bookmarks = action.payload.slice();
      state.byId = {};
      state.ids = [];
      for (const s of action.payload) {
        const sid = String(s.id);
        state.byId[sid] = { id: sid, name: s.name, logo: s.logo ?? undefined };
        state.ids.push(sid);
      }
    });

    builder.addCase(fetchBookmarks.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? "Could not fetch bookmarks";
    });

    builder.addCase(addBookmark.fulfilled, (state, action) => {
      const sid = String(action.payload.storeId);
      delete state.updating[sid];
      state.error = null;
      if (action.payload.store) {
        const s = action.payload.store;
        if (!state.ids.includes(sid)) {
          state.ids.unshift(sid);
          state.byId[sid] = { id: sid, name: s.name, logo: s.logo ?? undefined };
          state.bookmarks.unshift(s);
        } else {
          state.byId[sid] = { id: sid, name: s.name, logo: s.logo ?? undefined };
          state.bookmarks = [s, ...state.bookmarks.filter(st => String(st.id) !== sid)];
        }
      } else {
        if (!state.ids.includes(sid)) {
          state.ids.unshift(sid);
          state.byId[sid] = { id: sid };
          state.bookmarks.unshift({ id: sid, name: "Store" } as Store);
        }
      }
    });

    builder.addCase(addBookmark.rejected, (state, action) => {
      const storeId = (action.meta.arg as { storeId: string }).storeId;
      const sid = String(storeId);
      state.ids = state.ids.filter((i) => i !== sid);
      delete state.byId[sid];
      state.bookmarks = state.bookmarks.filter(s => String(s.id) !== sid);
      delete state.updating[sid];
      state.error = action.payload ?? "Failed to add bookmark";
    });

    builder.addCase(removeBookmark.fulfilled, (state, action) => {
      const sid = String(action.payload.storeId);
      delete state.updating[sid];
      state.error = null;
      delete state.byId[sid];
      state.ids = state.ids.filter((i) => i !== sid);
      state.bookmarks = state.bookmarks.filter(s => String(s.id) !== sid);
    });

    builder.addCase(removeBookmark.rejected, (state, action) => {
      const storeId = (action.meta.arg as { storeId: string }).storeId;
      const sid = String(storeId);
      delete state.updating[sid];
      state.error = action.payload ?? "Failed to remove bookmark";
    });
  },
});

export const {
  setInitialBookmarks,
  optimisticAddBookmark,
  optimisticRemoveBookmark,
  rollbackAdd,
  rollbackRemove,
  clearBookmarkError,
} = bookmarkSlice.actions;

export default bookmarkSlice.reducer;
export const selectBookmarkState = (state: RootState) => state.bookmarks;

export const selectBookmarkIds = (state: RootState) => state.bookmarks.ids;

export const selectBookmarkedStores = (state: RootState) => state.bookmarks.bookmarks;

export const selectIsBookmarked = (state: RootState, storeId: string) =>
  Boolean(state.bookmarks.byId[String(storeId)]);

export const selectBookmarkLoading = (state: RootState) => state.bookmarks.loading;

export const selectBookmarkUpdating = (state: RootState, storeId: string) =>
  Boolean(state.bookmarks.updating[String(storeId)]);
