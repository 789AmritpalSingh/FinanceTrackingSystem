import React from "react";
import { TextField, Button, Modal, Box, Typography } from "@mui/material";

const EditGroupNameModal = ({
  editGroupModalOpen,
  setEditGroupModalOpen,
  newGroupName,
  setNewGroupName,
  handleUpdateGroupName,
}) => (
  <Modal
    open={editGroupModalOpen}
    onClose={() => setEditGroupModalOpen(false)}
    aria-labelledby="edit-group-name-modal"
    aria-describedby="modal-for-updating-group-name"
  >
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: { xs: "90%", sm: 400, md: 500 }, // Responsive width
        bgcolor: "#2C2C2C",
        color: "#DDD",
        boxShadow: 24,
        border: "1px solid #333",
        borderRadius: 2,
        p: { xs: 2, sm: 3, md: 4 }, // Responsive padding
      }}
    >
      {/* Modal Title */}
      <Typography
        id="edit-group-name-modal"
        variant="h6"
        component="h2"
        sx={{
          fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" }, // Responsive font size
          textAlign: "center", // Center title text
          mb: { xs: 2, sm: 3 }, // Margin below title
        }}
      >
        Edit Group Name
      </Typography>

      {/* Text Field for Editing Group Name */}
      <TextField
        label="New Group Name"
        fullWidth
        variant="outlined"
        margin="normal"
        value={newGroupName}
        onChange={(e) => setNewGroupName(e.target.value)}
        InputLabelProps={{
          style: { color: "#AAA" },
        }}
        inputProps={{
          style: { color: "#DDD" },
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#555",
            },
            "&:hover fieldset": {
              borderColor: "#777",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#00e676",
            },
          },
        }}
      />

      {/* Update Button */}
      <Button
        variant="contained"
        sx={{
          mt: { xs: 2, sm: 3 }, // Margin-top adjusts for screen sizes
          width: "100%",
          bgcolor: "#089404",
          fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" }, // Responsive font size
          padding: { xs: "10px", sm: "12px" }, // Responsive padding
          "&:hover": {
            bgcolor: "#008000",
          },
          borderRadius: 2, // Button border radius for better aesthetics
        }}
        onClick={handleUpdateGroupName}
      >
        Update
      </Button>
    </Box>
  </Modal>
);

export default EditGroupNameModal;
