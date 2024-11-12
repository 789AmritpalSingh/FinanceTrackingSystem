import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';  // Import the auth slice
import personalExpensesReducer from './personalExpensesSlice';
import groupsReducer from './groupsSlice';
import groupMembersReducer from './groupMembersSlice'
import groupExpensesReducer from './groupExpensesSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,  // Add auth slice to the store
    personalExpenses: personalExpensesReducer,
    groups: groupsReducer,
    groupMembers: groupMembersReducer,
    groupExpenses: groupExpensesReducer,
  },
});
