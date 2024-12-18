import React from "react";
import {
  TextField,
  Button,
  Modal,
  Typography,
  Box,
  MenuItem,
} from "@mui/material";

const AddExpenseModal = ({
  addExpenseModalOpen,
  handleAddExpenseModalClose,
  addExpenseName,
  setAddExpenseName,
  addAmount,
  setAddAmount,
  addPaidBy,
  setAddPaidBy,
  members,
  loggedInUsername,
  addSplitBetween,
  setAddSplitBetween,
  handleAddExpense,
}) => (
  <Modal
    open={addExpenseModalOpen}
    onClose={handleAddExpenseModalClose}
    aria-labelledby="add-expense-modal"
    aria-describedby="modal-for-adding-expense"
  >
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400, // Fixed width
        bgcolor: "#2C2C2C", // Dark background consistent with the original modal theme
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
        color: "#DDD", // Ensuring text is light grey for readability
        border: "1px solid #333", // Subtle border matching dark theme
      }}
    >
      <Typography
        id="add-expense-modal"
        variant="h6"
        component="h2"
        sx={{ color: "#FFF" }}
      >
        Add New Expense
      </Typography>
      <TextField
        label="Expense Name"
        fullWidth
        value={addExpenseName}
        onChange={(e) => setAddExpenseName(e.target.value)}
        sx={{
          marginBottom: 2,
          "& label.Mui-focused": { color: "#00e676" },
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "#555" },
            "&:hover fieldset": { borderColor: "#777" },
            "&.Mui-focused fieldset": { borderColor: "#00e676" },
          },
        }}
        InputLabelProps={{ style: { color: "#AAA" } }}
        inputProps={{ style: { color: "#DDD" } }}
      />
      <TextField
        label="Amount"
        fullWidth
        type="number"
        value={addAmount}
        onChange={(e) => setAddAmount(e.target.value)}
        sx={{
          marginBottom: 2,
          "& label.Mui-focused": { color: "#00e676" },
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "#555" },
            "&:hover fieldset": { borderColor: "#777" },
            "&.Mui-focused fieldset": { borderColor: "#00e676" },
          },
        }}
        InputLabelProps={{ style: { color: "#AAA" } }}
        inputProps={{ style: { color: "#DDD" } }}
      />
      <TextField
        label="Paid By"
        select
        fullWidth
        value={addPaidBy}
        onChange={(e) => setAddPaidBy(e.target.value)}
        sx={{
          marginBottom: 2,
          "& .MuiInputBase-root": {
            backgroundColor: "#333", // Dark background for the input field
            color: "#FFF", // White text for the input field
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "#555" },
            "&:hover fieldset": { borderColor: "#777" },
            "&.Mui-focused fieldset": { borderColor: "#00e676" },
          },
        }}
        InputLabelProps={{ style: { color: "#AAA" } }}
        inputProps={{ style: { color: "#FFF" } }} // White text for the input field
        MenuProps={{
          PaperProps: {
            style: {
              backgroundColor: "#333", // Dark background for the dropdown menu
              color: "#FFF", // White text for the dropdown menu items
            },
          },
        }}
      >
        {members.map((member) => (
          <MenuItem
            key={member.id}
            value={member.user_id}
            sx={{
              color: "#FFF", // White text for menu items
              backgroundColor: "#333", // Dark background for menu items
              "&.Mui-selected": {
                backgroundColor: "#00e676", // Green background for the selected item
                color: "#000", // Black text for better readability on green
              },
              "&.Mui-selected:hover": {
                backgroundColor: "#00c853", // Darker green for hover on the selected item
              },
              "&:hover": {
                backgroundColor: "#555", // Hover effect for unselected items
              },
            }}
          >
            {member.username === loggedInUsername ? "You" : member.username}
          </MenuItem>
        ))}
      </TextField>


      <TextField
        label="Split Between"
        select
        fullWidth
        value={addSplitBetween}
        onChange={(e) => setAddSplitBetween(e.target.value)}
        SelectProps={{
          multiple: true,
          MenuProps: {
            PaperProps: {
              style: {
                backgroundColor: "#333", // Dark background for dropdown
                color: "#FFF", // White text for dropdown items
              },
            },
          },
        }}
        sx={{
          marginBottom: 2,
          "& .MuiInputBase-root": { backgroundColor: "#333", color: "#FFF" }, // Dark background and white text for input
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "#555" },
            "&:hover fieldset": { borderColor: "#777" },
            "&.Mui-focused fieldset": { borderColor: "#00e676" },
          },
        }}
        InputLabelProps={{ style: { color: "#AAA" } }}
        inputProps={{ style: { color: "#FFF" } }} // White text for input
      >
        {members.map((member) => (
          <MenuItem
            key={member.id}
            value={member.user_id}
            sx={{
              color: "#FFF",
              backgroundColor: "#333",
              "&:hover": { backgroundColor: "#555" },
            }}
          >
            {member.username === loggedInUsername ? "You" : member.username}
          </MenuItem>
        ))}
      </TextField>

      <Button
        variant="contained"
        sx={{
          mt: 2,
          width: "100%", // Full width button on smaller screens
          bgcolor: "#089404", // Button color to match the focus border color
          "&:hover": { bgcolor: "#008000" }, // Darker shade for hover
          color: "#FFF", // Text color white
        }}
        onClick={handleAddExpense}
        fullWidth
      >
        Submit
      </Button>
    </Box>
  </Modal>
);

export default AddExpenseModal;
