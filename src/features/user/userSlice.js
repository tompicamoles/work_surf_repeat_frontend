import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../tierApi/supabase';

// Async thunk to check authentication status
export const checkAuth = createAsyncThunk(
  'user/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to handle sign out
export const signOut = createAsyncThunk(
  'user/signOut',
  async (_, { rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: null,
    session: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    setSession: (state, action) => {
      state.session = action.payload;
      state.currentUser = action.payload?.user || null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.session = action.payload;
        state.currentUser = action.payload?.user || null;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.session = null;
        state.currentUser = null;
      });
  },
});

export const { setSession } = userSlice.actions;
export const selectCurrentUser = (state) => state.user.currentUser;
export const selectSession = (state) => state.user.session;
export const selectAuthStatus = (state) => state.user.status;
export const selectToken = (state) => state.user.session?.access_token;

export default userSlice.reducer;