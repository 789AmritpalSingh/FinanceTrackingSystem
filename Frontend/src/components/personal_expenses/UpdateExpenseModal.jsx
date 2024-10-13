import React from "react";
import { Box, Modal, Typography, TextField, Button } from "@mui/material";

const UpdateExpenseModal = ({
  updateModalOpen,
  handleUpdateModalClose,
  handleUpdateExpense,
  expenseToUpdate,
  setExpenseToUpdate,
}) => (
  <Modal
    open={updateModalOpen}
    onClose={handleUpdateModalClose}
    aria-labelledby="update-expense-modal"
    aria-describedby="modal-for-updating-expense"
  >
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: { xs: '90%', sm: 400 }, // Responsive width (90% for mobile, 400px for larger screens)
        bgcolor: "#2C2C2C", // Dark background for the modal
        boxShadow: 24,
        p: { xs: 2, sm: 4 }, // Responsive padding
        borderRadius: 2, // Slight border radius
        border: "1px solid #333", // Subtle border matching dark theme
        color: "#DDD", // Light grey text for better readability on dark backgrounds
      }}
    >
      <Typography id="update-expense-modal" variant="h6" component="h2">
        Update Expense
      </Typography>
      {expenseToUpdate && (
        <Box component="form" sx={{ mt: 2 }}>
          <TextField
            label="Amount"
            type="number"
            fullWidth
            variant="outlined"
            margin="normal"
            value={expenseToUpdate.amount}
            onChange={(e) =>
              setExpenseToUpdate({
                ...expenseToUpdate,
                amount: e.target.value,
              })
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
            value={expenseToUpdate.category}
            onChange={(e) =>
              setExpenseToUpdate({
                ...expenseToUpdate,
                category: e.target.value,
              })
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
            // Ensure the date value is formatted correctly for the input field
            value={
              expenseToUpdate.date
                ? new Date(expenseToUpdate.date).toISOString().substring(0, 10)
                : ""
            }
            // Update the state only when the user changes the date
            onChange={(e) =>
              setExpenseToUpdate({
                ...expenseToUpdate,
                date: e.target.value || expenseToUpdate.date, // Retain existing date if input is empty
              })
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
            value={expenseToUpdate.description}
            onChange={(e) =>
              setExpenseToUpdate({
                ...expenseToUpdate,
                description: e.target.value,
              })
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
              width: "100%", // Full width button on smaller screens
              bgcolor: "#089404", // Button color to match the focus border color
              "&:hover": {
                bgcolor: "#008000", // Darker shade for hover
              },
            }}
            onClick={handleUpdateExpense}
          >
            Update Expense
          </Button>
        </Box>
      )}
    </Box>
  </Modal>
);

export default UpdateExpenseModal;
