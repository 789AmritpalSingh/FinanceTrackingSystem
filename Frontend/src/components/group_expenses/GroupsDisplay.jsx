import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Modal,
  IconButton,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Avatar,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
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

const GroupsDisplay = () => {
  const [groupName, setGroupName] = useState("");
  const [groupCreationModalOpen, setGroupCreationModalOpen] = useState(false);
  const dispatch = useDispatch();
  const { groups, loading, error } = useSelector((state) => state.groups);

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
        backgroundColor: "#1A1A1A",
        minHeight: "100vh",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Header */}
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: "bold",
          textTransform: "uppercase",
          color: "#00e676",
          marginBottom: 3,
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
        }}
      >
        Group Expenses
      </Typography>

      {/* Create Group Section */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "800px",
          marginBottom: 4,
        }}
      >
        <Card
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            padding: 3,
            background: "linear-gradient(135deg, #262626, #333333)",
            borderRadius: "16px",
            boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.5)",
            transition: "transform 0.3s, box-shadow 0.3s",
            "&:hover": {
              transform: "scale(1.02)",
              boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.6)",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              textAlign: { xs: "center", md: "left" },
              marginBottom: { xs: 2, md: 0 },
            }}
          >
            <AddCircleOutlineIcon
              sx={{
                fontSize: "2rem",
                color: "#00e676",
              }}
            />
            <Typography
              variant="h6"
              sx={{
                color: "#FFFFFF",
                fontWeight: "500",
              }}
            >
              Create a New Group
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={handleGroupCreationModalOpen}
            sx={{
              backgroundColor: "#00e676",
              color: "#1A1A1A",
              fontWeight: "bold",
              padding: { xs: "6px 12px", md: "8px 16px" }, // Adjust button size
              fontSize: { xs: "0.8rem", md: "1rem" }, // Adjust font size
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#00b258",
              },
            }}
          >
            Add Group
          </Button>
        </Card>
      </Box>

      {/* Groups List */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "800px",
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "200px",
            }}
          >
            <CircularProgress color="success" />
          </Box>
        ) : groups.length > 0 ? (
          <Grid container spacing={3}>
            {groups.map((group) => (
              <Grid size={{ xs: 12, md: 6 }} key={group.id}>
                <Card
                  sx={{
                    background: "linear-gradient(135deg, #262626, #333333)",
                    color: "#FFFFFF",
                    borderRadius: "16px",
                    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.5)",
                    transition: "transform 0.3s",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  <CardContent sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar
                      sx={{
                        backgroundColor: "#00e676",
                        marginRight: 2,
                        width: 40,
                        height: 40,
                      }}
                    >
                      <GroupIcon />
                    </Avatar>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "500",
                      }}
                    >
                      {group.group_name}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      component={Link}
                      to={`/group_expenses/${group.id}`}
                      sx={{
                        color: "#00e676",
                        textTransform: "none",
                        fontWeight: "bold",
                        "&:hover": {
                          textDecoration: "underline",
                        },
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
          <Box
            sx={{
              textAlign: "center",
              padding: 4,
              backgroundColor: "#262626",
              borderRadius: "16px",
              boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.5)",
              marginTop: 3,
            }}
          >
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              You are not part of any groups yet.
            </Typography>
            <Button
              variant="contained"
              onClick={handleGroupCreationModalOpen}
              startIcon={<AddCircleOutlineIcon />}
              sx={{
                backgroundColor: "#00e676",
                color: "#1A1A1A",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "#00b258",
                },
              }}
            >
              Create a Group
            </Button>
          </Box>
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
            width: "90%",
            maxWidth: 400,
            bgcolor: "#262626",
            color: "#FFFFFF",
            boxShadow: 24,
            p: 4,
            borderRadius: "16px",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              marginBottom: 2,
              textAlign: "center",
              color: "#00e676",
            }}
          >
            Create a New Group
          </Typography>
          <TextField
            label="Group Name"
            variant="outlined"
            fullWidth
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            sx={{
              marginBottom: 2,
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#333333",
                color: "#FFFFFF",
                "& fieldset": {
                  borderColor: "#00e676",
                },
                "&:hover fieldset": {
                  borderColor: "#00b258",
                },
              },
              "& .MuiInputLabel-root": {
                color: "#AAAAAA",
              },
            }}
          />
          <Button
            variant="contained"
            fullWidth
            onClick={handleCreateGroup}
            sx={{
              backgroundColor: "#00e676",
              color: "#1A1A1A",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#00b258",
              },
            }}
          >
            Submit
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default GroupsDisplay;
