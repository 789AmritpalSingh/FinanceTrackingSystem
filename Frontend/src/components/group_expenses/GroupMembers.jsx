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

const GroupMembers = ({ groupId, loggedInUserId, creatorUserId }) => {
  const dispatch = useDispatch();

  // Redux state for group members
  const members = useSelector((state) => state.groupMembers.members);
  const loading = useSelector((state) => state.groupMembers.loading);
  const memberError = useSelector((state) => state.groupMembers.error);
  const loggedInUsername = useSelector((state) => state.auth.username);

  // Local state for managing view toggle and modals
  const [viewMembers, setViewMembers] = useState(false);
  const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);
  const [deleteMemberConfirmOpen, setDeleteMemberConfirmOpen] = useState(false);
  const [newMemberUsername, setNewMemberUsername] = useState("");
  const [memberIdToDelete, setMemberIdToDelete] = useState(null);

  // Fetch group members when the component loads or groupId changes
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
      setAddMemberModalOpen(false);
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
      {/* Default View */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          padding: 2,
          backgroundColor: "#1A1A1A",
          borderRadius: "8px",
          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.5)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "#FFF",
            }}
          >
            <GroupIcon sx={{ color: "#00e676" }} />
            Group Members
          </Typography>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#00e676",
              "&:hover": { backgroundColor: "#00b258" },
              fontWeight: "bold",
            }}
            onClick={() => setViewMembers(true)}
          >
            Manage Members
          </Button>
        </Box>
      </Box>

      {viewMembers && (
        <>
          {/* Group Members View */}
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", marginBottom: 2, color: "#00e676" }}
          >
            Group Members
          </Typography>
          <Paper
            elevation={3}
            sx={{
              padding: 2,
              backgroundColor: "#262626",
              borderRadius: 3,
              boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.5)",
              maxHeight: "300px",
              overflowY: "auto",
            }}
          >
            {loading ? (
              <Typography sx={{ textAlign: "center" }}>Loading...</Typography>
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
          </Paper>
          <Box sx={{ marginTop: 3, textAlign: "center" }}>
            <Button
              variant="contained"
              onClick={() => setAddMemberModalOpen(true)}
              sx={{
                backgroundColor: "#00e676",
                "&:hover": { backgroundColor: "#00b258" },
                fontWeight: "bold",
              }}
            >
              Add Member
            </Button>
            <Button
              variant="outlined"
              sx={{ marginLeft: 2, color: "#FFF", borderColor: "#FFF" }}
              onClick={() => setViewMembers(false)}
            >
              Back
            </Button>
          </Box>
        </>
      )}

      {/* Group Expenses Box */}
      <Box
        sx={{
          marginTop: 4,
          padding: 2,
          backgroundColor: "#262626",
          borderRadius: "8px",
          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.5)",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: "#FFF",
            marginBottom: 1,
            fontWeight: "bold",
          }}
        >
          Group Expenses
        </Typography>
        <GroupExpenses groupId={groupId} loggedInUserId={loggedInUserId} />
      </Box>

      {/* Add Member Modal */}
      <Dialog
        open={addMemberModalOpen}
        onClose={() => setAddMemberModalOpen(false)}
        PaperProps={{
          style: {
            backgroundColor: "#2C2C2C",
            color: "#DDD",
            borderRadius: "12px",
          },
        }}
      >
        <DialogTitle sx={{ color: "#FFF" }}>Add New Member</DialogTitle>
        <DialogContent>
          <TextField
            label="Username"
            variant="outlined"
            value={newMemberUsername}
            onChange={(e) => setNewMemberUsername(e.target.value)}
            fullWidth
            sx={{
              marginBottom: 2,
              backgroundColor: "#333",
              borderRadius: 1,
              "& .MuiOutlinedInput-root": {
                color: "white",
                "& fieldset": { borderColor: "#555" },
                "&:hover fieldset": { borderColor: "#00e676" },
              },
              "& .MuiInputLabel-root": { color: "#ccc" },
            }}
          />
          <Button
            variant="contained"
            fullWidth
            onClick={handleAddNewMember}
            sx={{
              background: "linear-gradient(135deg, #00e676, #00b258)",
              color: "white",
              fontWeight: "bold",
              borderRadius: "8px",
              "&:hover": {
                background: "linear-gradient(135deg, #00c867, #009c3c)",
              },
            }}
          >
            Add Member
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default GroupMembers;
