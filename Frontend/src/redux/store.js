import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';  // Import the auth slice
import personalExpensesReducer from './personalExpensesSlice';
import groupExpensesReducer from './groupExpensesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,  // Add auth slice to the store
    personalExpenses: personalExpensesReducer,
    groupExpenses: groupExpensesReducer,
  },
});
