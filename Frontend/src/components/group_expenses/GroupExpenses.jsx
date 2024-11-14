import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Modal,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
  List,
  ListItem,
  CircularProgress,
  Paper,
  ListItemText,
  Divider,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { addNewExpenseToGroup } from "../api_functions/group_expenses/addNewExpenseToGroup";
import {
  addGroupExpense,
  setGroupExpense,
  setGroupExpenseError,
  setLoading,
} from "../../redux/groupExpensesSlice";
import { getGroupExpenses } from "../api_functions/group_expenses/getGroupExpenses";
import { setGroupBalances, setGroupBalancesError, setGroupBalancesLoading } from "../../redux/groupBalancesSlice";
import { getGroupBalances } from "../api_functions/group_expenses/getGroupBalances";

const GroupExpenses = ({ groupId }) => {
  const dispatch = useDispatch();
  const { expenses, loading, error } = useSelector(
    (state) => state.groupExpenses
  );
  const members = useSelector((state) => state.groupMembers.members);
  const { balances, balancesLoading, balancesError } = useSelector((state) => state.groupBalances);

  // State for managing the add expense modal and input fields
  const [addExpenseModalOpen, setAddExpenseModalOpen] = useState(false);
  const [expenseName, setExpenseName] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [splitBetween, setSplitBetween] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Toggle modal visibility
  const handleAddExpenseModalOpen = () => setAddExpenseModalOpen(true);
  const handleAddExpenseModalClose = () => setAddExpenseModalOpen(false);

  // Fetch expenses and balances on mount
  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchExpensesAndBalances = async () => {
      dispatch(setLoading(true));
      dispatch(setGroupBalancesLoading(true));
      try {
        const expensesList = await getGroupExpenses(token, groupId);
        dispatch(setGroupExpense(expensesList));

        const balancesList = await getGroupBalances(token, groupId); // Fetch balances
        dispatch(setGroupBalances(balancesList));
      } catch (err) {
        dispatch(setGroupExpenseError(err.message));
        dispatch(setGroupBalancesError(err.message));
      } finally {
        dispatch(setLoading(false));
        dispatch(setGroupBalancesLoading(false));
      }
    };

    fetchExpensesAndBalances();
  }, [groupId, dispatch]);

  // Handle form submission to add a new expense
  const handleAddExpense = async () => {
    if (!expenseName || !amount || !paidBy || splitBetween.length === 0) {
      dispatch(setGroupExpenseError("All fields are required."));
      return;
    }

    const newExpenseData = {
      group_id: parseInt(groupId),
      expense_name: expenseName,
      amount: parseFloat(amount),
      paid_by: parseInt(paidBy),
      split_between: splitBetween.map((id) => parseInt(id)),
    };

    const token = localStorage.getItem("token");

    try {
      const data = await addNewExpenseToGroup(token, newExpenseData);
      dispatch(addGroupExpense(data.expense_details))
      alert(data.message); // Notify user on success
      handleAddExpenseModalClose(); // Close modal on success
      setSnackbarOpen(true); // Open feedback snackbar
      // Reset fields
      setExpenseName("");
      setAmount("");
      setPaidBy("");
      setSplitBetween([]);
    } catch (error) {
      dispatch(setGroupExpenseError(error.message));
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
  };
  

  return (
    <Box sx={{ padding: 4 }}>

      {/* Display Balances */}
      <Typography
        variant="h6"
        gutterBottom
        sx={{ color: "#00e676", fontWeight: "bold", marginTop: 4 }}
      >
        Balances
      </Typography>
      {balancesLoading ? (
        <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
      ) : (
        <Paper
          elevation={3}
          sx={{
            padding: 2,
            marginTop: 2,
            backgroundColor: "#333",
            borderRadius: 2,
          }}
        >
          <List>
            {balances.length > 0 ? (
              balances.map((balance) => {
                const member = members.find(
                  (m) => m.user_id === balance.other_user_id
                );
                const username = member?.username || "Unknown";
                const absoluteBalance = Math.abs(balance.balance);

                return (
                  <ListItem key={balance.other_user_id}>
                    <ListItemText
                      primary={`${username}: $${absoluteBalance}`}
                      secondary={
                        balance.balance > 0
                          ? `You are owed $${absoluteBalance} by ${username}`
                          : `You owe $${absoluteBalance} to ${username}`
                      }
                      sx={{ color: "white" }}
                      secondaryTypographyProps={{
                        style: { color: "#b0b0b0" },
                      }}
                    />
                  </ListItem>
                );
              })) : (
              <Typography
                variant="body1"
                color="white"
                sx={{ textAlign: "center", padding: 2 }}
              >
                No balances to display.
              </Typography>
            )}
          </List>
        </Paper>
      )}

      <Typography variant="h6" gutterBottom sx={{ color: "#00e676", fontWeight: "bold", marginTop: 5 }}>
        Expenses
      </Typography>

      {/* Display loading indicator */}
      {loading ? (
        <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
      ) : (
        <Paper
          elevation={3}
          sx={{
            padding: 2,
            marginTop: 2,
            marginBottom: 3,
            backgroundColor: "#333",
            borderRadius: 2,
          }}
        >
          <List>
            {expenses.length > 0 ? (
              expenses.map((expense) => (
                <React.Fragment key={expense?.id}>
                  <ListItem>
                    <ListItemText
                      primary={expense?.expense_name}
                      secondary={`Amount: $${expense?.amount} - Paid by: ${members.find((m) => m.user_id === expense?.paid_by)
                        ?.username || "Unknown"} - Date: ${formatDate(expense?.date)}`}
                      sx={{ color: "white" }}
                      secondaryTypographyProps={{
                        style: { color: "#b0b0b0" }, // Light gray color for secondary text
                      }}
                    />
                  </ListItem>
                  <Divider sx={{ backgroundColor: "#555" }} />
                </React.Fragment>
              ))
            ) : (
              <Typography
                variant="body1"
                color="white"
                sx={{ textAlign: "center", padding: 2 }}
              >
                No expenses to display for this group.
              </Typography>
            )}
          </List>
        </Paper>
      )}

      {/* Button for adding new expense. */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddExpenseModalOpen}
      >
        Add New Expense
      </Button>

      {/* Modal for Adding a New Expense */}
      <Modal open={addExpenseModalOpen} onClose={handleAddExpenseModalClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Add New Expense
          </Typography>

          <TextField
            label="Expense Name"
            fullWidth
            value={expenseName}
            onChange={(e) => setExpenseName(e.target.value)}
            sx={{ marginBottom: 2 }}
          />

          <TextField
            label="Amount"
            fullWidth
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            sx={{ marginBottom: 2 }}
          />

          <TextField
            label="Paid By"
            select
            fullWidth
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
            sx={{ marginBottom: 2 }}
          >
            {members.map((member) => (
              <MenuItem key={member.id} value={member.user_id}>
                {member.username}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Split Between"
            select
            fullWidth
            value={splitBetween}
            onChange={(e) => setSplitBetween(e.target.value)}
            SelectProps={{
              multiple: true,
            }}
            sx={{ marginBottom: 2 }}
          >
            {members.map((member) => (
              <MenuItem key={member.id} value={member.user_id}>
                {member.username}
              </MenuItem>
            ))}
          </TextField>

          <Button
            variant="contained"
            color="primary"
            onClick={handleAddExpense}
            fullWidth
          >
            Submit
          </Button>
        </Box>
      </Modal>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Expense added successfully!
        </Alert>
      </Snackbar>

      {/* Error alert if any */}
      {error && (
        <Snackbar
          open={!!error}
          autoHideDuration={3000}
          onClose={() => dispatch(setGroupExpenseError(null))}
        >
          <Alert
            onClose={() => dispatch(setGroupExpenseError(null))}
            severity="error"
            sx={{ width: "100%" }}
          >
            {error}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default GroupExpenses;
