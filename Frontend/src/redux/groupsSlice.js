import { createSlice } from "@reduxjs/toolkit";

const groupsSlice = createSlice({
    name: 'groups',
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
            const { groupId, newGroupName } = action.payload
            const group = state.groups.find((g) => g.id === parseInt(groupId));
            if (group) {
                group.group_name = newGroupName;
            }
        },
        removeGroup: (state, action) => {
            const groupId = parseInt(action.payload); // Ensure it's an integer
            state.groups = state.groups.filter((g) => g.id !== groupId);  // Using !== inside filter allows to retain all groups whose id does not match the groupId to delete
        },
        clearGroupState: (state) => {
            state.groups = [];
            state.loading = false;
            state.error = null;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const { setGroups, addGroup, updateGroupNameInStore, removeGroup, clearGroupState, setLoading, setError } = groupsSlice.actions;
export default groupsSlice.reducer;