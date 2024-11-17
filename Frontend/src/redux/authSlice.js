import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false, // Initial state is not authenticated
  username: null,  // Initial state for logged in user's username
  user_id: null,  // Initial state for logged in user's user id.
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      console.log("LOGIN ACTION DISPATCHED");
      state.isAuthenticated = true;
      state.username = action.payload.username
      state.user_id = action.payload.id
    },
    logout: (state) => {
      console.log("LOGOUT ACTION DISPATCHED");
      state.isAuthenticated = false;
      state.username = null
      state.user_id = null
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
