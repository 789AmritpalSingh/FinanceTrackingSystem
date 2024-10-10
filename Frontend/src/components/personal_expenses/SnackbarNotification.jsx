import React from "react";
import { Snackbar, Alert } from "@mui/material";

const SnackbarNotification = ({ open, handleClose, message, severity }) => (
  <Snackbar
    open={open}
    autoHideDuration={6000}
    onClose={handleClose}
    anchorOrigin={{ vertical: "top", horizontal: "center" }}
  >
    <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
      {message}
    </Alert>
  </Snackbar>
);

export default SnackbarNotification;
