import React, { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import { useDispatch, useSelector } from "react-redux";

import {
  setGroupMembers,
  setLoading,
  setMemberError,
  addGroupMember,
  removeGroupMemberFromStore,
} from "../../redux/groupMembersSlice";

import { getGroupMembers } from "../api_functions/group_expenses/getGroupMembers";
import { addNewMemberToGroup } from "../api_functions/group_expenses/addNewMemberToGroup";
import { removeGroupMember } from "../api_functions/group_expenses/removeGroupMember";

import GroupExpenses from "./GroupExpenses";
import AddMemberModal from "./AddMemberModal";
import DeleteMemberDialog from "./DeleteMemberDialog";
import MemberList from "./MemberList";

const GroupMembers = ({ groupId, loggedInUserId, creatorUserId }) => {
  const dispatch = useDispatch();

  // Redux state
  const members = useSelector((state) => state.groupMembers.members);
  const loading = useSelector((state) => state.groupMembers.loading);
  const memberError = useSelector((state) => state.groupMembers.error);
  const loggedInUsername = useSelector((state) => state.auth.username);

  // Local state
  const [viewMembers, setViewMembers] = useState(false);
  const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);
  const [deleteMemberConfirmOpen, setDeleteMemberConfirmOpen] = useState(false);
  const [memberIdToDelete, setMemberIdToDelete] = useState(null);

  useEffect(() => {
    fetchGroupMembers();
  }, [groupId]);

  const fetchGroupMembers = async () => {
    dispatch(setLoading(true));
    try {
      const token = localStorage.getItem("token");
      const membersList = await getGroupMembers(token, groupId);
      dispatch(setGroupMembers(membersList));
    } catch (error) {
      dispatch(setMemberError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleAddNewMember = async (username) => {
    try {
      const token = localStorage.getItem("token");
      const newMember = await addNewMemberToGroup(token, groupId, username);
      dispatch(
        addGroupMember({
          id: newMember.new_member_details.id,
          user_id: newMember.new_member_details.user_id,
          username: newMember.username,
          group_id: parseInt(groupId),
        })
      );
    } catch (error) {
      dispatch(setMemberError(error.message));
    }
  };

  const handleDeleteMember = (memberUserId) => {
    setMemberIdToDelete(memberUserId);
    setDeleteMemberConfirmOpen(true);
  };

  const confirmDeleteMember = async () => {
    try {
      const token = localStorage.getItem("token");
      await removeGroupMember(token, memberIdToDelete, groupId);
      dispatch(removeGroupMemberFromStore(memberIdToDelete));
      setDeleteMemberConfirmOpen(false);
    } catch (error) {
      dispatch(setMemberError(error.message));
    }
  };

  return (
    <Box sx={{ marginTop: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#1E1E1E",
          padding: 2,
          borderRadius: "8px",
        }}
      >
        <Typography
          variant="h6"
          sx={{ display: "flex", alignItems: "center", gap: 1, color: "#FFF" }}
        >
          <GroupIcon sx={{ color: "#00e676" }} />
          Group Members
        </Typography>
        <Button
          variant="contained"
          onClick={() => setViewMembers(true)}
          sx={{ backgroundColor: "#089404" }}
        >
          Members
        </Button>
      </Box>

      {viewMembers && (
        <>
          <MemberList
            members={members}
            loading={loading}
            loggedInUserId={loggedInUserId}
            creatorUserId={creatorUserId}
            loggedInUsername={loggedInUsername}
            onDeleteMember={handleDeleteMember}
          />
          <Box sx={{ marginTop: 3, textAlign: "center" }}>
            <Button
              variant="contained"
              onClick={() => setAddMemberModalOpen(true)}
              sx={{ backgroundColor: "#089404" }}
            >
              Add Member
            </Button>
            <Button
              variant="outlined"
              sx={{ marginLeft: 2, color: "#FFF", borderColor: "#FFF" }}
              onClick={() => setViewMembers(false)}
            >
              Back
            </Button>
          </Box>
        </>
      )}

      <AddMemberModal
        open={addMemberModalOpen}
        onClose={() => setAddMemberModalOpen(false)}
        onAddMember={handleAddNewMember}
      />
      <DeleteMemberDialog
        open={deleteMemberConfirmOpen}
        onClose={() => setDeleteMemberConfirmOpen(false)}
        onConfirm={confirmDeleteMember}
      />
      <GroupExpenses groupId={groupId} loggedInUserId={loggedInUserId} />
    </Box>
  );
};

export default GroupMembers;
