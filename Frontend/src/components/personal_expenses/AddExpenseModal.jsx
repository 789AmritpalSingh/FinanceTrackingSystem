import React from "react";
import { Box, Modal, Typography, TextField, Button } from "@mui/material";

const AddExpenseModal = ({
  addModalOpen,
  handleAddModalClose,
  handleAddExpense,
  newExpense,
  setNewExpense,
}) => (
  <Modal
    open={addModalOpen}
    onClose={handleAddModalClose}
    aria-labelledby="add-expense-modal"
    aria-describedby="modal-for-adding-expense"
  >
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "#2C2C2C",
        color: "#DDD",
        boxShadow: 24,
        p: 4,
      }}
    >
      <Typography id="add-expense-modal" variant="h6" component="h2">
        Add New Expense
      </Typography>
      <Box component="form" sx={{ mt: 2 }}>
        <TextField
          label="Amount"
          type="number"
          fullWidth
          variant="outlined"
          margin="normal"
          value={newExpense.amount}
          onChange={(e) =>
            setNewExpense({ ...newExpense, amount: e.target.value })
          }
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
        <TextField
          label="Category"
          fullWidth
          variant="outlined"
          margin="normal"
          value={newExpense.category}
          onChange={(e) =>
            setNewExpense({ ...newExpense, category: e.target.value })
          }
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
        <TextField
          label="Date"
          type="date"
          fullWidth
          variant="outlined"
          margin="normal"
          InputLabelProps={{
            shrink: true,
            style: { color: "#AAA" },
          }}
          inputProps={{
            style: { color: "#DDD" },
          }}
          value={newExpense.date}
          onChange={(e) =>
            setNewExpense({ ...newExpense, date: e.target.value })
          }
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
        <TextField
          label="Description"
          fullWidth
          variant="outlined"
          margin="normal"
          value={newExpense.description}
          onChange={(e) =>
            setNewExpense({ ...newExpense, description: e.target.value })
          }
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
            bgcolor: "#089404", // Button color to match the focus border color
            "&:hover": {
              bgcolor: "#008000", // Darker shade for hover
            },
          }}
          onClick={handleAddExpense}
        >
          Add Expense
        </Button>
      </Box>
    </Box>
  </Modal>
);

export default AddExpenseModal;
