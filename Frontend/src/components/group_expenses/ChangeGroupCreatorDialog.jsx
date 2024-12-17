import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const ChangeGroupCreatorDialog = ({
    selectNewCreatorOpen,
    setSelectNewCreatorOpen,
    newCreatorId,
    setNewCreatorId,
    members,
    loggedInUserId,
    handleChangeCreator,
}) => (
  <Dialog
    open={selectNewCreatorOpen}
    onClose={() => setSelectNewCreatorOpen(false)}
    PaperProps={{
      style: {
        backgroundColor: "#2C2C2C", // Dark background
        color: "#DDD", // Light text color
      },
    }}
  >
    <DialogTitle sx={{ color: "#FFF" }}>Select New Group Creator</DialogTitle>
    <DialogContent>
      <FormControl fullWidth>
        <InputLabel sx={{ color: "white" }}>Select Member</InputLabel>
        <Select
          value={newCreatorId}
          onChange={(e) => setNewCreatorId(e.target.value)}
          sx={{
            color: "#DDD", // Light input text
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#555", // Grey border
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#777", // Lighter grey on hover
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#00e676", // Highlight on focus
            },
          }}
          MenuProps={{
            PaperProps: {
              style: {
                backgroundColor: "#333", // Dark background for the dropdown
                color: "#FFF", // White text color for dropdown items
              },
            },
            getContentAnchorEl: null, // Ensures the dropdown is not misplaced
          }}
        >
          {members
            .filter((m) => m.user_id !== loggedInUserId)
            .map((member) => (
              <MenuItem
                key={member.user_id}
                value={member.user_id}
                sx={{
                  color: "#DDD", // Ensure text is visible against the dark menu background
                  backgroundColor: "#333", // Dark background for each item
                  "&:hover": {
                    backgroundColor: "#555", // Lighter on hover
                  },
                }}
              >
                {member.username}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </DialogContent>
    <DialogActions>
      <Button
        onClick={() => setSelectNewCreatorOpen(false)}
        sx={{ color: "#00e676" }}
      >
        Cancel
      </Button>
      <Button onClick={handleChangeCreator} sx={{ color: "#00e676" }} autoFocus>
        Change Creator
      </Button>
    </DialogActions>
  </Dialog>
);

export default ChangeGroupCreatorDialog;
