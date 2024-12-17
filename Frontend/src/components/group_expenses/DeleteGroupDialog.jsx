import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
} from "@mui/material";

const DeleteGroupDialog = ({
  deleteConfirmOpen,
  setDeleteConfirmOpen,
  handleDeleteGroup,
}) => (
  <Dialog
    open={deleteConfirmOpen}
    onClose={() => setDeleteConfirmOpen(false)}
    PaperProps={{
      style: {
        backgroundColor: "#2C2C2C", // Dark background
        color: "#DDD", // Light text color
      },
    }}
  >
    <DialogTitle sx={{ color: "#FFF" }}>Confirm Deletion</DialogTitle>
    <DialogContent>
      <DialogContentText sx={{ color: "#AAA" }}>
        Are you sure you want to delete this group? This action cannot be
        undone.
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button
        onClick={() => setDeleteConfirmOpen(false)}
        sx={{ color: "#00e676" }}
      >
        Cancel
      </Button>
      <Button onClick={handleDeleteGroup} sx={{ color: "#ff1744" }} autoFocus>
        Delete
      </Button>
    </DialogActions>
  </Dialog>
);

export default DeleteGroupDialog;
