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
import GroupMembers from "./GroupMembers"; // Import the GroupMembers component
import { getGroupsForUser } from "../api_functions/group_expenses/getGroupsForUser";
import { removeGroupMember } from "../api_functions/group_expenses/removeGroupMember";
import { clearGroupMembersState } from "../../redux/groupMembersSlice";
import { clearGroupExpensesState } from "../../redux/groupExpensesSlice";
import { clearGroupBalancesState } from "../../redux/groupBalancesSlice";

const GroupDetails = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const group = useSelector((state) =>
    state.groups.groups.find((g) => g.id === parseInt(groupId))
  );
  const members = useSelector((state) => state.groupMembers.members);
  const creatorUserId = group?.creator_user_id;
  const loggedInUserId = useSelector((state) => state.auth.user_id); // Logged-in user's ID

  // Find the logged-in user's member id
  const loggedInUserMemberId = members.find(
    (m) => m.user_id === loggedInUserId
  )?.id;
  console.log("Logged in user member id ", loggedInUserMemberId);

  const loading = useSelector((state) => state.groups.loading); // Check if groups are loading

  const [editGroupModalOpen, setEditGroupModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState(group?.group_name || "");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [leaveGroupConfirmOpen, setLeaveGroupConfirmOpen] = useState(false);

  // Fetch groups on if redux state is empty i.e. there are no groups
  useEffect(() => {
    const fetchGroups = async () => {
      dispatch(setLoading(true));
      try {
        const token = localStorage.getItem("token");
        const userGroups = await getGroupsForUser(token);
        dispatch(setGroups(userGroups));
      } catch (error) {
        dispatch(setError(error.message));
        // Navigate only if no group is found
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

  const handleLeaveGroup = async () => {
    try {
      const token = localStorage.getItem("token");
      await removeGroupMember(token, loggedInUserMemberId, groupId);
      // Remove the group from Redux store
      dispatch(removeGroup(groupId));
      // Clear the expenses, balances and group members from the redux store of the left group
      dispatch(clearGroupBalancesState());
      dispatch(clearGroupExpensesState());
      dispatch(clearGroupMembersState());
      // Navigate to the group expenses page
      navigate("/group_expenses");
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      setLeaveGroupConfirmOpen(false);
    }
  };

  // Show loading spinner until group details are populated
  if (loading || (!group && !loading)) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 1, color: "white" }}
      >
        <Typography variant="h4" component="span">
          {group?.group_name}
        </Typography>
        {loggedInUserId === creatorUserId && (
          <>
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
          </>
        )}
      </Box>

      {/* Leave Group Button */}
      <Box sx={{ marginTop: 3 }}>
        <Button
          variant="contained"
          color="error"
          onClick={() => setLeaveGroupConfirmOpen(true)}
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
          <Button onClick={handleLeaveGroup} color="error">
            Leave Group
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GroupDetails;
