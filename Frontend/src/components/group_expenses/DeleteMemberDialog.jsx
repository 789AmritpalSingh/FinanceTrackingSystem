import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
} from "@mui/material";

const DeleteMemberDialog = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
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
        <Button onClick={onClose} sx={{ color: "#00e676" }}>
          Cancel
        </Button>
        <Button onClick={onConfirm} sx={{ color: "#ff1744" }} autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteMemberDialog;
