import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Modal,
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
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { createGroup } from "../api_functions/group_expenses/createGroup";
import { getGroupsForUser } from "../api_functions/group_expenses/getGroupsForUser";
import {deleteGroup} from "../api_functions/group_expenses/deleteGroup";
import { useDispatch, useSelector } from "react-redux";
import {
  setError,
  setLoading,
  addGroup,
  setGroups,
  updateGroupNameInStore,
  removeGroup,
} from "../../redux/groupExpensesSlice";
import { updateGroupName } from "../api_functions/group_expenses/updateGroupName";

const GroupExpenses = () => {
  const [groupName, setGroupName] = useState("");
  const [groupCreationModalOpen, setGroupCreationModalOpen] = useState(false);
  const [editGroupModalOpen, setEditGroupModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [groupIdToEdit, setGroupIdToEdit] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [groupIdToDelete, setGroupIdToDelete] = useState(null);

  const dispatch = useDispatch();
  const { groups, loading, error } = useSelector(
    (state) => state.groupExpenses
  );

  // Fetch groups on component load
  useEffect(() => {
    const fetchGroups = async () => {
      dispatch(setLoading(true));
      try {
        const token = localStorage.getItem("token");
        const userGroups = await getGroupsForUser(token);
        dispatch(setGroups(userGroups));
      } catch (error) {
        dispatch(setError(error.message));
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchGroups();
  }, [dispatch]);

  // Open and close modal handlers
  const handleGroupCreationModalOpen = () => setGroupCreationModalOpen(true);
  const handleGroupCreationModalClose = () => {
    setGroupCreationModalOpen(false);
    setGroupName("");
  };

  const handleEditGroupModalOpen = (groupId, currentGroupName) => {
    setGroupIdToEdit(groupId);
    setNewGroupName(currentGroupName);
    setEditGroupModalOpen(true);
  };

  const handleEditGroupModalClose = () => {
    setEditGroupModalOpen(false);
    setNewGroupName("");
  };

  const handleDeleteConfirmOpen = (groupId) => {
    setGroupIdToDelete(groupId);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirmClose = () => {
    setDeleteConfirmOpen(false);
    setGroupIdToDelete(null);
  };

  // Handle group creation
  const handleCreateGroup = async () => {
    if (groupName.trim() === "") {
      dispatch(setError("Group name cannot be empty"));
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const newGroupResponse = await createGroup(token, groupName);
      const newGroup = {
        // Use the ID, group name and creator user id from the backend response
        id: newGroupResponse.data.id,
        group_name: newGroupResponse.data.group_name,
        creator_user_id: newGroupResponse.data.creator_user_id,
      };
      dispatch(addGroup(newGroup)); // Add the new group with both ID and name
      handleGroupCreationModalClose(); // Close the modal on success
    } catch (error) {
      dispatch(setError(error.message));
    }
  };

  // Handle group name update
  const handleUpdateGroupName = async () => {
    if (newGroupName.trim() === "") {
      dispatch(setError("New group name cannot be empty."));
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await updateGroupName(token, groupIdToEdit, newGroupName);
      dispatch(
        updateGroupNameInStore({ groupId: groupIdToEdit, newGroupName })
      );
      handleEditGroupModalClose();
    } catch (error) {
      dispatch(setError(error.message));
    }
  };

  // Handle group delete
  const handleDeleteGroup = async () => {
    try {
      const token = localStorage.getItem("token");
      await deleteGroup(token, groupIdToDelete);
      dispatch(removeGroup(groupIdToDelete));
      handleDeleteConfirmClose();
    } catch (error) {
      dispatch(setError(error.message));
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: "white" }}>
        Group Expenses
      </Typography>

      {/* Create Group Button */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          marginBottom: 4,
          color: "white",
        }}
      >
        <IconButton onClick={handleGroupCreationModalOpen} color="primary">
          <AddCircleOutlineIcon fontSize="large" />
        </IconButton>
        <Typography variant="h6" sx={{ marginLeft: 1, color: "white" }}>
          Create New Group
        </Typography>
      </Box>

      {/* Existing Groups List */}
      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h6" sx={{ color: "white" }}>
          Your Groups
        </Typography>
        {loading ? (
          <Typography variant="body1" sx={{ color: "white" }}>
            Loading...
          </Typography>
        ) : groups.length > 0 ? (
          <List>
            {groups.map((group) => (
              <ListItem key={group.id} sx={{ color: "white" }}>
                <ListItemText primary={group.group_name} />
                <IconButton
                  onClick={() =>
                    handleEditGroupModalOpen(group.id, group.group_name)
                  }
                  color="primary"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleDeleteConfirmOpen(group.id)}
                  color="secondary"
                >
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body1" sx={{ color: "white" }}>
            You are not part of any groups yet.
          </Typography>
        )}
        {error && (
          <Typography variant="body1" sx={{ color: "red" }}>
            {error}
          </Typography>
        )}
      </Box>

      {/* Modal for Creating a New Group */}
      <Modal
        open={groupCreationModalOpen}
        onClose={handleGroupCreationModalClose}
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
            Create a New Group
          </Typography>
          <TextField
            label="Group Name"
            fullWidth
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            error={!!error}
            helperText={error}
            sx={{ marginBottom: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateGroup}
            fullWidth
          >
            Submit
          </Button>
        </Box>
      </Modal>

      {/* Modal for editing existing group name */}
      <Modal open={editGroupModalOpen} onClose={handleEditGroupModalClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, 50%)",
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
            error={!!error}
            helperText={error}
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
      <Dialog open={deleteConfirmOpen} onClose={handleDeleteConfirmClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this group? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteConfirmClose} color="primary">
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

export default GroupExpenses;
