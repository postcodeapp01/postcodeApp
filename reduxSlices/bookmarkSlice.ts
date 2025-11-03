// // src/store/bookmarks/bookmarkSlice.ts
// import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
// import axiosInstance from "../config/Api";
// import { RootState } from "../Store";

// /* ---------------------------
//  Types
// ----------------------------*/
// export type Bookmark = {
//   id: number | string; // store id (server uses INT but keep flexible)
//   // optionally include small store snapshot if backend returns it:
//   name?: string;
//   logo?: string | null;
//   // ...add fields you expect
// };

// type BookmarkState = {
//   byId: Record<string, Bookmark>;
//   ids: string[]; // store ids as strings for consistent keys
//   loading: boolean;
//   error: string | null;
//   updating: Record<string, boolean>;
//   bookmarks: Store[];
// };
// export interface Store {
//   id: number | string;
//   name: string;
//   logo?: string;
//   location?: string;
//   latitude?: number;
//   longitude?: number;
//   status?: 'Open' | 'Closed';
//   offer?: string;
// }
// /* ---------------------------
//  Initial state
// ----------------------------*/
// const initialState: BookmarkState = {
//   byId: {},
//   ids: [],
//   loading: false,
//   error: null,
//   updating: {},
//  bookmarks: []
// };


// export const fetchBookmarks = createAsyncThunk<
//   Bookmark[], // returned
//   void, // arg
//   { rejectValue: string }
// >("bookmarks/fetch", async (_, { rejectWithValue }) => {
//   try {
//     const res = await axiosInstance.get("/bookmarks");
//     console.log("booked data",res.data)
//     // expected res.data = [{ id: 1, name: 'x' }, ...] or [{ store_id: 1 }, ...]
//     const data = Array.isArray(res.data) ? res.data : [];
//     // normalize into Bookmark[]
//     const normalized: Bookmark[] = data.map((item: any) => {
//       // support both shapes
//       const id = item.store_id ?? item.id ?? item.ID ?? item.storeId;
//       return {
//         id: String(id),
//         name: item.name ?? item.storeName ?? undefined,
//         logo: item.logo ?? undefined,
//       };
//     });
//     return normalized;
//   } catch (err: any) {
//     console.error("fetchBookmarks error", err);
//     return rejectWithValue(err?.response?.data?.message ?? "Failed to fetch bookmarks");
//   }
// });

// /**
//  * Add a bookmark (optimistic handled in slice: optimisticAddBookmark + rollback on failure)
//  * Expects POST /api/bookmarks { store_id }
//  */
// export const addBookmark = createAsyncThunk<
//   { storeId: string },
//   { storeId: string },
//   { rejectValue: string }
// >("bookmarks/add", async ({ storeId }, { dispatch, rejectWithValue }) => {
//   try {
//     // call API
//     console.log("store id in bool slice",storeId)
//     await axiosInstance.post("/bookmarks", { store_id: storeId });
//     return { storeId };
//   } catch (err: any) {
//     console.error("addBookmark error", err);
//     return rejectWithValue(err?.response?.data?.message ?? "Failed to add bookmark");
//   }
// });

// /**
//  * Remove a bookmark
//  * Expects DELETE /api/bookmarks/:storeId
//  */
// export const removeBookmark = createAsyncThunk<
//   { storeId: string },
//   { storeId: string },
//   { rejectValue: string }
// >("bookmarks/remove", async ({ storeId }, { rejectWithValue }) => {
//   try {
//     await axiosInstance.delete(`/bookmarks/${storeId}`);
//     return { storeId };
//   } catch (err: any) {
//     console.error("removeBookmark error", err);
//     return rejectWithValue(err?.response?.data?.message ?? "Failed to remove bookmark");
//   }
// });

// /**
//  * Toggle bookmark (convenience thunk): will read state and call add/remove accordingly.
//  */
// export const toggleBookmark = createAsyncThunk<
//   { storeId: string; action: "added" | "removed" },
//   { storeId: string },
//   { state: RootState; rejectValue: string }
// >("bookmarks/toggle", async ({ storeId }, { dispatch, getState, rejectWithValue }) => {
//   const state = getState();
//   const isBookmarked = selectIsBookmarked(state, storeId);

//   try {
//     if (!isBookmarked) {
//       // optimistic update: dispatch immediate local change
//       dispatch(optimisticAddBookmark({ storeId }));
//       const result = await dispatch(addBookmark({ storeId })).unwrap();
//       return { storeId, action: "added" };
//     } else {
//       dispatch(optimisticRemoveBookmark({ storeId }));
//       const result = await dispatch(removeBookmark({ storeId })).unwrap();
//       return { storeId, action: "removed" };
//     }
//   } catch (err: any) {
//     // rollback logic handled in extraReducers for add/remove rejections
//     return rejectWithValue(err ?? "Toggle failed");
//   }
// });

