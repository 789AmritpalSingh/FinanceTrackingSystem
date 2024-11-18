import { createSlice } from "@reduxjs/toolkit";

const groupExpensesSlice = createSlice({
    name: 'groupExpenses',
    initialState: {
        expenses: [],
        loading: false,
        error: null,
    },
    reducers: {
        setGroupExpense: (state, action) => {
            state.expenses = action.payload;
            state.loading = false;
            state.error = null;
        },
        addGroupExpense: (state, action) => {
            state.expenses.push(action.payload);
            state.error = null;
        },
        clearGroupExpensesState: (state) => {
            state.expenses = [];
            state.loading = false;
            state.error = null;
        },
        removeGroupExpense: (state, action) => {
            state.expenses = state.expenses.filter(
                (expense) => expense.id !== action.payload
            );
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setGroupExpenseError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const { setGroupExpense, addGroupExpense, clearGroupExpensesState, removeGroupExpense, setLoading, setGroupExpenseError } = groupExpensesSlice.actions;
export default groupExpensesSlice.reducer;