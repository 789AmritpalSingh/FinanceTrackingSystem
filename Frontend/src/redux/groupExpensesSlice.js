import { createSlice } from "@reduxjs/toolkit";

const groupExpensesSlice = createSlice({
    name: 'groupExpenses',
    initialState: {
        groups: [],
        loading: false,
        error: null,
    },
    reducers: {
        setGroups: (state, action) => {
            state.groups = action.payload;
            state.loading = false;
            state.error = null;
        },
        addGroup: (state, action) => {
            state.groups.push(action.payload);
            state.error = null;
        },
        updateGroupNameInStore: (state, action) => {
            const {groupId, newGroupName} = action.payload
            const group = state.groups.find((g) => g.id == groupId);
            if(group){
                group.group_name = newGroupName;
            }
        },
        removeGroup: (state, action) => {
            state.groups = state.groups.filter((group) => group.id !== action.payload)
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const {setGroups, addGroup, updateGroupNameInStore, removeGroup, setLoading, setError} = groupExpensesSlice.actions;
export default groupExpensesSlice.reducer;