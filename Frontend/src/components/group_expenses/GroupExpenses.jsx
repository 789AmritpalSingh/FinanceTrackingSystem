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
import { getGroupNamesForUser } from "../api_functions/group_expenses/getGroupNamesForUser";

const GroupExpenses = () => {
  const [groupName, setGroupName] = useState("");
  const [groups, setGroups] = useState([]);
  const [groupCreationModalOpen, setGroupCreationModalOpen] = useState(false);
  const [error, setError] = useState("");

  const fetchGroups = async () => {
    try {
      // Retrieve token from local storage
      const token = localStorage.getItem("token");
      const userGroups = await getGroupNamesForUser(token);
      setGroups(userGroups);
    } catch (error) {
      console.error(error.message);
    }
  };

  // Fetch the groups the user is involved in on component load
  useEffect(() => {
    fetchGroups();
  });

  // Open and close modal handlers
  const handleGroupCreationModalOpen = () => setGroupCreationModalOpen(true);
  const handleGroupCreationModalClose = () => {
    setGroupCreationModalOpen(false);
    setGroupName("");
    setError("");
  };

  // Handle group creation
  const handleCreateGroup = async () => {
    if (groupName.trim() === "") {
      setError("Group name cannot be empty");
      return;
    }

    try {
      const token = localStorage.getItem("token")
      const newGroup = await createGroup(token, groupName);
      setGroups([...groups, newGroup]); // Add the new group to the existing groups list
      handleGroupCreationModalClose(); // Close the modal on success
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom sx={{color: "white"}}>
        Group Expenses
      </Typography>

      {/* Create Group Button */}
      <Box sx={{ display: "flex", alignItems: "center", marginBottom: 4, color: "white" }}>
        <IconButton onClick={handleGroupCreationModalOpen} color="primary">
          <AddCircleOutlineIcon fontSize="large" />
        </IconButton>
        <Typography variant="h6" sx={{ marginLeft: 1, color: "white" }}>
          Create New Group
        </Typography>
      </Box>

      {/* Existing Groups List */}
      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h6" sx={{color: "white"}}>Your Groups</Typography>
        {groups.length > 0 ? (
          <List>
            {groups.map((group, index) => (
              <ListItem key={index} sx={{color: "white"}}>
                <ListItemText primary={group} />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body1" sx={{color: "white"}}>
            You are not part of any groups yet.
          </Typography>
        )}
      </Box>

      {/* Modal for Creating a New Group */}
      <Modal open={groupCreationModalOpen} onClose={handleGroupCreationModalClose}>
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

export default GroupExpenses;
