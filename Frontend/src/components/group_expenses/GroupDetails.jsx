import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeGroup, setError, updateGroupNameInStore } from "../../redux/groupsSlice";
import { updateGroupName } from "../api_functions/group_expenses/updateGroupName";
import { deleteGroup } from "../api_functions/group_expenses/deleteGroup";
import GroupMembers from "./GroupMembers"; // Import the GroupMembers component

const GroupDetails = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const group = useSelector((state) =>
    state.groups.groups.find((g) => g.id === parseInt(groupId))
  );

  const [editGroupModalOpen, setEditGroupModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState(group?.group_name || "");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    // If group not found, navigating back to the group expenses page on the component load
    if(!group){
      navigate('/group_expenses')
    }
  }, [])

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
      navigate("/group_expenses");
    } catch (error) {
      dispatch(setError(error.message));
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "white" }}>
        <Typography variant="h4" component="span">
          {group?.group_name}
        </Typography>
        <IconButton color="primary" onClick={() => setEditGroupModalOpen(true)} sx={{ marginLeft: 2 }}>
          <EditIcon />
        </IconButton>
        <IconButton color="secondary" onClick={() => setDeleteConfirmOpen(true)}>
          <DeleteIcon />
        </IconButton>
      </Box>

      {/* Render Group Members */}
      <GroupMembers groupId={groupId} />

      {/* Modal for Editing Group Name */}
      <Modal open={editGroupModalOpen} onClose={() => setEditGroupModalOpen(false)}>
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
          <Typography variant="h6" gutterBottom>Edit Group Name</Typography>
          <TextField
            label="New Group Name"
            fullWidth
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <Button variant="contained" color="primary" onClick={handleUpdateGroupName} fullWidth>Update</Button>
        </Box>
      </Modal>

      {/* Confirmation Dialog for Deleting Group */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this group? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)} color="primary">Cancel</Button>
          <Button onClick={handleDeleteGroup} color="secondary">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GroupDetails;
