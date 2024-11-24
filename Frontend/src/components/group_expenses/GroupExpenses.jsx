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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { addNewExpenseToGroup } from "../api_functions/group_expenses/addNewExpenseToGroup";
import {
  addGroupExpense,
  removeGroupExpense,
  setGroupExpense,
  setGroupExpenseError,
  setLoading,
} from "../../redux/groupExpensesSlice";
import { getGroupExpenses } from "../api_functions/group_expenses/getGroupExpenses";
import {
  setGroupBalances,
  setGroupBalancesError,
  setGroupBalancesLoading,
} from "../../redux/groupBalancesSlice";
import { getUserBalances } from "../api_functions/group_expenses/getUserBalances";
import { deleteExpense } from "../api_functions/group_expenses/deleteExpense";
import { updateGroupExpense } from "../api_functions/group_expenses/updateGroupExpense";

const GroupExpenses = ({ groupId, loggedInUserId }) => {
  const dispatch = useDispatch();
  const { expenses, loading, error } = useSelector(
    (state) => state.groupExpenses
  );
  const members = useSelector((state) => state.groupMembers.members);
  const loggedInUsername = useSelector((state) => state.auth.username);
  const { balances, balancesLoading, balancesError } = useSelector(
    (state) => state.groupBalances
  );
  const creatorUserId = useSelector((state) =>
    state.groups.groups.find((g) => g.id === parseInt(groupId))
  )?.creator_user_id;

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  // State for managing the add expense modal and input fields
  const [addExpenseModalOpen, setAddExpenseModalOpen] = useState(false);
  const [addExpenseName, setAddExpenseName] = useState("");
  const [addAmount, setAddAmount] = useState("");
  const [addPaidBy, setAddPaidBy] = useState("");
  const [addSplitBetween, setAddSplitBetween] = useState([]);

  // State for managing the update expense modal and input fields
  const [updateExpenseModalOpen, setUpdateExpenseModalOpen] = useState(false);
  const [updateExpenseName, setUpdateExpenseName] = useState("");
  const [updateAmount, setUpdateAmount] = useState("");
  const [updatePaidBy, setUpdatePaidBy] = useState("");
  const [updateSplitBetween, setUpdateSplitBetween] = useState([]);
  const [selectedExpense, setSelectedExpense] = useState(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Toggle modal visibility
  const handleAddExpenseModalOpen = () => setAddExpenseModalOpen(true);
  const handleAddExpenseModalClose = () => setAddExpenseModalOpen(false);

  const handleUpdateExpenseModalOpen = (expense) => {
    // Extract user IDs from the shares array for split_between
    const splitBetweenIds = expense.shares?.map((share) => share.user_id) || [];

    setSelectedExpense(expense);
    setUpdateExpenseName(expense.expense_name);
    setUpdateAmount(expense.amount);
    setUpdatePaidBy(expense.paid_by);
    setUpdateSplitBetween(splitBetweenIds); // Use extracted user IDs for split_between
    setUpdateExpenseModalOpen(true);
  };

  const handleUpdateExpenseModalClose = () => {
    setSelectedExpense(null);
    setUpdateExpenseModalOpen(false);
  };

  // Fetch expenses and balances on mount
  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchExpensesAndBalances = async () => {
      dispatch(setLoading(true));
      dispatch(setGroupBalancesLoading(true));
      try {
        const expensesList = await getGroupExpenses(token, groupId);
        dispatch(setGroupExpense(expensesList));

        const balancesList = await getUserBalances(token, groupId); // Fetch balances
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
    if (
      !addExpenseName ||
      !addAmount ||
      !addPaidBy ||
      addSplitBetween.length === 0
    ) {
      dispatch(setGroupExpenseError("All fields are required."));
      return;
    }

    const newExpenseData = {
      group_id: parseInt(groupId),
      expense_name: addExpenseName,
      amount: parseFloat(addAmount),
      paid_by: parseInt(addPaidBy),
      split_between: addSplitBetween.map((id) => parseInt(id)),
    };

    const token = localStorage.getItem("token");

    console.log("New expense data", newExpenseData);

    try {
      const data = await addNewExpenseToGroup(token, newExpenseData);
      dispatch(addGroupExpense(data.expense_details));
      dispatch(setGroupBalances(data.updated_balances));
      alert(data.message); // Notify user on success
      handleAddExpenseModalClose(); // Close modal on success
      setSnackbarOpen(true); // Open feedback snackbar
      // Reset fields
      setAddExpenseName("");
      setAddAmount("");
      setAddPaidBy("");
      setAddSplitBetween([]);
    } catch (error) {
      dispatch(setGroupExpenseError(error.message));
    }
  };

  const handleUpdateExpense = async () => {
    if (
      !updateExpenseName ||
      !updateAmount ||
      !updatePaidBy ||
      updateSplitBetween.length === 0
    ) {
      dispatch(setGroupExpenseError("All fields are required."));
      return;
    }

    const updatedExpenseData = {
      expense_name: updateExpenseName,
      amount: parseFloat(updateAmount),
      paid_by: parseInt(updatePaidBy),
      split_between: updateSplitBetween.map((id) => parseInt(id)),
    };

    const token = localStorage.getItem("token");

    try {
      const data = await updateGroupExpense(
        token,
        selectedExpense.id,
        groupId,
        updatedExpenseData
      );
      console.log("Data", data);

      // Update Redux store
      dispatch(setGroupExpense(data.updated_expenses));
      dispatch(setGroupBalances(data.updated_balances));

      alert(data.message); // Notify user
      handleUpdateExpenseModalClose(); // Close modal
      // Reset fields
      setAddExpenseName("");
      setAddAmount("");
      setAddPaidBy("");
      setAddSplitBetween([]);
    } catch (error) {
      alert(`Failed to update expense: ${error.message}`);
    }
  };

  const handleDeleteExpense = async () => {
    if (!expenseToDelete) return;

    const token = localStorage.getItem("token");
    try {
      const { message, updated_balances } = await deleteExpense(
        token,
        expenseToDelete,
        groupId
      );

      // Update Redux
      dispatch(removeGroupExpense(expenseToDelete));
      dispatch(setGroupBalances(updated_balances));

      // Notify success
      alert(message);
    } catch (error) {
      alert(`Failed to delete expense: ${error.message}`);
    } finally {
      setConfirmDeleteOpen(false);
      setExpenseToDelete(null);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Intl.DateTimeFormat("en-US", options).format(
      new Date(dateString)
    );
  };

  // Calculate total balance the logged in user owes or is owed
  const totalBalance = balances.reduce((acc, balance) => {
    const numericBalance = parseFloat(balance.balance) || 0; // Ensure balance is a number
    return acc + numericBalance;
  }, 0);

  const formattedTotalBalance =
    totalBalance > 0
      ? `You are owed $${totalBalance.toFixed(2)} in total.`
      : totalBalance < 0
      ? `You owe $${Math.abs(totalBalance).toFixed(2)} in total.`
      : "Your balance is settled";

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
          {/* Total Balance Section */}
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              color: "#00e676",
              fontWeight: "bold",
              marginTop: 4,
              textAlign: "center",
            }}
          >
            {formattedTotalBalance}
          </Typography>
          <List>
            {balances.length > 0 ? (
              balances.map((balance) => {
                // Find the corresponding member to get the username
                const member = members.find(
                  (m) => m.user_id === balance.other_user_id
                );
                const username = member?.username || "Unknown"; // Default to "Unknown" if member is not found
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
              })
            ) : (
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

      <Typography
        variant="h6"
        gutterBottom
        sx={{ color: "#00e676", fontWeight: "bold", marginTop: 5 }}
      >
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
              expenses.map((expense) => {
                const displayName =
                  expense?.username === loggedInUsername
                    ? "You"
                    : expense?.username || "Unknown";

                // Check if the logged-in user is involved
                const userShare = expense.shares?.find(
                  (share) => share.user_id === loggedInUserId
                );

                let userInvolvementMessage = "You are not involved";
                if (userShare) {
                  const shareAmount = parseFloat(userShare.share_amount) || 0; // Ensure share_amount is a valid number
                  if (expense.paid_by === loggedInUserId) {
                    userInvolvementMessage = `You lent $${shareAmount.toFixed(
                      2
                    )}`;
                  } else {
                    userInvolvementMessage = `You borrowed $${shareAmount.toFixed(
                      2
                    )}`;
                  }
                }

                // Check if the logged-in user is either the creator or the payee
                const canDeleteAndEdit =
                  loggedInUserId === creatorUserId ||
                  loggedInUserId === expense.paid_by;

                return (
                  <React.Fragment key={expense?.id}>
                    <ListItem
                      secondaryAction={
                        canDeleteAndEdit && (
                          <>
                            <Button
                              color="primary"
                              onClick={() =>
                                handleUpdateExpenseModalOpen(expense)
                              }
                            >
                              Edit
                            </Button>
                            <Button
                              color="error"
                              onClick={() => {
                                setExpenseToDelete(expense.id);
                                setConfirmDeleteOpen(true); // Open confirmation dialog
                              }}
                            >
                              Delete
                            </Button>
                          </>
                        )
                      }
                    >
                      <ListItemText
                        primary={expense?.expense_name}
                        secondary={
                          <>
                            <div>
                              Amount: ${expense?.amount} - Paid by:{" "}
                              {displayName} - Date: {formatDate(expense?.date)}
                            </div>
                            <div>{userInvolvementMessage}</div>
                          </>
                        }
                        sx={{ color: "white" }}
                        secondaryTypographyProps={{
                          style: { color: "#b0b0b0" }, // Light gray color for secondary text
                        }}
                      />
                    </ListItem>
                    <Divider sx={{ backgroundColor: "#555" }} />
                  </React.Fragment>
                );
              })
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

      {/* Confirmation Dialog when deleting expense */}
      <Dialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
      >
        <DialogTitle>Confirm Expense Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this expense? This action cannot be
            undone and will update balances accordingly.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteExpense} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

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
            value={addExpenseName}
            onChange={(e) => setAddExpenseName(e.target.value)}
            sx={{ marginBottom: 2 }}
          />

          <TextField
            label="Amount"
            fullWidth
            type="number"
            value={addAmount}
            onChange={(e) => setAddAmount(e.target.value)}
            sx={{ marginBottom: 2 }}
          />

          <TextField
            label="Paid By"
            select
            fullWidth
            value={addPaidBy}
            onChange={(e) => setAddPaidBy(e.target.value)}
            sx={{ marginBottom: 2 }}
          >
            {members.map((member) => (
              <MenuItem key={member.id} value={member.user_id}>
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
            }}
            sx={{ marginBottom: 2 }}
          >
            {members.map((member) => (
              <MenuItem key={member.id} value={member.user_id}>
                {member.username === loggedInUsername ? "You" : member.username}
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

      {/* Update Expense Modal */}
      <Modal
        open={updateExpenseModalOpen}
        onClose={handleUpdateExpenseModalClose}
      >
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
            Update Expense
          </Typography>

          <TextField
            label="Expense Name"
            fullWidth
            value={updateExpenseName}
            onChange={(e) => setUpdateExpenseName(e.target.value)}
            sx={{ marginBottom: 2 }}
          />

          <TextField
            label="Amount"
            fullWidth
            type="number"
            value={updateAmount}
            onChange={(e) => setUpdateAmount(e.target.value)}
            sx={{ marginBottom: 2 }}
          />

          <TextField
            label="Paid By"
            select
            fullWidth
            value={updatePaidBy}
            onChange={(e) => setUpdatePaidBy(e.target.value)}
            sx={{ marginBottom: 2 }}
          >
            {members.map((member) => (
              <MenuItem key={member.id} value={member.user_id}>
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
            }}
            sx={{ marginBottom: 2 }}
          >
            {members.map((member) => (
              <MenuItem key={member.id} value={member.user_id}>
                {member.username === loggedInUsername ? "You" : member.username}
              </MenuItem>
            ))}
          </TextField>

          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdateExpense}
            fullWidth
          >
            Update
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
