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
  const members = useSelector((state) => state.groupMembers.members);
  const loading = useSelector((state) => state.groupMembers.loading);
  const memberError = useSelector((state) => state.groupMembers.error);
  const loggedInUsername = useSelector((state) => state.auth.username);

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
      await refetchExpensesAndBalances(); // Update expenses and balances
      setDeleteMemberConfirmOpen(false);
    } catch (error) {
      dispatch(setMemberError(error.message));
    }
  };

  return (
    <Box sx={{ marginTop: 4, color: "white" }}>
      <Typography variant="h6" gutterBottom>
        Group Members
      </Typography>

      <Paper
        elevation={3}
        sx={{ padding: 2, backgroundColor: "#333", borderRadius: 2 }}
      >
        {loading ? (
          <Typography variant="body1" sx={{ color: "white" }}>
            Loading...
          </Typography>
        ) : (
          <List>
            {members.map((member) => (
              <React.Fragment key={member.id}>
                <ListItem
                  secondaryAction={
                    // Show delete button only if the logged-in user is the group creator
                    loggedInUserId === creatorUserId && (
                      <IconButton
                        edge="end"
                        color="secondary"
                        onClick={() => handleDeleteMember(member.id)}
                        aria-label="delete member"
                      >
                        <DeleteIcon />
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
                <Divider sx={{ backgroundColor: "#555" }} />
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
      <Box sx={{ display: "flex", gap: 2, alignItems: "center", marginTop: 3 }}>
        <TextField
          label="Add New Member"
          variant="outlined"
          value={newMemberUsername}
          onChange={(e) => setNewMemberUsername(e.target.value)}
          sx={{
            flexGrow: 1,
            backgroundColor: "#444",
            color: "white",
            borderRadius: 1,
          }}
          InputLabelProps={{ style: { color: "#ccc" } }}
          InputProps={{ style: { color: "white" } }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddNewMember}
        >
          Add Member
        </Button>
      </Box>

      {/* Render Group Expenses */}
      <GroupExpenses groupId={groupId} loggedInUserId={loggedInUserId}/>

      {/* Confirmation Dialog for Deleting Group Member */}
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
          <Button onClick={confirmDeleteMember} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GroupMembers;
