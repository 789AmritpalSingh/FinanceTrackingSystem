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
  Modal,
  IconButton,
  TextField,
  Button,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import {
  setError,
  setExpenses,
  setLoading,
} from "../../redux/personalExpensesSlice";

const PersonalExpenses = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // 'success' or 'error'
  const handleSnackbarClose = () => {
    // Close the snackbar
    setSnackbarOpen(false);
  };
  const dispatch = useDispatch();
  const { expenses, loading, error } = useSelector(
    (state) => state.personalExpenses
  );

  const [modalOpen, setModalOpen] = useState(false); // Modal open/close state
  const [newExpense, setNewExpense] = useState({
    amount: "",
    category: "",
    date: "",
    description: "",
  }); // form state for new expense getting added.

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  // Fetch expenses from backend
  const fetchExpenses = async () => {
    const token = localStorage.getItem("token"); // Get JWT token from local storage

    try {
      // Set the loading to true
      dispatch(setLoading(true));
      const response = await fetch("http://localhost:5000/get_user_expenses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(setExpenses(data));
      } else {
        setSnackbarSeverity("error");
        setSnackbarMessage("Failed to get information about your expenses.");
        setSnackbarOpen(true);
        dispatch(setError("Failed to fetch expenses"));
      }
    } catch (error) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Error getting expense information");
      setSnackbarOpen(true);
      dispatch(setError("Error fetching expenses"));
    } finally {
      // set loading to false
      dispatch(setLoading(false));
    }
  };

  // Add new expense to personal expenses of the user
  const handleAddExpense = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "http://localhost:5000/add_individual_expense",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newExpense),
        }
      );

      // if the backend sent the ok response
      if (response.ok) {
        setSnackbarSeverity("success");
        setSnackbarMessage("Expense added successfully.");
        setSnackbarOpen(true);
        // Refresh the expenses list
        fetchExpenses();
        handleModalClose(); // Close modal after adding expense
      } else {
        setSnackbarSeverity("error");
        setSnackbarMessage("Failed to add expense.");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Error adding expense.");
      setSnackbarOpen(true);
    }
  };

  // Fetch expenses on component mount
  useEffect(() => {
    fetchExpenses();
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
            <IconButton onClick={handleModalOpen} sx={{ color: "#00e676" }}>
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
                </TableRow>
              </TableHead>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow
                    key={expense.id}
                    sx={{
                      "&:nth-of-type(odd)": { backgroundColor: "#252525" },
                      "&:nth-of-type(even)": { backgroundColor: "#1A1A1A" },
                    }}
                  >
                    <TableCell align="left" sx={{ color: "#e0e0e0" }}>
                      ${expense.amount}
                    </TableCell>
                    <TableCell align="left" sx={{ color: "#e0e0e0" }}>
                      {expense.category}
                    </TableCell>
                    <TableCell align="left" sx={{ color: "#e0e0e0" }}>
                      {expense.date}
                    </TableCell>
                    <TableCell align="left" sx={{ color: "#e0e0e0" }}>
                      {expense.description}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* Modal for Adding Expense */}
      <Modal
        open={modalOpen}
        onClose={handleModalClose}
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
            bgcolor: "#2C2C2C", // Dark background for the modal
            boxShadow: 24,
            p: 4,
            borderRadius: 2, // Slight border radius
            border: "1px solid #333", // Subtle border matching dark theme
            color: "#DDD", // Light grey text for better readability on dark backgrounds
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

      {/* Snackbar for success or error messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PersonalExpenses;
