import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import {
  addExpense as addExpenseToRedux,
  deleteExpense as deleteExpenseFromRedux,
  setError,
  setExpenses,
  setLoading,
  updateExpense as updateExpenseInRedux,
} from "../../redux/personalExpensesSlice";
import { updateExpense } from "../api_functions/personal_expenses/updateExpense";
import { deleteExpense } from "../api_functions/personal_expenses/deleteExpense";
import { addExpense } from "../api_functions/personal_expenses/addExpense";
import { getExpenses } from "../api_functions/personal_expenses/getExpenses";
import AddExpenseModal from "./AddExpenseModal";
import UpdateExpenseModal from "./UpdateExpenseModal";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import SnackbarNotification from "./SnackbarNotification";
import ExpenseTableRow from "./ExpenseTableRow";

const PersonalExpenses = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // 'success' or 'error'
  const dispatch = useDispatch();
  const { expenses, loading, error } = useSelector(
    (state) => state.personalExpenses
  );

  const [addModalOpen, setAddModalOpen] = useState(false); // Modal open/close state
  const [newExpense, setNewExpense] = useState({
    amount: "",
    category: "",
    date: "",
    description: "",
  }); // form state for new expense getting added.

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  const [updateModalOpen, setUpdateModalOpen] = useState(false); // Track if update modal is open
  const [expenseToUpdate, setExpenseToUpdate] = useState(null); // Track the expense being updated

  const handleAddModalOpen = () => setAddModalOpen(true);
  const handleAddModalClose = () => setAddModalOpen(false);
  const handleSnackbarClose = () => setSnackbarOpen(false);

  const handleUpdateClick = (expense) => {
    setExpenseToUpdate(expense); // Populate the state with current expense data
    setUpdateModalOpen(true); // Open the update modal
  };

  const handleUpdateModalClose = () => {
    setUpdateModalOpen(false);
    setExpenseToUpdate(null); // Clear the state when the modal is closed
  };

  const handleDeleteClick = (expenseId) => {
    setExpenseToDelete(expenseId);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleConfirmDelete = async () => {
    const token = localStorage.getItem("token");
    if (expenseToDelete) {
      try {
        const success = await deleteExpense(token, expenseToDelete);
        if (success) {
          dispatch(deleteExpenseFromRedux(expenseToDelete));
          setSnackbarMessage("Expense deleted successfully.");
          setSnackbarSeverity("success");
        } else {
          setSnackbarMessage("Failed to delete expense.");
          setSnackbarSeverity("error");
        }
        setSnackbarOpen(true);
      } catch (error) {
        setSnackbarMessage(error.message);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
      setDeleteDialogOpen(false);
    }
  };

  const handleUpdateExpense = async () => {
    const token = localStorage.getItem("token");
    // Validation: Check if all required fields are filled
    if (
      !expenseToUpdate.amount ||
      !expenseToUpdate.category ||
      !expenseToUpdate.date ||
      !expenseToUpdate.description
    ) {
      setSnackbarMessage("All fields are required.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return; // Exit if validation fails
    }
    try {
      await updateExpense(token, expenseToUpdate);
      dispatch(updateExpenseInRedux(expenseToUpdate));
      setSnackbarMessage("Expense updated successfully.");
      setSnackbarSeverity("success");
      setUpdateModalOpen(false);
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarSeverity("error");
    }
    setSnackbarOpen(true);
  };

  const handleAddExpense = async () => {
    const token = localStorage.getItem("token");
    // Validation: Check if all required fields are filled
    if (
      !newExpense.amount ||
      !newExpense.category ||
      !newExpense.date ||
      !newExpense.description
    ) {
      setSnackbarMessage("All fields are required.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return; // Exit if validation fails
    }
    try {
      const data = await addExpense(token, newExpense);
      dispatch(addExpenseToRedux({ ...newExpense, id: data.expense_id }));
      setSnackbarMessage("Expense added successfully.");
      setSnackbarSeverity("success");
      setAddModalOpen(false);
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarSeverity("error");
    }
    setSnackbarOpen(true);
  };

  const handleFetchExpenses = async () => {
    const token = localStorage.getItem("token");
    try {
      dispatch(setLoading(true));
      const expenses = await getExpenses(token);
      dispatch(setExpenses(expenses));
    } catch (error) {
      dispatch(setError(error.message));
      setSnackbarSeverity("error");
      setSnackbarMessage(error.message);
      setSnackbarOpen(true);
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Fetch expenses on component mount
  useEffect(() => {
    handleFetchExpenses();
  }, []);

  return (
    <Container
      maxWidth={false}
      sx={{ backgroundColor: "#1A1A1A", minHeight: "100vh", py: 4 }}
    >
      <Box sx={{ my: 4, color: "white" }}>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#00e676" }}
        >
          Personal Expenses
        </Typography>

        {/* Icon Button to Open Add Expense Modal */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mb: 2,
            alignItems: "center",
          }}
        >
          <Tooltip title="Add Expense" arrow>
            <IconButton onClick={handleAddModalOpen} sx={{ color: "#00e676" }}>
              <AddIcon />
            </IconButton>
          </Tooltip>
          <Typography variant="button" sx={{ ml: 1, color: "#00e676" }}>
            Add Expense
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress sx={{ color: "#00e676" }} />
          </Box>
        ) : error ? (
          <Typography align="center" sx={{ mt: 4, color: "red" }}>
            {error} {/* Display error message */}
          </Typography>
        ) : expenses.length === 0 ? (
          <Typography align="center" sx={{ mt: 4, color: "lightgray" }}>
            No expenses found.
          </Typography>
        ) : (
          <TableContainer
            component={Paper}
            sx={{
              backgroundColor: "#2C2C2C",
              borderRadius: "10px",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.8)",
              color: "white",
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#333333" }}>
                  <TableCell
                    align="left"
                    sx={{
                      color: "#00e676",
                      fontWeight: "bold",
                      fontSize: "16px",
                    }}
                  >
                    Amount
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{
                      color: "#00e676",
                      fontWeight: "bold",
                      fontSize: "16px",
                    }}
                  >
                    Category
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{
                      color: "#00e676",
                      fontWeight: "bold",
                      fontSize: "16px",
                    }}
                  >
                    Date
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{
                      color: "#00e676",
                      fontWeight: "bold",
                      fontSize: "16px",
                    }}
                  >
                    Description
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color: "#00e676",
                      fontWeight: "bold",
                      fontSize: "16px",
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {expenses.map((expense) => (
                  <ExpenseTableRow
                    key={expense.id}
                    expense={expense}
                    handleUpdateClick={handleUpdateClick}
                    handleDeleteClick={handleDeleteClick}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      <AddExpenseModal
        addModalOpen={addModalOpen}
        handleAddModalClose={handleAddModalClose}
        handleAddExpense={handleAddExpense}
        newExpense={newExpense}
        setNewExpense={setNewExpense}
      />

      <UpdateExpenseModal
        updateModalOpen={updateModalOpen}
        handleUpdateModalClose={handleUpdateModalClose}
        handleUpdateExpense={handleUpdateExpense}
        expenseToUpdate={expenseToUpdate}
        setExpenseToUpdate={setExpenseToUpdate}
      />

      <DeleteConfirmationDialog
        deleteDialogOpen={deleteDialogOpen}
        handleCloseDeleteDialog={handleCloseDeleteDialog}
        handleConfirmDelete={handleConfirmDelete}
      />

      {/* Snackbar for success or error messages */}
      <SnackbarNotification
        open={snackbarOpen}
        handleClose={handleSnackbarClose}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </Container>
  );
};

export default PersonalExpenses;
