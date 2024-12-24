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
    <Box sx={{ marginTop: 4}}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#1E1E1E",
          padding: { xs: 2, md: 3 },
          borderRadius: "8px",
          flexDirection: { xs: "column", sm: "row" }, // Stack on smaller screens
          gap: { xs: 2, sm: 0 }, // Add gap between stacked items on small screens
        }}
      >
        {/* Header: Group Members */}
        <Typography
          variant="h6"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "#FFF",
            fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" }, // Responsive text size
            textAlign: { xs: "center", sm: "left" }, // Center-align text on small screens
            flexGrow: 1, // Let it expand to fill space
          }}
        >
          <GroupIcon
            sx={{
              color: "#00e676",
              fontSize: { xs: "1.5rem", md: "2rem" }, // Responsive icon size
            }}
          />
          Group Members
        </Typography>

        {/* Button to View Members */}
        <Button
          variant="contained"
          onClick={() => setViewMembers(true)}
          sx={{
            backgroundColor: "#089404",
            "&:hover": { backgroundColor: "#066f03" },
            fontSize: { xs: "0.9rem", sm: "1rem" }, // Responsive button text
            padding: { xs: "6px 12px", sm: "8px 16px" }, // Adjust padding for small screens
            borderRadius: "12px", // Rounded button
          }}
        >
          Members
        </Button>
      </Box>

      {/* Conditional Rendering: Show Member List */}
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
          <Box
            sx={{
              marginTop: 3,
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap", // Allow buttons to wrap on small screens
              gap: 2, // Space between buttons
            }}
          >
            {/* Add Member Button */}
            <Button
              variant="contained"
              onClick={() => setAddMemberModalOpen(true)}
              sx={{
                backgroundColor: "#089404",
                "&:hover": { backgroundColor: "#066f03" },
                fontSize: { xs: "0.9rem", sm: "1rem" }, // Responsive text size
                padding: { xs: "6px 12px", sm: "8px 16px" }, // Adjust padding
                borderRadius: "12px",
              }}
            >
              Add Member
            </Button>

            {/* Back Button */}
            <Button
              variant="outlined"
              onClick={() => setViewMembers(false)}
              sx={{
                color: "#FFF",
                borderColor: "#FFF",
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
                fontSize: { xs: "0.9rem", sm: "1rem" },
                padding: { xs: "6px 12px", sm: "8px 16px" },
                borderRadius: "12px",
              }}
            >
              Back
            </Button>
          </Box>
        </>
      )}

      {/* Modals and Dialogs */}
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
