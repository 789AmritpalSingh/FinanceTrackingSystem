import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  setError,
  setExpenses,
  setLoading,
} from "../../redux/personalExpensesSlice";

const PersonalExpenses = () => {
  const dispatch = useDispatch();
  const { expenses, loading, error } = useSelector(
    (state) => state.personalExpenses
  );

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

      console.log(`Response - ${response}`);

      if (response.ok) {
        const data = await response.json();
        console.log(`Data = ${data}`);
        dispatch(setExpenses(data));
      } else {
        console.error("Failed to fetch expenses.");
        dispatch(setError("Failed to fetch expenses"));
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
      dispatch(setError("Error fetching expenses"));
    } finally {
      // set loading to false
      dispatch(setLoading(false));
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
    </Container>
  );
};

export default PersonalExpenses;
