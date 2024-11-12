import { createSlice } from "@reduxjs/toolkit";

const groupMembersSlice = createSlice({
    name: 'groupMembers',
    initialState: {
        members: [],
        loading: false,
        error: null,
    },
    reducers: {
        setGroupMembers: (state, action) => {
            state.members = action.payload;
            state.loading = false;
            state.error = null;
        },
        addGroupMember: (state, action) => {
            state.members.push(action.payload);
            state.error = null;
        },
        removeGroupMemberFromStore: (state, action) => {
            const groupMemberId = action.payload;
            state.members = state.members.filter((m) => m.id !== groupMemberId);
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setMemberError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const { setGroupMembers, addGroupMember, removeGroupMemberFromStore, setLoading, setMemberError } = groupMembersSlice.actions;
export default groupMembersSlice.reducer;