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
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { createGroup } from "../api_functions/group_expenses/createGroup";
import { getGroupsForUser } from "../api_functions/group_expenses/getGroupsForUser";
import { useDispatch, useSelector } from "react-redux";
import {
  setError,
  setLoading,
  addGroup,
  setGroups,
} from "../../redux/groupsSlice";
import { Link } from "react-router-dom";
import { clearGroupMembersState } from "../../redux/groupMembersSlice";
import { clearGroupExpensesState } from "../../redux/groupExpensesSlice";
import { clearGroupBalancesState } from "../../redux/groupBalancesSlice";

const GroupsDisplay = () => {
  const [groupName, setGroupName] = useState("");
  const [groupCreationModalOpen, setGroupCreationModalOpen] = useState(false);
  const dispatch = useDispatch();
  const { groups, loading, error } = useSelector(
    (state) => state.groups
  );

  // Fetch groups on component load
  useEffect(() => {
    // if (groups.length === 0) {  // Only fetch if groups are empty, it can be when no groups present or when fetching data first data. This would save from unncessary fetching data from backend again and again.
      const fetchGroups = async () => {
        dispatch(setLoading(true));
        try {
          const token = localStorage.getItem("token");
          const userGroups = await getGroupsForUser(token);
          dispatch(setGroups(userGroups));
          dispatch(clearGroupMembersState());
          dispatch(clearGroupExpensesState());
          dispatch(clearGroupBalancesState());
        } catch (error) {
          dispatch(setError(error.message));
        } finally {
          dispatch(setLoading(false));
        }
      };
      fetchGroups();
    // }
  }, [dispatch, groups.length]);

  // Open and close modal handlers
  const handleGroupCreationModalOpen = () => setGroupCreationModalOpen(true);
  const handleGroupCreationModalClose = () => {
    setGroupCreationModalOpen(false);
    setGroupName("");
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
              <ListItem
                key={group.id}
                sx={{ color: "white" }}
                component={Link}
                to={`/group_expenses/${group.id}`} // Link to individual group page
                button
              >
                <ListItemText primary={group.group_name} />
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
    </Box>
  );
};

export default GroupsDisplay;
