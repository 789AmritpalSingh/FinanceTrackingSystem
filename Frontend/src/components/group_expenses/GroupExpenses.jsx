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
import { setGroupExpense, setGroupExpenseError, setLoading } from "../../redux/groupExpensesSlice";
import { getGroupExpenses } from "../api_functions/group_expenses/getGroupExpenses";

const GroupExpenses = ({ groupId }) => {
    const dispatch = useDispatch();
    const { expenses, loading, error } = useSelector((state) => state.groupExpenses);
    const members = useSelector((state) => state.groupMembers.members);

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

    // Fetch expenses on mount
    useEffect(() => {
        dispatch(setLoading(true));
        const token = localStorage.getItem("token");
        const fetchExpenses = async () => {
            try {
                const expensesList = await getGroupExpenses(token, groupId);
                dispatch(setGroupExpense(expensesList));
            } catch (error) {
                dispatch(setGroupExpenseError(error.message));
            } finally {
                dispatch(setLoading(false));
            }
        };
        fetchExpenses();
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
            const message = await addNewExpenseToGroup(token, newExpenseData);
            alert(message);  // Notify user on success
            handleAddExpenseModalClose();  // Close modal on success
            setSnackbarOpen(true);  // Open feedback snackbar
            // Reset fields
            setExpenseName("");
            setAmount("");
            setPaidBy("");
            setSplitBetween([]);
        } catch (error) {
            dispatch(setGroupExpenseError(error.message));
        }
    };

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h6" gutterBottom>
                Group Expenses
            </Typography>
            <Button variant="contained" color="primary" onClick={handleAddExpenseModalOpen}>
                Add New Expense
            </Button>

            {/* Display loading indicator */}
            {loading ? (
                <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />
            ) : (
                <Paper elevation={3} sx={{ padding: 2, marginTop: 3, backgroundColor: "#333", borderRadius: 2 }}>
                    <Typography variant="h6" color="secondary" gutterBottom>
                        Expenses
                    </Typography>
                    <List>
                        {expenses.length > 0 ? (
                            expenses.map((expense) => (
                                <React.Fragment key={expense.id}>
                                    <ListItem>
                                        <ListItemText
                                            primary={expense.expense_name}
                                            secondary={`Amount: $${expense.amount} - Paid by: ${members.find((m) => m.user_id === expense.paid_by)?.username || "Unknown"
                                                }`}
                                            sx={{ color: "white" }}
                                        />
                                    </ListItem>
                                    <Divider sx={{ backgroundColor: "#555" }} />
                                </React.Fragment>
                            ))
                        ) : (
                            <Typography variant="body1" color="white" sx={{ textAlign: "center", padding: 2 }}>
                                No expenses found for this group.
                            </Typography>
                        )}
                    </List>
                </Paper>
            )}

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
                    <Typography variant="h6" gutterBottom>Add New Expense</Typography>

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

                    <Button variant="contained" color="primary" onClick={handleAddExpense} fullWidth>
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
                <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
                    Expense added successfully!
                </Alert>
            </Snackbar>

            {/* Error alert if any */}
            {error && (
                <Snackbar open={!!error} autoHideDuration={3000} onClose={() => dispatch(setGroupExpenseError(null))}>
                    <Alert onClose={() => dispatch(setGroupExpenseError(null))} severity="error" sx={{ width: '100%' }}>
                        {error}
                    </Alert>
                </Snackbar>
            )}
        </Box>
    );
};

export default GroupExpenses;
