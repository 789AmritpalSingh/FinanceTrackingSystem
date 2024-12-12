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
  ListItemAvatar,
  Avatar,
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
          backgroundColor: "#1E1E1E",
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
            variant="h6"
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
              backgroundColor: "#089404",
              "&:hover": { backgroundColor: "#008000" },
              fontWeight: "bold",
            }}
            onClick={() => setViewMembers(true)}
          >
            Members
          </Button>
        </Box>
      </Box>

      {viewMembers && (
        <>
          <Paper
            elevation={3}
            sx={{
              padding: 2,
              mt: 2,
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
                        loggedInUserId === creatorUserId && loggedInUsername !== member.username && (
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
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: "#777", color: "#fff" }}>
                          {member.username[0].toUpperCase()}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          member.username === loggedInUsername
                            ? "You"
                            : member.username
                        }
                        primaryTypographyProps={{
                          fontWeight: 'bold',
                          color: '#F0DB4F', // A vibrant golden-yellow for great visibility
                          fontSize: '1rem' // Adjust the size according to your needs
                        }}
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
                backgroundColor: "#089404",
                "&:hover": { backgroundColor: "#008000" },
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


      <GroupExpenses groupId={groupId} loggedInUserId={loggedInUserId} />

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
              background: "#089404",
              color: "white",
              fontWeight: "bold",
              borderRadius: "8px",
              "&:hover": {
                background: "#008000",
              },
            }}
          >
            Add Member
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteMemberConfirmOpen}
        onClose={() => setDeleteMemberConfirmOpen(false)}
        PaperProps={{
          style: {
            backgroundColor: "#2C2C2C",
            color: "#DDD",
            borderRadius: "12px",
          },
        }}
      >
        <DialogTitle sx={{ color: "#FFF" }}>Confirm Member Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "#AAA" }}>
            Are you sure you want to remove this member from the group?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteMemberConfirmOpen(false)}
            sx={{ color: "#00e676" }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDeleteMember}
            sx={{ color: "#ff1744" }}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default GroupMembers;
