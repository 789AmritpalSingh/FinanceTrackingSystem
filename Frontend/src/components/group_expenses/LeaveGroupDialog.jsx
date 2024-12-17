import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
} from "@mui/material";

const LeaveGroupDialog = ({
  leaveGroupConfirmOpen,
  setLeaveGroupConfirmOpen,
  handleLeaveGroup,
}) => (
  <Dialog
    open={leaveGroupConfirmOpen}
    onClose={() => setLeaveGroupConfirmOpen(false)}
    PaperProps={{
      style: {
        backgroundColor: "#2C2C2C", // Dark background
        color: "#DDD", // Light text color
      },
    }}
  >
    <DialogTitle sx={{ color: "#FFF" }}>Confirm Leave Group</DialogTitle>
    <DialogContent>
      <DialogContentText sx={{ color: "#AAA" }}>
        Are you sure you want to leave this group? This action cannot be undone.
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button
        onClick={() => setLeaveGroupConfirmOpen(false)}
        sx={{ color: "#00e676" }}
      >
        Cancel
      </Button>
      <Button
        onClick={() => handleLeaveGroup(false)}
        sx={{ color: "#ff1744" }}
        autoFocus
      >
        Leave Group
      </Button>
    </DialogActions>
  </Dialog>
);

export default LeaveGroupDialog;
