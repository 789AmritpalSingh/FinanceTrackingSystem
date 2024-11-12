import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
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

const GroupMembers = ({ groupId }) => {
  const dispatch = useDispatch();
  const members = useSelector((state) => state.groupMembers.members);
  const loading = useSelector((state) => state.groupMembers.loading);
  const memberError = useSelector((state) => state.groupMembers.error);

  const [newMemberUsername, setNewMemberUsername] = useState("");
  const [deleteMemberConfirmOpen, setDeleteMemberConfirmOpen] = useState(false);
  const [memberIdToDelete, setMemberIdToDelete] = useState(null);

  // Fetch group members on the page load
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

  const handleAddNewMember = async () => {
    if (newMemberUsername.trim() === "") {
      dispatch(setMemberError("Username cannot be empty."));
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const newMember = await addNewMemberToGroup(token, groupId, newMemberUsername);
      dispatch(addGroupMember({
        id: newMember.new_member_details.id,
        username: newMember.username,
        group_id: parseInt(groupId),
      }));
      setNewMemberUsername("");
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
    <Box sx={{ marginTop: 4, color: "white" }}>
      <Typography variant="h6">Group Members</Typography>
      {loading ? (
        <Typography variant="body1" sx={{ color: "white" }}>
          Loading...
        </Typography>
      ) : (
        <List>
          {members.map((member) => (
            <ListItem key={member.id}>
              <ListItemText primary={member.username} />
              <IconButton color="secondary" onClick={() => handleDeleteMember(member.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      )}
      {memberError && (
        <Typography variant="body1" sx={{ color: "red" }}>
          {memberError}
        </Typography>
      )}

      <Box sx={{ display: "flex", gap: 2, alignItems: "center", marginTop: 2 }}>
        <TextField
          label="Add New Member"
          variant="outlined"
          value={newMemberUsername}
          onChange={(e) => setNewMemberUsername(e.target.value)}
          sx={{ color: "white" }}
        />
        <Button variant="contained" color="primary" onClick={handleAddNewMember}>
          Add Member
        </Button>
      </Box>

      {/* Confirmation Dialog for Deleting Group Member */}
      <Dialog open={deleteMemberConfirmOpen} onClose={() => setDeleteMemberConfirmOpen(false)}>
        <DialogTitle>Confirm Member Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to remove this member from the group?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteMemberConfirmOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDeleteMember} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GroupMembers;
