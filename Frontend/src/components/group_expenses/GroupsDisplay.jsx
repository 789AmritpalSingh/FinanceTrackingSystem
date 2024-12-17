import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardActions,
  CircularProgress,
  Avatar,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import GroupIcon from "@mui/icons-material/Group";
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
import Grid from "@mui/material/Grid2";
import CreateNewGroupModal from "./CreateNewGroupModal";

const GroupsDisplay = () => {
  const [groupName, setGroupName] = useState("");
  const [groupCreationModalOpen, setGroupCreationModalOpen] = useState(false);
  const dispatch = useDispatch();
  const { groups, loading, error } = useSelector((state) => state.groups);
  const loggedInUserName = useSelector((state) => state.auth.username);

  // Fetch groups on component load
  useEffect(() => {
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
        id: newGroupResponse.data.id,
        group_name: newGroupResponse.data.group_name,
        creator_user_id: newGroupResponse.data.creator_user_id,
        creater_user_name: newGroupResponse.data.creater_user_name,
      };
      dispatch(addGroup(newGroup)); // Add the new group with both ID and name
      handleGroupCreationModalClose(); // Close the modal on success
    } catch (error) {
      dispatch(setError(error.message));
    }
  };

  return (
    <Box
      sx={{
        padding: 4,
        backgroundColor: "#121212",
        minHeight: "100vh",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        width: "100%", // Expands to full width
      }}
    >
      {/* Header with Your Groups and Create Group Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%", // Covers the full width
          paddingX: { xs: 2, md: 4 }, // Adds responsive horizontal padding
          marginBottom: 4, // Space between header and list
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            color: "#00e676",
          }}
        >
          Your Groups
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleGroupCreationModalOpen}
          sx={{
            minWidth: { xs: "100%", sm: "150px" }, // Button width is responsive
            bgcolor: "#089404", // Button color to match the focus border color
            "&:hover": {
              bgcolor: "#008000", // Darker shade for hover
            },
            borderRadius: "20px", // Add border radius here
            fontSize: { xs: "14px", md: "16px" }, // Responsive font size
            fontWeight: "bold",
            color: "white",
            height: { xs: "40px", md: "50px" }, // Adjust height for smaller screens
          }}
        >
          Create New Group
        </Button>
      </Box>

      {/* Groups List */}
      <Box
        sx={{
          width: "100%", // Covers the full width
          paddingX: { xs: 2, md: 4 }, // Adds responsive horizontal padding
        }}
      >
        {loading ? (
          <Box
            sx={{ display: "flex", justifyContent: "center", height: "200px" }}
          >
            <CircularProgress color="success" />
          </Box>
        ) : groups.length > 0 ? (
          <Grid container spacing={3}>
            {groups.map((group) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={group.id}>
                <Card
                  sx={{
                    background: "#1f1f1f",
                    color: "#fff",
                    borderRadius: 2,
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    "&:hover": { transform: "scale(1.05)" },
                    height: "250px", // Fixed height for uniform size
                    display: "flex",
                    flexDirection: "column",
                    padding: 2, // Consistent padding
                  }}
                >
                  {/* Top Section with Avatar */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 2,
                    }}
                  >
                    <Avatar
                      sx={{
                        backgroundColor: "#00e676",
                        width: 48,
                        height: 48,
                      }}
                    >
                      <GroupIcon />
                    </Avatar>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        color: "#fff",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        maxWidth: "70%", // Prevents the name from taking too much space
                      }}
                    >
                      {group.group_name}
                    </Typography>
                  </Box>

                  {/* Middle Section with Creator Info */}
                  <Box
                    sx={{
                      flexGrow: 1, // Fills remaining space
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      marginBottom: 2,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontStyle: "italic",
                        color: "#aaa", // Light grey for label
                        marginBottom: 0.5,
                      }}
                    >
                      Created by:
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: "bold",
                        color: "#00FFFF", // Highlight for creator's name
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        maxWidth: "100%", // Ensures text doesn't exceed container
                      }}
                    >
                      {loggedInUserName === group.creator_user_name
                        ? "You"
                        : group.creator_user_name}
                    </Typography>
                  </Box>

                  {/* Bottom Section with Actions */}
                  <CardActions
                    sx={{
                      padding: 0,
                      justifyContent: "center",
                    }}
                  >
                    <Button
                      component={Link}
                      to={`/group_expenses/${group.id}`}
                      sx={{
                        color: "#00e676",
                        fontWeight: "bold",
                        "&:hover": { textDecoration: "underline" },
                      }}
                    >
                      View Group
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body1" sx={{ textAlign: "center" }}>
            No groups available. Create your first group!
          </Typography>
        )}
      </Box>

      <CreateNewGroupModal
        groupCreationModalOpen={groupCreationModalOpen}
        handleGroupCreationModalClose={handleGroupCreationModalClose}
        handleCreateGroup={handleCreateGroup}
        groupName={groupName}
        setGroupName={setGroupName}
      />
    </Box>
  );
};

export default GroupsDisplay;
