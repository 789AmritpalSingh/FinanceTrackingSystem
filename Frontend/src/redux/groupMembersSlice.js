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
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setMemberError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const { setGroupMembers, addGroupMember, setLoading, setMemberError } = groupMembersSlice.actions;
export default groupMembersSlice.reducer;