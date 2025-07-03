import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../../tierApi/supabase";

// Async thunk to check authentication status
export const checkAuth = createAsyncThunk(
  "user/checkAuth",
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

// Async thunk to handle sign up
export const signUp = createAsyncThunk(
  "user/signUp",
  async ({ email, password, nickname }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: nickname,
          },
        },
      });
      if (error) throw error;
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to handle sign in
export const signIn = createAsyncThunk(
  "user/signIn",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data.session;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to handle forgot password
export const forgotPassword = createAsyncThunk(
  "user/forgotPassword",
  async ({ email }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to handle sign out
export const signOut = createAsyncThunk(
  "user/signOut",
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
  name: "user",
  initialState: {
    currentUser: {
      id: null,
      nickname: null,
    },
    session: null,
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    authLoading: false,
    signUpLoading: false,
    signInLoading: false,
    forgotPasswordLoading: false,
    error: null,
    authSuccess: null,
  },
  reducers: {
    setSession: (state, action) => {
      state.session = action.payload;
      if (action.payload?.user) {
        console.log("action.payload.user", action.payload.user);

        state.currentUser = {
          id: action.payload.user.id,
          nickname: action.payload.user.user_metadata?.full_name || null,
        };
      } else {
        state.currentUser = {
          id: null,
          nickname: null,
        };
      }
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    clearAuthSuccess: (state) => {
      state.authSuccess = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.status = "loading";
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.session = action.payload;
        console.log("user session", action.payload);
        if (action.payload?.user) {
          state.currentUser = {
            id: action.payload.user.id,
            nickname: action.payload.user.user_metadata?.full_name || null,
          };
        } else {
          state.currentUser = {
            id: null,
            nickname: null,
          };
        }
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.currentUser = {
          id: null,
          nickname: null,
        };
      })

      // Sign Up
      .addCase(signUp.pending, (state) => {
        state.signUpLoading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.signUpLoading = false;
        state.authSuccess =
          "Account created! Please check your email for verification.";
        // Note: session might be null if email confirmation is required
        if (action.payload.session?.user) {
          state.session = action.payload.session;
          state.currentUser = {
            id: action.payload.session.user.id,
            nickname:
              action.payload.session.user.user_metadata?.full_name || null,
          };
        }
      })
      .addCase(signUp.rejected, (state, action) => {
        state.signUpLoading = false;
        state.error = action.payload;
      })

      // Sign In
      .addCase(signIn.pending, (state) => {
        state.signInLoading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.signInLoading = false;
        state.session = action.payload;
        if (action.payload?.user) {
          state.currentUser = {
            id: action.payload.user.id,
            nickname: action.payload.user.user_metadata?.full_name || null,
          };
        }
        state.authSuccess = "Successfully signed in!";
      })
      .addCase(signIn.rejected, (state, action) => {
        state.signInLoading = false;
        state.error = action.payload;
      })

      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.forgotPasswordLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.forgotPasswordLoading = false;
        state.authSuccess = "Password reset email sent! Check your inbox.";
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.forgotPasswordLoading = false;
        state.error = action.payload;
      })

      // Sign Out
      .addCase(signOut.fulfilled, (state) => {
        state.session = null;
        state.currentUser = {
          id: null,
          nickname: null,
        };
        state.authSuccess = null;
        state.error = null;
      });
  },
});

export const { setSession, clearAuthError, clearAuthSuccess } =
  userSlice.actions;
export const selectCurrentUser = (state) => state.user.currentUser;
export const selectUserNickname = (state) => state.user.currentUser.nickname;
export const selectUserId = (state) => state.user.currentUser.id;
export const selectSession = (state) => state.user.session;
export const selectAuthStatus = (state) => state.user.status;
export const selectToken = (state) => state.user.session?.access_token;
export const selectAuthLoading = (state) => state.user.authLoading;
export const selectSignUpLoading = (state) => state.user.signUpLoading;
export const selectSignInLoading = (state) => state.user.signInLoading;
export const selectForgotPasswordLoading = (state) =>
  state.user.forgotPasswordLoading;
export const selectAuthError = (state) => state.user.error;
export const selectAuthSuccess = (state) => state.user.authSuccess;

export default userSlice.reducer;
