import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, DialogContentText } from "@mui/material";

const DeleteConfirmationDialog = ({
  deleteDialogOpen,
  handleCloseDeleteDialog,
  handleConfirmDelete
}) => (
    <Dialog
    open={deleteDialogOpen}
    onClose={handleCloseDeleteDialog}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
    PaperProps={{
      style: {
        backgroundColor: "#2C2C2C", // Dark background for the modal
        color: "#DDD", // Light text color for readability
      },
    }}
  >
    <DialogTitle id="alert-dialog-title" sx={{ color: "#FFF" }}>
      {"Confirm Deletion"}
    </DialogTitle>
    <DialogContent>
      <DialogContentText
        id="alert-dialog-description"
        sx={{ color: "#AAA" }}
      >
        Do you want to delete this expense? This action cannot be undone.
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleCloseDeleteDialog} sx={{ color: "#00e676" }}>
        Cancel
      </Button>
      <Button
        onClick={handleConfirmDelete}
        sx={{ color: "#ff1744" }}
        autoFocus
      >
        Delete
      </Button>
    </DialogActions>
  </Dialog>
);

export default DeleteConfirmationDialog;
