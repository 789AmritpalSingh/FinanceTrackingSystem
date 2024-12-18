import React from "react";
import {
  TextField,
  Button,
  Modal,
  Box,
  Typography,
  MenuItem,
} from "@mui/material";

const UpdateExpenseModal = ({
  updateExpenseModalOpen,
  handleUpdateExpenseModalClose,
  updateExpenseName,
  setUpdateExpenseName,
  updateAmount,
  setUpdateAmount,
  updatePaidBy,
  setUpdatePaidBy,
  members,
  loggedInUsername,
  updateSplitBetween,
  setUpdateSplitBetween,
  handleUpdateExpense,
}) => (
  <Modal
    open={updateExpenseModalOpen}
    onClose={handleUpdateExpenseModalClose}
    aria-labelledby="update-expense-modal"
    aria-describedby="modal-for-updating-expense"
  >
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: { xs: "90%", sm: 400 }, // Responsive width (90% for mobile, 400px for larger screens)
        bgcolor: "#2C2C2C", // Dark background for the modal
        boxShadow: 24,
        p: { xs: 2, sm: 4 }, // Responsive padding
        borderRadius: 2, // Slight border radius
        border: "1px solid #333", // Subtle border matching dark theme
        color: "#DDD", // Light grey text for better readability on dark backgrounds
      }}
    >
      <Typography
        id="update-expense-modal"
        variant="h6"
        component="h2"
        sx={{ color: "#FFF" }}
      >
        Update Expense
      </Typography>

      <TextField
        label="Expense Name"
        fullWidth
        value={updateExpenseName}
        onChange={(e) => setUpdateExpenseName(e.target.value)}
        variant="outlined"
        margin="normal"
        InputLabelProps={{
          style: { color: "#AAA" }, // Light grey labels for better contrast
        }}
        inputProps={{
          style: { color: "#DDD" }, // Light grey input text
        }}
        sx={{
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

      {/* Amount Field */}
      <TextField
        label="Amount"
        fullWidth
        type="number" // Numeric input
        value={updateAmount}
        onChange={(e) => setUpdateAmount(e.target.value)}
        margin="normal"
        InputLabelProps={{ style: { color: "#AAA" } }}
        inputProps={{ style: { color: "#DDD" } }}
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "#555" },
            "&:hover fieldset": { borderColor: "#777" },
            "&.Mui-focused fieldset": { borderColor: "#00e676" },
          },
        }}
      />

      <TextField
        label="Paid By"
        select
        fullWidth
        value={updatePaidBy}
        onChange={(e) => setUpdatePaidBy(e.target.value)}
        InputLabelProps={{
          style: { color: "#AAA" }, // Light grey labels for better contrast
        }}
        inputProps={{
          style: { color: "#DDD" }, // Light grey input text
        }}
        SelectProps={{
          MenuProps: {
            PaperProps: {
              style: {
                backgroundColor: "#333", // Dark background for the dropdown
                color: "#FFF", // White text color for dropdown items
              },
            },
            getContentAnchorEl: null, // This property can help with positioning issues
          },
        }}
        sx={{
          marginBottom: 2,
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
          "& .MuiSelect-select": {
            color: "#DDD", // Ensuring the selected item text is also light grey
          },
        }}
      >
        {members.map((member) => (
          <MenuItem
            key={member.id}
            value={member.user_id}
            style={{ color: "#FFF", backgroundColor: "#333" }}
          >
            {member.username === loggedInUsername ? "You" : member.username}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Split Between"
        select
        fullWidth
        value={updateSplitBetween}
        onChange={(e) => setUpdateSplitBetween(e.target.value)}
        SelectProps={{
          multiple: true,
          MenuProps: {
            PaperProps: {
              style: {
                backgroundColor: "#333", // Dark background for the dropdown
                color: "#FFF", // White text color for dropdown items
              },
            },
            getContentAnchorEl: null, // This property can help with positioning issues
          },
        }}
        InputLabelProps={{
          style: { color: "#AAA" },
        }}
        inputProps={{
          style: { color: "#DDD" },
        }}
        sx={{
          marginBottom: 2,
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
          "& .MuiSelect-select": {
            color: "#DDD", // Ensuring the selected item text is also light grey
          },
        }}
      >
        {members.map((member) => (
          <MenuItem
            key={member.id}
            value={member.user_id}
            style={{ color: "#FFF", backgroundColor: "#333" }}
          >
            {member.username === loggedInUsername ? "You" : member.username}
          </MenuItem>
        ))}
      </TextField>

      <Button
        variant="contained"
        sx={{
          mt: 2,
          width: "100%",
          bgcolor: "#089404", // Button color to match the focus border color
          "&:hover": {
            bgcolor: "#008000", // Darker shade for hover
          },
        }}
        onClick={handleUpdateExpense}
      >
        Update
      </Button>
    </Box>
  </Modal>
);

export default UpdateExpenseModal;
