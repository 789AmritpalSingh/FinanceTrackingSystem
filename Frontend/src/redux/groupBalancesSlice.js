import { createSlice } from "@reduxjs/toolkit";

const groupBalancesSlice = createSlice({
    name: 'groupBalances',
    initialState: {
        balances: [],
        balancesLoading: false,
        balancesError: null,
    },
    reducers: {
        setGroupBalances: (state, action) => {
            state.balances = action.payload;
            state.balancesLoading = false;
            state.balancesError = null;
        },
        clearGroupBalancesState: (state) => {
            state.balances = [];
            state.balancesLoading = false;
            state.balancesError = null;
        },
        setGroupBalancesLoading: (state, action) => {
            state.balancesLoading = action.payload;
        },
        setGroupBalancesError: (state, action) => {
            state.balancesError = action.payload;
        },
    },
});

export const { setGroupBalances, clearGroupBalancesState, setGroupBalancesLoading, setGroupBalancesError } = groupBalancesSlice.actions;
export default groupBalancesSlice.reducer;