// /* ---------------------------
//  Slice
// ----------------------------*/
// const bookmarkSlice = createSlice({
//   name: "bookmarks",
//   initialState,
//   reducers: {
//     // optimistic reducers called before API completes
//     optimisticAddBookmark(state, action: PayloadAction<{ storeId: string; snapshot?: Partial<Bookmark> }>) {
//       const sid = String(action.payload.storeId);
//       if (!state.ids.includes(sid)) {
//         state.ids.unshift(sid);
//         state.byId[sid] = { id: sid, ...(action.payload.snapshot ?? {}) };
//       }
//       state.updating[sid] = true;
//     },
//     optimisticRemoveBookmark(state, action: PayloadAction<{ storeId: string }>) {
//       const sid = String(action.payload.storeId);
//       if (state.ids.includes(sid)) {
//         state.ids = state.ids.filter((i) => i !== sid);
//         delete state.byId[sid];
//       }
//       state.updating[sid] = true;
//     },

//     // Rollback actions if API fails
//     rollbackAdd(state, action: PayloadAction<{ storeId: string }>) {
//       const sid = String(action.payload.storeId);
//       // remove the optimistic addition
//       state.ids = state.ids.filter((i) => i !== sid);
//       delete state.byId[sid];
//       delete state.updating[sid];
//       state.error = "Failed to save bookmark";
//     },
//     rollbackRemove(state, action: PayloadAction<{ storeId: string; snapshot?: Partial<Bookmark> }>) {
//       const sid = String(action.payload.storeId);
//       // restore the removed bookmark
//       if (!state.ids.includes(sid)) {
//         state.ids.unshift(sid);
//         state.byId[sid] = { id: sid, ...(action.payload.snapshot ?? {}) };
//       }
//       delete state.updating[sid];
//       state.error = "Failed to remove bookmark";
//     },

//     // clear errors
//     clearBookmarkError(state) {
//       state.error = null;
//     },
//   },

//   extraReducers: (builder) => {
//     /* fetchBookmarks lifecycle */
//     builder.addCase(fetchBookmarks.pending, (state) => {
//       state.loading = true;
//       state.error = null;
//     });
//     builder.addCase(fetchBookmarks.fulfilled, (state, action: PayloadAction<Bookmark[]>) => {
//       state.loading = false;
//       state.error = null;
//       state.byId = {};
//       state.ids = [];
//       state.bookmarks=action.payload;
//       action.payload.forEach((b) => {
//         const sid = String(b.id);
//         state.byId[sid] = b;
//         state.ids.push(sid);
//       });
//     });
//     builder.addCase(fetchBookmarks.rejected, (state, action) => {
//       state.loading = false;
//       state.error = action.payload ?? "Could not fetch bookmarks";
//     });

//     /* addBookmark */
//     builder.addCase(addBookmark.pending, (state, action) => {
//       // pending handled by optimisticAddBookmark when toggle is used.
//     });
//     builder.addCase(addBookmark.fulfilled, (state, action) => {
//       const sid = String(action.payload.storeId);
//       // mark updating false
//       delete state.updating[sid];
//       state.error = null;
//       // ensure exists (if not added optimistically)
//       if (!state.ids.includes(sid)) {
//         state.ids.unshift(sid);
//         state.byId[sid] = { id: sid };
//       }
//     });
//     builder.addCase(addBookmark.rejected, (state, action) => {
//       const storeId = (action.meta.arg as { storeId: string }).storeId;
//       const sid = String(storeId);
//       // rollback optimistic add
//       state.ids = state.ids.filter((i) => i !== sid);
//       delete state.byId[sid];
//       delete state.updating[sid];
//       state.error = action.payload ?? "Failed to add bookmark";
//     });

//     /* removeBookmark */
//     builder.addCase(removeBookmark.pending, (state, action) => {
//       // pending handled by optimisticRemoveBookmark when toggle used.
//     });
//     builder.addCase(removeBookmark.fulfilled, (state, action) => {
//       const sid = String(action.payload.storeId);
//       delete state.updating[sid];
//       state.error = null;
//       // already removed optimistically; ensure byId cleaned
//       delete state.byId[sid];
//       state.ids = state.ids.filter((i) => i !== sid);
//     });
//     builder.addCase(removeBookmark.rejected, (state, action) => {
//       const storeId = (action.meta.arg as { storeId: string }).storeId;
//       const sid = String(storeId);
//       // rollback: we cannot reconstruct snapshot here unless the caller provided one.
//       // Mark error and clear updating flag
//       delete state.updating[sid];
//       state.error = action.payload ?? "Failed to remove bookmark";
//     });
//   },
// });

