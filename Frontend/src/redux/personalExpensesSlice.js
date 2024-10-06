import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  expenses: [],
  loading: false,
  error: null,
};

const personalExpensesSlice = createSlice({
  name: "personalExpenses",
  initialState,
  reducers: {
    setExpenses: (state, action) => {
      state.expenses = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setExpenses, setLoading, setError } = personalExpensesSlice.actions;

export default personalExpensesSlice.reducer;
