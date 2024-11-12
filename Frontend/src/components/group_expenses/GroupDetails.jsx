import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Modal,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setError,
  removeGroup,
  updateGroupNameInStore,
} from "../../redux/groupsSlice";
import { updateGroupName } from "../api_functions/group_expenses/updateGroupName";
import { deleteGroup } from "../api_functions/group_expenses/deleteGroup";
import { getGroupMembers } from "../api_functions/group_expenses/getGroupMembers";
import { addNewMemberToGroup } from "../api_functions/group_expenses/addNewMemberToGroup";
import {
  addGroupMember,
  setGroupMembers,
  setLoading,
  setMemberError,
} from "../../redux/groupMembersSlice";

const GroupDetails = () => {
  const { groupId } = useParams(); // passing the group id to the url
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const group = useSelector((state) =>
    state.groups.groups.find((g) => g.id === parseInt(groupId))
  );

  const members = useSelector((state) => state.groupMembers.members);
  const loading = useSelector((state) => state.groupMembers.loading);
  const memberError = useSelector((state) => state.groupMembers.error);

  const [editGroupModalOpen, setEditGroupModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState(group?.group_name || "");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [newMemberUsername, setNewMemberUsername] = useState(""); // for adding new member in the group.

  useEffect(() => {
    if (!group) {
      // If group doesn't exist in state, navigate back to group list
      navigate("/group_expenses");
    } else {
      fetchGroupMembers(); // Fetch members when component loads
    }
  }, [group, navigate]);

  // Fetch group members
  const fetchGroupMembers = async () => {
    dispatch(setLoading(true));
    try {
      const token = localStorage.getItem("token");
      const membersList = await getGroupMembers(token, groupId);
      dispatch(setGroupMembers(membersList)); // Store fetched members in redux state.
    } catch (error) {
      dispatch(setMemberError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Add new member
  const handleAddNewMember = async () => {
    if (newMemberUsername.trim() === "") {
      dispatch(setMemberError("Username cannot be empty."));
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const newMember = await addNewMemberToGroup(
        token,
        groupId,
        newMemberUsername
      );
      const username = newMember.username;
      const newMemberId = newMember.new_member_details.id;
      dispatch(addGroupMember({id: newMemberId, username: username, group_id: parseInt(groupId)})); // Add the new member to Redux state
      setNewMemberUsername(""); // Clear input
    } catch (error) {
      dispatch(setMemberError(error.message));
    }
  };

  // Edit group name
  const handleUpdateGroupName = async () => {
    if (newGroupName.trim() === "") {
      dispatch(setError("New group name cannot be empty."));
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await updateGroupName(token, groupId, newGroupName);
      dispatch(updateGroupNameInStore({ groupId, newGroupName }));
      setEditGroupModalOpen(false);
    } catch (error) {
      dispatch(setError(error.message));
    }
  };

  // Delete group
  const handleDeleteGroup = async () => {
    try {
      const token = localStorage.getItem("token");
      await deleteGroup(token, groupId);
      dispatch(removeGroup(groupId));
      navigate("/group_expenses"); // Navigate back to group list
    } catch (error) {
      dispatch(setError(error.message));
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 1, color: "white" }}
      >
        <Typography variant="h4" component="span">
          {group?.group_name}
        </Typography>
        <IconButton
          color="primary"
          onClick={() => setEditGroupModalOpen(true)}
          sx={{ marginLeft: 2 }}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          color="secondary"
          onClick={() => setDeleteConfirmOpen(true)}
        >
          <DeleteIcon />
        </IconButton>
      </Box>

      {/* List of Group Members */}
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
              </ListItem>
            ))}
          </List>
        )}
        {memberError && (
          <Typography variant="body1" sx={{ color: "red" }}>
            {memberError}
          </Typography>
        )}
      </Box>


      {/* Add New Member Section */}
      <Box sx={{ marginTop: 4, display: "flex", gap: 2, alignItems: "center" }}>
        <TextField
          label="Add New Member"
          variant="outlined"
          value={newMemberUsername}
          onChange={(e) => setNewMemberUsername(e.target.value)}
          sx={{color: "white"}}
        />
        <Button variant="contained" color="primary" onClick={handleAddNewMember}>
          Add Member
        </Button>
      </Box>

      {/* Modal for Editing Group Name */}
      <Modal
        open={editGroupModalOpen}
        onClose={() => setEditGroupModalOpen(false)}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Edit Group Name
          </Typography>
          <TextField
            label="New Group Name"
            fullWidth
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdateGroupName}
            fullWidth
          >
            Update
          </Button>
        </Box>
      </Modal>

      {/* Confirmation Dialog for Deleting Group */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this group? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteGroup} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GroupDetails;