// /* ---------------------------
//  Exports
// ----------------------------*/
// export const {
//   optimisticAddBookmark,
//   optimisticRemoveBookmark,
//   rollbackAdd,
//   rollbackRemove,
//   clearBookmarkError,
// } = bookmarkSlice.actions;

// export default bookmarkSlice.reducer;

// /* ---------------------------
//  Selectors
// ----------------------------*/
// export const selectBookmarkState = (state: RootState) => state.bookmarks;

// export const selectBookmarkIds = (state: RootState) => state.bookmarks.ids;

// export const selectBookmarkedStores = (state: RootState) =>
//   state.bookmarks.ids.map((id) => state.bookmarks.byId[id]);

// export const selectIsBookmarked = (state: RootState, storeId: string) =>
//   Boolean(state.bookmarks.byId[String(storeId)]);

// export const selectBookmarkLoading = (state: RootState) => state.bookmarks.loading;

// export const selectBookmarkUpdating = (state: RootState, storeId: string) =>
//   Boolean(state.bookmarks.updating[String(storeId)]);
// src/store/bookmarks/bookmarkSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../config/Api";
import { RootState } from "../Store";

/* ---------------------------
 Types
----------------------------*/
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
  // add other fields returned by your backend as needed
}

export type Bookmark = {
  id: string; // store id as string for consistency
  name?: string;
  logo?: string | null;
};

type BookmarkState = {
  byId: Record<string, Bookmark>;
  ids: string[]; // store ids as strings for consistent keys
  loading: boolean;
  error: string | null;
  updating: Record<string, boolean>;
  bookmarks: Store[]; // canonical array used by UI (My Stores screen)
};

/* ---------------------------
 Initial state
----------------------------*/
const initialState: BookmarkState = {
  byId: {},
  ids: [],
  loading: false,
  error: null,
  updating: {},
  bookmarks: [],
};

/* ---------------------------
 Thunks
----------------------------*/

/**
 * Fetch all bookmarked stores for the logged-in user.
 * Backend returns full store objects array (based on your log).
 */
export const fetchBookmarks = createAsyncThunk<
  Store[], // returned (array of full store objects)
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

/**
 * Add a bookmark.
 * Backend ideally returns the created store object, but could return minimal.
 * We'll accept both shapes.
 * Expects POST /bookmarks { store_id }
 */
export const addBookmark = createAsyncThunk<
  { storeId: string; store?: Store },
  { storeId: string },
  { rejectValue: string }
>("bookmarks/add", async ({ storeId }, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post("/bookmarks", { store_id: storeId });
    const data = res?.data;
    // If backend returned the store object, use it
    if (data && (data.id || data.store_id || data.storeId)) {
      const id = String(data.id ?? data.store_id ?? data.storeId);
      return { storeId: id, store: data as Store };
    }
    // otherwise return just storeId
    return { storeId };
  } catch (err: any) {
    console.error("addBookmark error", err);
    return rejectWithValue(err?.response?.data?.message ?? "Failed to add bookmark");
  }
});

/**
 * Remove a bookmark
 * Expects DELETE /bookmarks/:storeId
 */
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

/**
 * Toggle bookmark: optimistic update + call add/remove.
 */
export const toggleBookmark = createAsyncThunk<
  { storeId: string; action: "added" | "removed" },
  { storeId: string; snapshot?: Partial<Store> },
  { state: RootState; rejectValue: string }
>("bookmarks/toggle", async ({ storeId, snapshot }, { dispatch, getState, rejectWithValue }) => {
  const state = getState();
  const isBookmarked = selectIsBookmarked(state, storeId);

  try {
    if (!isBookmarked) {
      // optimistic add (we pass a tiny snapshot so UI can display name/logo immediately)
      dispatch(optimisticAddBookmark({ storeId, snapshot: snapshot ? { name: snapshot.name, logo: snapshot.logo } : undefined }));
      const result = await dispatch(addBookmark({ storeId })).unwrap();
      return { storeId, action: "added" };
    } else {
      // capture snapshot to allow rollback if needed
      const currentStore = state.bookmarks.bookmarks.find(s => String(s.id) === String(storeId));
      const snap = currentStore ? { name: currentStore.name, logo: currentStore.logo } : undefined;
      dispatch(optimisticRemoveBookmark({ storeId }));
      const result = await dispatch(removeBookmark({ storeId })).unwrap();
      return { storeId, action: "removed" };
    }
  } catch (err: any) {
    // the add/remove.rejected handlers will handle rollback; still return reject
    return rejectWithValue(err?.message ?? "Toggle failed");
  }
});

