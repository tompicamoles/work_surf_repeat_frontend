import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk for user signup
export const signupUser = createAsyncThunk(
  "user/signup",
  async (userData) => {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.REACT_APP_BACKEND_API_KEY
      },
      credentials: "include",
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Signup failed");
    }

    const data = await response.json();
    return data;
  }
);

// Async thunk for user login
export const loginUser = createAsyncThunk(
  "user/login",
  async (credentials) => {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.REACT_APP_BACKEND_API_KEY
      },
      credentials: "include",
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    const data = await response.json();
    console.log("data received from login", data);
    return data;
  }
);

// Async thunk for user logout
export const logoutUser = createAsyncThunk(
  "user/logout",
  async () => {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/logout`, {
      method: "POST",
      headers: {
        "x-api-key": process.env.REACT_APP_BACKEND_API_KEY
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Logout failed");
    }

    return null;
  }
);

// Async thunk to check authentication status
export const checkAuth = createAsyncThunk(
  "user/checkAuth",
  async () => {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/check`, {
      headers: {
        "x-api-key": process.env.REACT_APP_BACKEND_API_KEY
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Auth check failed");
    }

    const responseData = await response.json();
    const data = responseData.data;
    return data;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Signup cases
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.currentUser = action.payload;
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.currentUser = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Logout cases
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.currentUser = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // Check auth cases
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.currentUser = action.payload;
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isAuthenticated = false;
        state.currentUser = null;
      });
  },
});

// Export actions
export const { clearError } = userSlice.actions;

// Export selectors
export const selectCurrentUser = (state) => state.user.currentUser;
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;
export const selectIsLoading = (state) => state.user.isLoading;
export const selectError = (state) => state.user.error;

export default userSlice.reducer; 