import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
} from "@mui/material";

const DeleteExpenseDialog = ({
  confirmDeleteOpen,
  setConfirmDeleteOpen,
  handleDeleteExpense,
}) => (
  <Dialog
    open={confirmDeleteOpen}
    onClose={() => setConfirmDeleteOpen(false)}
    PaperProps={{
      style: {
        backgroundColor: "#333", // Dark background for the dialog
        color: "#DDD", // Light text color for better readability on dark backgrounds
      },
    }}
  >
    <DialogTitle sx={{ color: "#FFF" }}>Confirm Expense Deletion</DialogTitle>
    <DialogContent>
      <DialogContentText sx={{ color: "#CCC" }}>
        Are you sure you want to delete this expense? This action cannot be
        undone and will update balances accordingly.
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button
        onClick={() => setConfirmDeleteOpen(false)}
        sx={{ color: "#4CAF50" }}
      >
        Cancel
      </Button>
      <Button onClick={handleDeleteExpense} sx={{ color: "#F44336" }}>
        Delete
      </Button>
    </DialogActions>
  </Dialog>
);

export default DeleteExpenseDialog;
