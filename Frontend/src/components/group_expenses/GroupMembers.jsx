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
  Divider,
  Paper,
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
import {
  setLoading as setExpenseLoading,
  setGroupExpense,
  setGroupExpenseError,
} from "../../redux/groupExpensesSlice";
import { getGroupMembers } from "../api_functions/group_expenses/getGroupMembers";
import { addNewMemberToGroup } from "../api_functions/group_expenses/addNewMemberToGroup";
import { removeGroupMember } from "../api_functions/group_expenses/removeGroupMember";
import GroupExpenses from "./GroupExpenses";
import {
  setGroupBalances,
  setGroupBalancesError,
  setGroupBalancesLoading,
} from "../../redux/groupBalancesSlice";
import { getGroupExpenses } from "../api_functions/group_expenses/getGroupExpenses";
import { getUserBalances } from "../api_functions/group_expenses/getUserBalances";

const GroupMembers = ({ groupId, loggedInUserId, creatorUserId }) => {
  const dispatch = useDispatch();

  // Redux state for group members
  const members = useSelector((state) => state.groupMembers.members);
  const loading = useSelector((state) => state.groupMembers.loading);
  const memberError = useSelector((state) => state.groupMembers.error);
  const loggedInUsername = useSelector((state) => state.auth.username);

  // Local state for managing new member input and delete confirmation dialog
  const [newMemberUsername, setNewMemberUsername] = useState("");
  const [deleteMemberConfirmOpen, setDeleteMemberConfirmOpen] = useState(false);
  const [memberIdToDelete, setMemberIdToDelete] = useState(null);

  // Fetch group members when the component loads or groupId changes
  useEffect(() => {
    fetchGroupMembers();
  }, [groupId]);

  /**
   * Fetches the members of the group from the API.
   */
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

  /**
   * Re-fetches group expenses and balances.
   */
  const refetchExpensesAndBalances = async () => {
    const token = localStorage.getItem("token");
    dispatch(setExpenseLoading(true));
    dispatch(setGroupBalancesLoading(true));
    try {
      const expensesList = await getGroupExpenses(token, groupId);
      dispatch(setGroupExpense(expensesList));

      const balancesList = await getUserBalances(token, groupId);
      dispatch(setGroupBalances(balancesList));
    } catch (error) {
      dispatch(setGroupExpenseError(error.message));
      dispatch(setGroupBalancesError(error.message));
    } finally {
      dispatch(setExpenseLoading(false));
      dispatch(setGroupBalancesLoading(false));
    }
  };

  /**
   * Adds a new member to the group.
   */
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
      dispatch(
        addGroupMember({
          id: newMember.new_member_details.id,
          user_id: newMember.new_member_details.user_id,
          username: newMember.username,
          group_id: parseInt(groupId),
        })
      );
      setNewMemberUsername(""); // Clear the input field
    } catch (error) {
      dispatch(setMemberError(error.message));
    }
  };

  /**
   * Handles the deletion of a group member.
   */
  const handleDeleteMember = (memberUserId) => {
    setMemberIdToDelete(memberUserId);
    setDeleteMemberConfirmOpen(true);
  };

  /**
   * Confirms the deletion of a group member and updates the state.
   */
  const confirmDeleteMember = async () => {
    try {
      const token = localStorage.getItem("token");
      await removeGroupMember(token, memberIdToDelete, groupId);
      dispatch(removeGroupMemberFromStore(memberIdToDelete));
      await refetchExpensesAndBalances(); // Update expenses and balances
      setDeleteMemberConfirmOpen(false);
    } catch (error) {
      dispatch(setMemberError(error.message));
    }
  };

  return (
    <Box sx={{ marginTop: 4, color: "white" }}>
      {/* Group Members Header */}
      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
        Group Members
      </Typography>

      {/* Member List */}
      <Paper
        elevation={3}
        sx={{
          padding: 2,
          backgroundColor: "#262626",
          borderRadius: 3,
          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.5)",
        }}
      >
        {loading ? (
          <Typography
            variant="body1"
            sx={{ color: "white", textAlign: "center" }}
          >
            Loading...
          </Typography>
        ) : (
          <List>
            {members.map((member) => (
              <React.Fragment key={member.id}>
                <ListItem
                  secondaryAction={
                    loggedInUserId === creatorUserId && (
                      <IconButton
                        edge="end"
                        onClick={() => handleDeleteMember(member.id)}
                        sx={{
                          backgroundColor: "#333",
                          "&:hover": { backgroundColor: "#FF5252" },
                        }}
                      >
                        <DeleteIcon sx={{ color: "#FF5252" }} />
                      </IconButton>
                    )
                  }
                >
                  <ListItemText
                    primary={
                      member.username === loggedInUsername
                        ? "You"
                        : member.username
                    }
                    sx={{ color: "white" }}
                  />
                </ListItem>
                <Divider sx={{ backgroundColor: "#444" }} />
              </React.Fragment>
            ))}
          </List>
        )}
        {memberError && (
          <Typography variant="body1" sx={{ color: "red", mt: 2 }}>
            {memberError}
          </Typography>
        )}
      </Paper>

      {/* Add New Member Section */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          marginTop: 3,
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <TextField
          label="Add New Member"
          variant="outlined"
          value={newMemberUsername}
          onChange={(e) => setNewMemberUsername(e.target.value)}
          fullWidth
          sx={{
            backgroundColor: "#333",
            borderRadius: 1,
            "& .MuiOutlinedInput-root": {
              color: "white",
              "& fieldset": {
                borderColor: "#555",
              },
              "&:hover fieldset": {
                borderColor: "#00e676",
              },
            },
            "& .MuiInputLabel-root": { color: "#ccc" },
          }}
        />
        <Button
          variant="contained"
          onClick={handleAddNewMember}
          sx={{
            background: "linear-gradient(135deg, #00e676, #00b258)",
            color: "white",
            fontWeight: "bold",
            textTransform: "capitalize",
            borderRadius: "8px",
            padding: "6px 16px", // Reduced padding for decreased height
            fontSize: "0.9rem", // Slightly smaller font size
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            transition: "transform 0.2s, box-shadow 0.2s",
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.3)",
              background: "linear-gradient(135deg, #00c867, #009c3c)",
            },
          }}
        >
          Add Member
        </Button>
      </Box>

      {/* Group Expenses */}
      <GroupExpenses groupId={groupId} loggedInUserId={loggedInUserId} />

      {/* Confirmation Dialog for Deleting Member */}
      <Dialog
        open={deleteMemberConfirmOpen}
        onClose={() => setDeleteMemberConfirmOpen(false)}
      >
        <DialogTitle>Confirm Member Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove this member from the group?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteMemberConfirmOpen(false)}
            color="primary"
          >
            Cancel
          </Button>
          <Button onClick={confirmDeleteMember} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GroupMembers;
