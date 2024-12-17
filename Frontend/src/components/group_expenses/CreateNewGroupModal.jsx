import React from "react";
import { Box, Modal, Typography, TextField, Button } from "@mui/material";

const CreateNewGroupModal = ({
  groupCreationModalOpen,
  handleGroupCreationModalClose,
  handleCreateGroup,
  groupName,
  setGroupName
}) => (
  <Modal open={groupCreationModalOpen} onClose={handleGroupCreationModalClose}>
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: { xs: "90%", sm: 400 }, // Responsive width
        bgcolor: "#2C2C2C", // Updated background color
        color: "#DDD", // Light grey text color
        boxShadow: 24,
        border: "1px solid #333", // Subtle border
        borderRadius: 2, // Rounded corners
        p: { xs: 2, sm: 4 }, // Responsive padding
      }}
    >
      <Typography
        variant="h6"
        sx={{
          textAlign: "center",
          marginBottom: 2,
          color: "#00e676", // Highlighted title color
        }}
      >
        Create a New Group
      </Typography>
      <TextField
        label="Group Name"
        variant="outlined"
        fullWidth
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        InputLabelProps={{
          style: { color: "#AAA" }, // Light grey labels
        }}
        inputProps={{
          style: { color: "#DDD" }, // Light grey input text
        }}
        sx={{
          marginBottom: 2,
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#555", // Grey border for input fields
            },
            "&:hover fieldset": {
              borderColor: "#777", // Lighter grey on hover
            },
            "&.Mui-focused fieldset": {
              borderColor: "#00e676", // Highlight color when field is focused
            },
          },
        }}
      />
      <Button
        variant="contained"
        fullWidth
        onClick={handleCreateGroup}
        sx={{
          mt: 2,
          bgcolor: "#089404", // Button color matching the focus border
          "&:hover": {
            bgcolor: "#008000", // Darker shade for hover
          },
        }}
      >
        Submit
      </Button>
    </Box>
  </Modal>
);

export default CreateNewGroupModal;
