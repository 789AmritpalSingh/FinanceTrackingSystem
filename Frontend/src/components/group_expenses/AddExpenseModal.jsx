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
        width: { xs: "90%", sm: "75%", md: 400 }, // Responsive width
        bgcolor: "#2C2C2C", // Dark background consistent with the original modal theme
        boxShadow: 24,
        p: { xs: 2, sm: 3, md: 4 }, // Responsive padding
        borderRadius: 2,
        color: "#DDD", // Ensuring text is light grey for readability
        border: "1px solid #333", // Subtle border matching dark theme
      }}
    >
      {/* Modal Title */}
      <Typography
        id="add-expense-modal"
        variant="h6"
        component="h2"
        sx={{
          color: "#FFF",
          fontSize: { xs: "1.2rem", sm: "1.5rem" }, // Responsive font size
          textAlign: "center", // Center-align the title
          mb: 3, // Spacing below the title
        }}
      >
        Add New Expense
      </Typography>

      {/* Expense Name */}
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

      {/* Amount */}
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

      {/* Paid By */}
      <TextField
        label="Paid By"
        select
        fullWidth
        value={addPaidBy}
        onChange={(e) => setAddPaidBy(e.target.value)}
        sx={{
          marginBottom: 2,
          "& .MuiInputBase-root": {
            backgroundColor: "#333",
            color: "#FFF",
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "#555" },
            "&:hover fieldset": { borderColor: "#777" },
            "&.Mui-focused fieldset": { borderColor: "#00e676" },
          },
        }}
        InputLabelProps={{ style: { color: "#AAA" } }}
        inputProps={{ style: { color: "#FFF" } }}
        MenuProps={{
          PaperProps: {
            style: {
              backgroundColor: "#333",
              color: "#FFF",
            },
          },
        }}
      >
        {members.map((member) => (
          <MenuItem
            key={member.id}
            value={member.user_id}
            sx={{
              color: "#FFF",
              backgroundColor: "#333",
              "&.Mui-selected": {
                backgroundColor: "#00e676",
                color: "#000",
              },
              "&:hover": {
                backgroundColor: "#555",
              },
            }}
          >
            {member.username === loggedInUsername ? "You" : member.username}
          </MenuItem>
        ))}
      </TextField>

      {/* Split Between */}
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
                backgroundColor: "#333",
                color: "#FFF",
              },
            },
          },
        }}
        sx={{
          marginBottom: 2,
          "& .MuiInputBase-root": { backgroundColor: "#333", color: "#FFF" },
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "#555" },
            "&:hover fieldset": { borderColor: "#777" },
            "&.Mui-focused fieldset": { borderColor: "#00e676" },
          },
        }}
        InputLabelProps={{ style: { color: "#AAA" } }}
        inputProps={{ style: { color: "#FFF" } }}
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

      {/* Submit Button */}
      <Button
        variant="contained"
        sx={{
          mt: 2,
          width: "100%", // Full width button
          bgcolor: "#089404",
          "&:hover": { bgcolor: "#008000" },
          fontSize: { xs: "0.9rem", sm: "1rem" }, // Responsive font size
          padding: { xs: "8px 12px", sm: "10px 16px" }, // Responsive padding
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
