import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Avatar,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance"; // Importing the AccountBalance icon
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
import DeleteExpenseDialog from "./DeleteExpenseDialog";
import AddExpenseModal from "./AddExpenseModal";
import UpdateExpenseModal from "./UpdateExpenseModal";
import BalanceAndExpensesDisplay from "./BalanceAndExpensesDisplay";

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
      setGroupExpenseError(error.message);
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
      setGroupExpenseError(error.message);
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
    <Box
      sx={{
        padding: 4,
        bgcolor: "#1E1E1E",
        color: "#FFF",
        marginTop: 4,
        borderRadius: "12px",
        overflowY: "auto",
        maxHeight: "65vh",
      }}
    >
      {/* Display Balances */}
      {balances.length !== 0 && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 4,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar sx={{
              bgcolor: "#4CAF50",
              width: { xs: 28, sm: 36 }, // Responsive avatar size
              height: { xs: 28, sm: 36 }, // Responsive avatar size
              mr: 2,
            }}>
              <AccountBalanceIcon sx={{ color: "#FFF", fontSize: { xs: "1.2rem", sm: "1.5rem" } }} />
            </Avatar>
            <Typography
              sx={{ color: "#4CAF50", fontWeight: "bold", fontSize: { xs: "1.2rem", sm: "1.5rem" } }}
            >
              Balances
            </Typography>
          </Box>
        </Box>
      )
      }

      {
        balancesLoading || loading ? (
          <CircularProgress
            sx={{ display: "block", margin: "20px auto", color: "#4CAF50" }}
          />
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
            This group does not record any expense yet. Be the first one to add an
            expense in this group!!
          </Typography>
        ) : (
          <BalanceAndExpensesDisplay
            formattedTotalBalance={formattedTotalBalance}
            balances={balances}
            members={members}
            loggedInUsername={loggedInUsername}
            expenses={expenses}
            loggedInUserId={loggedInUserId}
            creatorUserId={creatorUserId}
            handleUpdateExpenseModalOpen={handleUpdateExpenseModalOpen}
            setExpenseToDelete={setExpenseToDelete}
            setConfirmDeleteOpen={setConfirmDeleteOpen}
            formatDate={formatDate}
          />
        )
      }

      {/* Sticky Button positioned at the bottom of the viewport */}
      <Box
        sx={{
          position: "fixed",
          bottom: 30, // Adjust this value as needed
          right: 30, // Adjust this value as needed
          zIndex: 1100, // Ensures it stays on top of other content
        }}
      >
        <Button
          variant="contained"
          color="primary"
          sx={{
            bgcolor: "#089404", "&:hover": { bgcolor: "#008000" }, fontSize: { xs: "0.8rem", sm: "1rem" }, // Responsive font size
            padding: { xs: "6px 12px", sm: "8px 16px" }, // Adjust padding for small screens
            borderRadius: "8px",
          }}
          onClick={handleAddExpenseModalOpen}
        >
          Add New Expense
        </Button>
      </Box>

      {/* Confirmation Dialog when deleting expense */}
      <DeleteExpenseDialog
        confirmDeleteOpen={confirmDeleteOpen}
        setConfirmDeleteOpen={setConfirmDeleteOpen}
        handleDeleteExpense={handleDeleteExpense}
      />

      {/* Modal for Adding a New Expense */}
      <AddExpenseModal
        addExpenseModalOpen={addExpenseModalOpen}
        handleAddExpenseModalClose={handleAddExpenseModalClose}
        addExpenseName={addExpenseName}
        setAddExpenseName={setAddExpenseName}
        addAmount={addAmount}
        setAddAmount={setAddAmount}
        addPaidBy={addPaidBy}
        setAddPaidBy={setAddPaidBy}
        members={members}
        loggedInUsername={loggedInUsername}
        addSplitBetween={addSplitBetween}
        setAddSplitBetween={setAddSplitBetween}
        handleAddExpense={handleAddExpense}
      />

      {/* Update Expense Modal */}
      <UpdateExpenseModal
        updateExpenseModalOpen={updateExpenseModalOpen}
        handleUpdateExpenseModalClose={handleUpdateExpenseModalClose}
        updateExpenseName={updateExpenseName}
        setUpdateExpenseName={setUpdateExpenseName}
        updateAmount={updateAmount}
        setUpdateAmount={setUpdateAmount}
        updatePaidBy={updatePaidBy}
        setUpdatePaidBy={setUpdatePaidBy}
        members={members}
        loggedInUsername={loggedInUsername}
        updateSplitBetween={updateSplitBetween}
        setUpdateSplitBetween={setUpdateSplitBetween}
        handleUpdateExpense={handleUpdateExpense}
      />

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
      {
        error && (
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
        )
      }
    </Box >
  );
};

export default GroupExpenses;
