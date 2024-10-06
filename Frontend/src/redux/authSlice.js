import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false, // Initial state is not authenticated
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state) => {
      console.log("LOGIN ACTION DISPATCHED");
      state.isAuthenticated = true;
    },
    logout: (state) => {
      console.log("LOGOUT ACTION DISPATCHED");
      state.isAuthenticated = false;
    },
    setAuthentication: (state, action) => {
      state.isAuthenticated = action.payload;
    },
  },
});

export const { login, logout, setAuthentication } = authSlice.actions;
export default authSlice.reducer;