/* ---------------------------
 Slice
----------------------------*/
const bookmarkSlice = createSlice({
  name: "bookmarks",
  initialState,
  reducers: {
    // Allows hydrating bookmarks array directly (e.g. persist/rehydrate)
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

    // optimistic reducers
    optimisticAddBookmark(state, action: PayloadAction<{ storeId: string; snapshot?: Partial<Bookmark> }>) {
      const sid = String(action.payload.storeId);
      if (!state.ids.includes(sid)) {
        state.ids.unshift(sid);
        state.byId[sid] = { id: sid, ...(action.payload.snapshot ?? {}) };
        // for bookmarks array push a minimal placeholder (UI can enrich later)
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

    // rollback actions if API fails
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
      // restore into bookmarks array at front (or you could restore to original position if you tracked it)
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
    /* fetchBookmarks lifecycle */
    builder.addCase(fetchBookmarks.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchBookmarks.fulfilled, (state, action: PayloadAction<Store[]>) => {
      state.loading = false;
      state.error = null;

      // canonical array
      state.bookmarks = action.payload.slice();

      // normalized maps
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

    /* addBookmark */
    builder.addCase(addBookmark.fulfilled, (state, action) => {
      const sid = String(action.payload.storeId);
      // stop updating flag
      delete state.updating[sid];
      state.error = null;

      // if backend returned a full store object, add/enrich bookmarks array and byId
      if (action.payload.store) {
        const s = action.payload.store;
        // avoid duplicates
        if (!state.ids.includes(sid)) {
          state.ids.unshift(sid);
          state.byId[sid] = { id: sid, name: s.name, logo: s.logo ?? undefined };
          state.bookmarks.unshift(s);
        } else {
          // replace existing normalized and array item
          state.byId[sid] = { id: sid, name: s.name, logo: s.logo ?? undefined };
          state.bookmarks = [s, ...state.bookmarks.filter(st => String(st.id) !== sid)];
        }
      } else {
        // backend returned only id - ensure normalized state is present
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
      // rollback optimistic add if it was used
      state.ids = state.ids.filter((i) => i !== sid);
      delete state.byId[sid];
      state.bookmarks = state.bookmarks.filter(s => String(s.id) !== sid);
      delete state.updating[sid];
      state.error = action.payload ?? "Failed to add bookmark";
    });

    /* removeBookmark */
    builder.addCase(removeBookmark.fulfilled, (state, action) => {
      const sid = String(action.payload.storeId);
      delete state.updating[sid];
      state.error = null;
      // remove from normalized and array
      delete state.byId[sid];
      state.ids = state.ids.filter((i) => i !== sid);
      state.bookmarks = state.bookmarks.filter(s => String(s.id) !== sid);
    });

    builder.addCase(removeBookmark.rejected, (state, action) => {
      const storeId = (action.meta.arg as { storeId: string }).storeId;
      const sid = String(storeId);
      delete state.updating[sid];
      state.error = action.payload ?? "Failed to remove bookmark";
      // NOTE: rollback should be triggered using rollbackRemove with snapshot captured by caller if needed
    });
  },
});

/* ---------------------------
 Exports
----------------------------*/
export const {
  setInitialBookmarks,
  optimisticAddBookmark,
  optimisticRemoveBookmark,
  rollbackAdd,
  rollbackRemove,
  clearBookmarkError,
} = bookmarkSlice.actions;

export default bookmarkSlice.reducer;

/* ---------------------------
 Selectors
----------------------------*/
export const selectBookmarkState = (state: RootState) => state.bookmarks;

export const selectBookmarkIds = (state: RootState) => state.bookmarks.ids;

export const selectBookmarkedStores = (state: RootState) => state.bookmarks.bookmarks;

export const selectIsBookmarked = (state: RootState, storeId: string) =>
  Boolean(state.bookmarks.byId[String(storeId)]);

export const selectBookmarkLoading = (state: RootState) => state.bookmarks.loading;

export const selectBookmarkUpdating = (state: RootState, storeId: string) =>
  Boolean(state.bookmarks.updating[String(storeId)]);
