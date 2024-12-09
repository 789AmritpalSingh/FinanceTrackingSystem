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
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  removeGroup,
  setError,
  setGroups,
  setLoading,
  updateGroupNameInStore,
} from "../../redux/groupsSlice";
import { updateGroupName } from "../api_functions/group_expenses/updateGroupName";
import { deleteGroup } from "../api_functions/group_expenses/deleteGroup";
import GroupMembers from "./GroupMembers";
import { getGroupsForUser } from "../api_functions/group_expenses/getGroupsForUser";
import { removeGroupMember } from "../api_functions/group_expenses/removeGroupMember";
import { clearGroupMembersState } from "../../redux/groupMembersSlice";
import { clearGroupExpensesState } from "../../redux/groupExpensesSlice";
import { clearGroupBalancesState } from "../../redux/groupBalancesSlice";
import { changeGroupCreator } from "../api_functions/group_expenses/changeGroupCreator";

const GroupDetails = () => {
  // Extract the groupId from the URL parameters
  const { groupId } = useParams();

  // Hook for navigation
  const navigate = useNavigate();

  // Redux hooks for managing state
  const dispatch = useDispatch();
  const group = useSelector((state) =>
    state.groups.groups.find((g) => g.id === parseInt(groupId))
  );
  const members = useSelector((state) => state.groupMembers.members);
  const loggedInUserId = useSelector((state) => state.auth.user_id);
  const creatorUserId = group?.creator_user_id;

  // Find the logged-in user's membership ID in the group
  const loggedInUserMemberId = members.find(
    (m) => m.user_id === loggedInUserId
  )?.id;

  // Loading state from Redux
  const loading = useSelector((state) => state.groups.loading);

  // Local states for managing modals and dialogs
  const [editGroupModalOpen, setEditGroupModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState(group?.group_name || "");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [leaveGroupConfirmOpen, setLeaveGroupConfirmOpen] = useState(false);
  const [selectNewCreatorOpen, setSelectNewCreatorOpen] = useState(false);
  const [newCreatorId, setNewCreatorId] = useState("");

  /**
   * Fetch groups if the Redux state is empty or group data is not loaded.
   */
  useEffect(() => {
    const fetchGroups = async () => {
      dispatch(setLoading(true));
      try {
        const token = localStorage.getItem("token");
        const userGroups = await getGroupsForUser(token);
        dispatch(setGroups(userGroups));
      } catch (error) {
        dispatch(setError(error.message));

        // Navigate to group expenses if group data is unavailable
        if (!group) {
          navigate("/group_expenses");
        }
      } finally {
        dispatch(setLoading(false));
      }
    };

    if (!group) {
      fetchGroups();
    }
  }, [dispatch, group, navigate]);

  /**
   * Handle group name update functionality.
   */
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

  /**
   * Handle group deletion functionality.
   */
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

  /**
   * Handle the functionality for leaving a group.
   * If the user is the creator, prompt for assigning a new creator.
   */
  const handleLeaveGroup = async (isCreatorChanged = false) => {
    try {
      if (loggedInUserId === creatorUserId && !isCreatorChanged) {
        if (members.length === 1) {
          handleDeleteGroup(); // Delete the group if the creator is the only member
        } else {
          setSelectNewCreatorOpen(true); // Prompt for selecting a new creator
          return;
        }
      } else {
        const token = localStorage.getItem("token");
        await removeGroupMember(token, loggedInUserMemberId, groupId);
        dispatch(removeGroup(groupId));
        dispatch(clearGroupBalancesState());
        dispatch(clearGroupExpensesState());
        dispatch(clearGroupMembersState());
        navigate("/group_expenses");
      }
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      setLeaveGroupConfirmOpen(false);
    }
  };

  /**
   * Handle changing the creator of the group.
   */
  const handleChangeCreator = async () => {
    try {
      const token = localStorage.getItem("token");
      await changeGroupCreator(token, groupId, newCreatorId);
      dispatch(
        updateGroupNameInStore({
          groupId,
          newCreatorUserId: newCreatorId,
        })
      );
      setSelectNewCreatorOpen(false);
      await handleLeaveGroup(true); // Proceed to leave the group after assigning a new creator
    } catch (error) {
      dispatch(setError(error.message));
    }
  };

  // Display a loading spinner if group details are not fully loaded
  if (loading || (!group && !loading)) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#1A1A1A",
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        padding: 4,
        backgroundColor: "#1A1A1A",
        minHeight: "100vh",
        color: "white",
      }}
    >
      {/* Group Title and Edit/Delete Buttons */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          backgroundColor: "#262626",
          borderRadius: 2,
          padding: 2,
          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.5)",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          {group?.group_name}
        </Typography>
        {loggedInUserId === creatorUserId && (
          <>
            <IconButton
              onClick={() => setEditGroupModalOpen(true)}
              sx={{
                backgroundColor: "#333333",
                "&:hover": { backgroundColor: "#444444" },
              }}
            >
              <EditIcon sx={{ color: "#00e676" }} />
            </IconButton>
            <IconButton
              onClick={() => setDeleteConfirmOpen(true)}
              sx={{
                backgroundColor: "#333333",
                "&:hover": { backgroundColor: "#FF5252" },
              }}
            >
              <DeleteIcon sx={{ color: "#FF5252" }} />
            </IconButton>
          </>
        )}
      </Box>

      {/* Leave Group Button */}
      <Box sx={{ marginTop: 3 }}>
        <Button
          variant="contained"
          color="error"
          onClick={() => setLeaveGroupConfirmOpen(true)}
          sx={{
            padding: "10px 20px",
            fontWeight: "bold",
            backgroundColor: "#FF5252",
            "&:hover": { backgroundColor: "#FF3030" },
          }}
        >
          Leave Group
        </Button>
      </Box>

      {/* Render Group Members */}
      <GroupMembers
        groupId={groupId}
        loggedInUserId={loggedInUserId}
        creatorUserId={creatorUserId}
      />
      
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

      {/* Confirmation Dialog for Leaving Group */}
      <Dialog
        open={leaveGroupConfirmOpen}
        onClose={() => setLeaveGroupConfirmOpen(false)}
      >
        <DialogTitle>Confirm Leave Group</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to leave this group? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setLeaveGroupConfirmOpen(false)}
            color="primary"
          >
            Cancel
          </Button>
          <Button onClick={() => handleLeaveGroup(false)} color="error">
            Leave Group
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialogue for changing the group creator */}
      <Dialog
        open={selectNewCreatorOpen}
        onClose={() => setSelectNewCreatorOpen(false)}
      >
        <DialogTitle>Select New Group Creator</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel>Select Member</InputLabel>
            <Select
              value={newCreatorId}
              onChange={(e) => setNewCreatorId(e.target.value)}
            >
              {members
                .filter((m) => m.user_id !== loggedInUserId)
                .map((member) => (
                  <MenuItem key={member.user_id} value={member.user_id}>
                    {member.username}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setSelectNewCreatorOpen(false)}
            color="primary"
          >
            Cancel
          </Button>
          <Button onClick={handleChangeCreator} color="primary">
            Change Creator
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GroupDetails;
