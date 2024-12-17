import React from "react";
import {
  TextField,
  Button,
  Modal,
  Box,
  Typography,
} from "@mui/material";

const EditGroupNameModal = ({ editGroupModalOpen, setEditGroupModalOpen, newGroupName, setNewGroupName, handleUpdateGroupName}) => (
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
        width: { xs: "90%", sm: 400 }, // Responsive width (90% for mobile, 400px for larger screens)
        bgcolor: "#2C2C2C",
        color: "#DDD",
        boxShadow: 24,
        border: "1px solid #333", // Subtle border matching dark theme
        borderRadius: 2, // Slight border radius
        p: { xs: 2, sm: 4 }, // Responsive padding
      }}
    >
      <Typography id="add-expense-modal" variant="h6" component="h2">
        Edit Group Name
      </Typography>
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
      <Button
        variant="contained"
        sx={{
          mt: 2,
          width: "100%", // Full width button on smaller screens
          bgcolor: "#089404", // Button color to match the focus border color
          "&:hover": {
            bgcolor: "#008000", // Darker shade for hover
          },
        }}
        onClick={handleUpdateGroupName}
        fullWidth
      >
        Update
      </Button>
    </Box>
  </Modal>
);

export default EditGroupNameModal;
