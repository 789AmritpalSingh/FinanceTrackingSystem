import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  CircularProgress,
  useTheme,
  useMediaQuery,
  MenuItem,
  Menu,
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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getGroupsForUser } from "../api_functions/group_expenses/getGroupsForUser";
import { removeGroupMember } from "../api_functions/group_expenses/removeGroupMember";
import { clearGroupMembersState } from "../../redux/groupMembersSlice";
import { clearGroupExpensesState } from "../../redux/groupExpensesSlice";
import { clearGroupBalancesState } from "../../redux/groupBalancesSlice";
import { changeGroupCreator } from "../api_functions/group_expenses/changeGroupCreator";
import EditGroupNameModal from "./EditGroupNameModal";
import DeleteGroupDialog from "./DeleteGroupDialog";
import LeaveGroupDialog from "./LeaveGroupDialog";
import ChangeGroupCreatorDialog from "./ChangeGroupCreatorDialog";

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
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);

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

  const handleActionMenuOpen = (event) => {
    setActionMenuAnchor(event.currentTarget);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
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

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        padding: { xs: 2, md: 4 },
        backgroundColor: "#121212",
        minHeight: "100vh",
        color: "white",
      }}
    >
      {/* Group Header with Title and Actions */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          borderRadius: 2,
          backgroundColor: "#1E1E1E",
          padding: 2,
          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.5)",
          position: "sticky",
          zIndex: 1100,
          top: { xs: "60px", md: "90px" },
          marginBottom: 2,
          flexDirection: "row",
        }}
      >
        {/* Back Arrow and Group Name */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <IconButton
            onClick={() => navigate("/group_expenses")}
            sx={{
              color: "#FFF",
              backgroundColor: "#333",
              "&:hover": { backgroundColor: "#444" },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant={isSmallScreen ? "h5" : "h4"}
            sx={{
              fontWeight: "bold",
              color: "#FFF",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {group?.group_name}
          </Typography>
        </Box>

        {/* Actions Dropdown */}
        <Box>
          <Button
            onClick={handleActionMenuOpen}
            sx={{
              color: "#FFF",
              fontWeight: "bold",
              fontSize: { xs: "14px", sm: "16px" },
              backgroundColor: "#333",
              "&:hover": { backgroundColor: "#444" },
            }}
          >
            Actions
          </Button>
          <Menu
            anchorEl={actionMenuAnchor}
            open={Boolean(actionMenuAnchor)}
            onClose={handleActionMenuClose}
            PaperProps={{
              sx: {
                backgroundColor: "#333", // Dark background
                color: "#FFF", // White text
                boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.5)", // Subtle shadow
              },
            }}
          >
            {loggedInUserId === creatorUserId && (
              <>
                <MenuItem
                  onClick={() => {
                    setEditGroupModalOpen(true);
                    handleActionMenuClose();
                  }}
                >
                  <EditIcon sx={{ marginRight: 1 }} />
                  Edit Group Name
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setDeleteConfirmOpen(true);
                    handleActionMenuClose();
                  }}
                >
                  <DeleteIcon sx={{ marginRight: 1 }} />
                  Delete Group
                </MenuItem>
              </>
            )}
            <MenuItem
              onClick={() => {
                setLeaveGroupConfirmOpen(true);
                handleActionMenuClose();
              }}
            >
              Leave Group
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Render Group Members */}
      <GroupMembers
        groupId={groupId}
        loggedInUserId={loggedInUserId}
        creatorUserId={creatorUserId}
      />

      {/* Modal for Editing Group Name */}
      <EditGroupNameModal
        editGroupModalOpen={editGroupModalOpen}
        setEditGroupModalOpen={setEditGroupModalOpen}
        newGroupName={newGroupName}
        setNewGroupName={setNewGroupName}
        handleUpdateGroupName={handleUpdateGroupName}
      />

      {/* Confirmation Dialog for Deleting Group */}
      <DeleteGroupDialog
        deleteConfirmOpen={deleteConfirmOpen}
        setDeleteConfirmOpen={setDeleteConfirmOpen}
        handleDeleteGroup={handleDeleteGroup}
      />

      {/* Confirmation Dialog for Leaving Group */}
      <LeaveGroupDialog
        leaveGroupConfirmOpen={leaveGroupConfirmOpen}
        setLeaveGroupConfirmOpen={setLeaveGroupConfirmOpen}
        handleLeaveGroup={handleLeaveGroup}
      />

      {/* Dialogue for Changing the Group Creator */}
      <ChangeGroupCreatorDialog
        selectNewCreatorOpen={selectNewCreatorOpen}
        setSelectNewCreatorOpen={setSelectNewCreatorOpen}
        setNewCreatorId={setNewCreatorId}
        newCreatorId={newCreatorId}
        members={members}
        loggedInUserId={loggedInUserId}
        handleChangeCreator={handleChangeCreator}
      />
    </Box>
  );
};

export default GroupDetails;
