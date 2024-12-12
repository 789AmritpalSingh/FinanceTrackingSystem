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
  Grid,
  Avatar,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'; // Importing the AccountBalance icon
import ReceiptIcon from '@mui/icons-material/Receipt'; // Importing the Receipt icon
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
    <Box sx={{
      padding: 4, bgcolor: '#1E1E1E', color: '#FFF', marginTop: 4, borderRadius: '12px', overflowY: 'auto',
      maxHeight: '65vh'
    }}>
      {/* Display Balances */}
      {balances.length !== 0 && ( 
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: '#4CAF50', width: 36, height: 36, mr: 2 }}>
            <AccountBalanceIcon sx={{ color: '#FFF' }} />
          </Avatar>
          <Typography variant="h5" sx={{ color: "#4CAF50", fontWeight: "bold" }}>
            Balances
          </Typography>
        </Box>
      </Box>)}

      {balancesLoading || loading ? (
        <CircularProgress sx={{ display: "block", margin: "20px auto", color: '#4CAF50' }} />
      ) : balances.length === 0 && expenses.length === 0 ? (
        <Typography
          align="center"
          sx={{
            mt: 4,
            color: "lightgray",
            fontSize: { xs: "1rem", md: "1.5rem" }, // Responsive font size
            fontWeight: "bold", // Make the text bold
          }}
        >
          This group does not record any expense yet. Be the first one to add an expense in this group!!
        </Typography>
      ) : (
        <>
          <Typography
            variant="body1"
            sx={{
              color: '#4CAF50',
              fontWeight: 'bold',
              mb: 2,
              mt: 2,
              background: 'linear-gradient(45deg, #333, #1E1E1E)',
              p: 2,
              borderRadius: '8px',
              boxShadow: '0 4px 10px rgba(0, 150, 0, 0.2)',
            }}
          >
            {formattedTotalBalance}
          </Typography>

          {balances.length > 0 && (
            <Grid container spacing={2}>
              {balances.map((balance) => {
                const member = members.find(m => m.user_id === balance.other_user_id);
                const username = member?.username || "Unknown";
                const isOwed = balance.balance > 0;
                const formattedBalance = Math.abs(balance.balance).toFixed(2);
                return (
                  <Grid item xs={12} sm={6} md={4} key={balance.other_user_id}>
                    <Paper elevation={3} sx={{ p: 2, bgcolor: "#333", borderRadius: 2 }}>
                      <Typography variant="subtitle1" sx={{ color: isOwed ? "#4CAF50" : "#FF5722", fontWeight: 'medium' }}>
                        {username}: ${formattedBalance}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#CCC" }}>
                        {isOwed ? `You are owed $${formattedBalance} by ${username}` : `You owe $${formattedBalance} to ${username}`}
                      </Typography>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          )}

          <Divider sx={{ my: 4, bgcolor: '#555' }} /> {/* Divider after balances */}

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Avatar sx={{ bgcolor: '#FF5722', width: 36, height: 36, mr: 2 }}>
              <ReceiptIcon sx={{ color: '#FFF' }} />
            </Avatar>
            <Typography variant="h5" sx={{ color: "#FF5722", fontWeight: "bold" }}>
              Expenses
            </Typography>
          </Box>

          {expenses.length > 0 ? (
            expenses.map((expense) => {
              const displayName = expense.username === loggedInUsername ? "You" : expense.username || "Unknown";
              const formattedAmount = parseFloat(expense.amount).toFixed(2);
              const userShare = expense.shares?.find(share => share.user_id === loggedInUserId);
              let userInvolvementMessage = "You are not involved";
              if (userShare) {
                const shareAmount = parseFloat(userShare.share_amount).toFixed(2);
                userInvolvementMessage = expense.paid_by === loggedInUserId
                  ? `You lent $${shareAmount}`
                  : `You borrowed $${shareAmount}`;
              }
              const canDeleteAndEdit = loggedInUserId === creatorUserId || loggedInUserId === expense.paid_by;
              return (
                <Paper key={expense.id} elevation={3} sx={{ my: 2, p: 2, bgcolor: "#333", borderRadius: 2 }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ color: '#FFF', fontWeight: 'medium' }}>
                    {expense.expense_name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#CCC" }}>
                    Amount: ${formattedAmount} - Paid by: {displayName} - Date: {formatDate(expense.date)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#CCC" }}>
                    {userInvolvementMessage}
                  </Typography>
                  {canDeleteAndEdit && (
                    <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <Button variant="contained" color="primary" onClick={() => handleUpdateExpenseModalOpen(expense)}>
                        Edit
                      </Button>
                      <Button variant="contained" color="error" onClick={() => {
                        setExpenseToDelete(expense.id);
                        setConfirmDeleteOpen(true);
                      }}>
                        Delete
                      </Button>
                    </Box>
                  )}
                </Paper>
              );
            })
          ) : null}
        </>
      )}

      {/* Sticky Button positioned at the bottom of the viewport */}
      <Box sx={{
        position: 'fixed',
        bottom: 30,  // Adjust this value as needed
        right: 30,   // Adjust this value as needed
        zIndex: 1100 // Ensures it stays on top of other content
      }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ bgcolor: '#089404', '&:hover': { bgcolor: '#008000' } }}
          onClick={handleAddExpenseModalOpen}
        >
          Add New Expense
        </Button>
      </Box>

      {/* Confirmation Dialog when deleting expense */}
      <Dialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        PaperProps={{
          style: {
            backgroundColor: '#333',  // Dark background for the dialog
            color: '#DDD'  // Light text color for better readability on dark backgrounds
          }
        }}
      >
        <DialogTitle sx={{ color: '#FFF' }}>Confirm Expense Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#CCC' }}>
            Are you sure you want to delete this expense? This action cannot be undone and will update balances accordingly.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)} sx={{ color: '#4CAF50' }}>
            Cancel
          </Button>
          <Button onClick={handleDeleteExpense} sx={{ color: '#F44336' }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal for Adding a New Expense */}
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
            bgcolor: "#2C2C2C",  // Dark background consistent with the original modal theme
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            color: '#DDD',  // Ensuring text is light grey for readability
            border: "1px solid #333"  // Subtle border matching dark theme
          }}
        >
          <Typography id="add-expense-modal" variant="h6" component="h2" sx={{ color: '#FFF' }}>
            Add New Expense
          </Typography>
          <TextField
            label="Expense Name"
            fullWidth
            value={addExpenseName}
            onChange={(e) => setAddExpenseName(e.target.value)}
            sx={{
              marginBottom: 2,
              '& label.Mui-focused': { color: '#00e676' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#555' },
                '&:hover fieldset': { borderColor: '#777' },
                '&.Mui-focused fieldset': { borderColor: '#00e676' },
              }
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
              '& label.Mui-focused': { color: '#00e676' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#555' },
                '&:hover fieldset': { borderColor: '#777' },
                '&.Mui-focused fieldset': { borderColor: '#00e676' },
              }
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
            sx={{ marginBottom: 2 }}
            InputLabelProps={{ style: { color: "#AAA" } }}
            inputProps={{ style: { color: "#DDD" } }}
            MenuProps={{
              PaperProps: {
                style: {
                  backgroundColor: "#333",
                  color: "#FFF",
                }
              }
            }}
          >
            {members.map((member) => (
              <MenuItem key={member.id} value={member.user_id} sx={{ color: "#FFF", backgroundColor: "#333", '&:hover': { backgroundColor: "#555" } }}>
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
                    backgroundColor: "#333",
                    color: "#FFF",
                  }
                }
              }
            }}
            sx={{ marginBottom: 2 }}
            InputLabelProps={{ style: { color: "#AAA" } }}
            inputProps={{ style: { color: "#DDD" } }}
          >
            {members.map((member) => (
              <MenuItem key={member.id} value={member.user_id} sx={{ color: "#FFF", backgroundColor: "#333", '&:hover': { backgroundColor: "#555" } }}>
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
              color: '#FFF', // Text color white
            }}
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
          <Typography id="update-expense-modal" variant="h6" component="h2" sx={{ color: '#FFF' }}>
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
              }
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
              }
            }}
          >
            {members.map((member) => (
              <MenuItem key={member.id} value={member.user_id} style={{ color: "#FFF", backgroundColor: "#333" }}>
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
              }
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
              }
            }}
          >
            {members.map((member) => (
              <MenuItem key={member.id} value={member.user_id} style={{ color: "#FFF", backgroundColor: "#333" }}>
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
